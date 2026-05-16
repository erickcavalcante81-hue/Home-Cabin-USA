import asyncio
import json
import logging
from datetime import datetime

from sqlalchemy import select

from .config import settings
from .database import SessionLocal
from .models import EventoOperacional, Funcionario, Veiculo
from .redis_client import get_redis
from .schemas import EventoQueueMessage

logger = logging.getLogger(__name__)


def _upsert_veiculo(db, placa: str, id_qr_code: str) -> Veiculo:
    veiculo = db.scalar(select(Veiculo).where(Veiculo.id_qr_code == id_qr_code))
    if veiculo is None:
        veiculo = Veiculo(placa=placa, id_qr_code=id_qr_code)
        db.add(veiculo)
        db.flush()
    return veiculo


def _upsert_funcionario(db, nome: str, cor_uniforme: str) -> Funcionario:
    funcionario = db.scalar(select(Funcionario).where(Funcionario.nome == nome))
    if funcionario is None:
        funcionario = Funcionario(nome=nome, cor_uniforme=cor_uniforme)
        db.add(funcionario)
        db.flush()
    return funcionario


def _persist_event(message: EventoQueueMessage) -> EventoOperacional:
    db = SessionLocal()
    try:
        veiculo = _upsert_veiculo(db, message.placa, message.id_qr_code)
        funcionario = _upsert_funcionario(db, message.funcionario_nome, message.cor_uniforme)
        evento = EventoOperacional(
            timestamp=message.timestamp,
            veiculo_id=veiculo.id,
            funcionario_id=funcionario.id,
            tipo_servico=message.tipo_servico,
            camera_id=message.camera_id,
        )
        db.add(evento)
        db.commit()
        db.refresh(evento)
        return evento
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


async def run_worker() -> None:
    """Consome a fila Redis populada pelo ai-engine e republica no canal do dashboard."""
    redis = get_redis()
    logger.info("Worker iniciado. Escutando fila '%s'", settings.redis_queue)
    try:
        while True:
            try:
                _, raw = await redis.blpop(settings.redis_queue, timeout=0)
                message = EventoQueueMessage.model_validate_json(raw)
                evento = await asyncio.to_thread(_persist_event, message)
                broadcast_payload = {
                    "id": evento.id,
                    "timestamp": evento.timestamp.isoformat(),
                    "veiculo_id": evento.veiculo_id,
                    "funcionario_id": evento.funcionario_id,
                    "placa": message.placa,
                    "funcionario_nome": message.funcionario_nome,
                    "tipo_servico": evento.tipo_servico,
                    "camera_id": evento.camera_id,
                }
                await redis.publish(
                    settings.redis_pubsub_channel, json.dumps(broadcast_payload)
                )
                logger.info(
                    "Evento persistido id=%s tipo=%s placa=%s",
                    evento.id,
                    evento.tipo_servico,
                    message.placa,
                )
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                logger.exception("Erro processando evento da fila: %s", exc)
                await asyncio.sleep(1)
    finally:
        await redis.aclose()

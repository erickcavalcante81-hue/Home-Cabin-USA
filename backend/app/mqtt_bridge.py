"""Ponte MQTT → fila Redis.

Consome eventos publicados pelo WEG Vision AI (ou qualquer plataforma de
visão computacional que fale MQTT) e os converte para o formato
`EventoQueueMessage` da nossa fila Redis. A partir daí, o worker
existente (`worker.py`) cuida da persistência e broadcast — nenhuma
outra parte do sistema precisa saber que o evento veio de fora.

Payload esperado no MQTT (acordo de integração):

    {
      "ts": "2026-05-16T14:32:18Z",
      "camera_id": "CAM-RF-07",
      "unidade": "ramos_ferreira",
      "veiculo": {"placa": "ABC1D23", "qr": "QR-FROTA-001"},
      "funcionario": {"nome": "João Silva", "uniforme": "azul"},
      "evento": "polimento",
      "extra": {"box": 4, "duracao_s": 312}
    }
"""
from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime, timezone

import asyncio_mqtt as mqtt

from .config import settings
from .redis_client import get_redis

logger = logging.getLogger(__name__)


def _normalize(raw: dict) -> dict | None:
    """Traduz o payload genérico do WEG para o vocabulário da Braga."""
    try:
        veh = raw.get("veiculo") or {}
        emp = raw.get("funcionario") or {}
        extra = raw.get("extra") or {}
        ts = raw.get("ts") or datetime.now(tz=timezone.utc).isoformat()
        unidade = raw.get("unidade") or "ramos_ferreira"
        return {
            "timestamp": ts,
            "placa": veh.get("placa", "DESCONHECIDA"),
            "id_qr_code": veh.get("qr", f"QR-{veh.get('placa', 'X')}"),
            "funcionario_nome": emp.get("nome", "Não identificado"),
            "cor_uniforme": emp.get("uniforme", "n/a"),
            "tipo_servico": raw.get("evento", "Atividade").title(),
            "camera_id": raw.get("camera_id"),
            "unidade": unidade,
            "box": extra.get("box"),
        }
    except Exception:
        logger.exception("Falha ao normalizar payload MQTT: %s", raw)
        return None


async def run_mqtt_bridge() -> None:
    """Conecta ao broker MQTT e republica eventos na fila Redis."""
    if not settings.mqtt_enabled:
        logger.info("MQTT bridge desabilitado (MQTT_ENABLED=false). Ignorando.")
        return

    topics = [t.strip() for t in settings.mqtt_topics.split(",") if t.strip()]
    redis = get_redis()
    logger.info("MQTT bridge iniciada | broker=%s:%s | topics=%s",
                settings.mqtt_host, settings.mqtt_port, topics)

    while True:
        try:
            async with mqtt.Client(
                hostname=settings.mqtt_host,
                port=settings.mqtt_port,
                username=settings.mqtt_username or None,
                password=settings.mqtt_password or None,
                client_id="superskill-bridge",
            ) as client:
                async with client.messages() as messages:
                    for topic in topics:
                        await client.subscribe(topic)
                    async for msg in messages:
                        try:
                            raw = json.loads(msg.payload.decode("utf-8"))
                        except json.JSONDecodeError:
                            logger.warning("Payload não-JSON em %s; ignorado.", msg.topic)
                            continue
                        normalized = _normalize(raw)
                        if not normalized:
                            continue
                        await redis.rpush(
                            settings.redis_queue, json.dumps(normalized)
                        )
                        logger.info(
                            "Evento WEG enfileirado | %s | %s @ %s",
                            normalized.get("camera_id"),
                            normalized.get("funcionario_nome"),
                            normalized.get("placa"),
                        )
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            logger.exception("MQTT bridge caiu (%s). Reconectando em 5s.", exc)
            await asyncio.sleep(5)

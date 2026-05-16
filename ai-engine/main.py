"""Pipeline: stream -> detectores -> Redis queue.

Publica EventoQueueMessage como JSON na fila lida pelo backend.
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
import random
from datetime import datetime, timezone

import redis.asyncio as aioredis

from detectors import ActionDetector, EmployeeDetector, VehicleDetector
from stream_simulator import StreamSimulator

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s :: %(message)s"
)
logger = logging.getLogger("superskill.ai")


def _build_redis() -> aioredis.Redis:
    return aioredis.Redis(
        host=os.getenv("REDIS_HOST", "redis"),
        port=int(os.getenv("REDIS_PORT", "6379")),
        decode_responses=True,
    )


async def run_pipeline() -> None:
    queue_name = os.getenv("REDIS_QUEUE", "eventos_operacionais")
    redis = _build_redis()

    vehicle_detector = VehicleDetector(mock=True)
    employee_detector = EmployeeDetector(mock=True)
    action_detector = ActionDetector()
    stream = StreamSimulator()

    logger.info(
        "AI-engine iniciado | cameras=%s | tick=%ss | fila=%s",
        stream.num_cameras,
        stream.tick_interval,
        queue_name,
    )

    try:
        async for tick in stream.stream():
            vehicles = vehicle_detector.detect(tick.frame)
            employees = employee_detector.detect(tick.frame)
            events = action_detector.infer(vehicles, employees)

            for evt in events:
                # 5% das observações marcamos como retrabalho para alimentar KPI.
                tipo_servico = evt.tipo_servico
                if random.random() < 0.05:
                    tipo_servico = f"{tipo_servico} (Retrabalho)"

                payload = {
                    "timestamp": datetime.now(tz=timezone.utc).isoformat(),
                    "placa": evt.placa,
                    "id_qr_code": evt.id_qr_code,
                    "funcionario_nome": evt.funcionario_nome,
                    "cor_uniforme": evt.cor_uniforme,
                    "tipo_servico": tipo_servico,
                    "camera_id": tick.camera_id,
                }
                await redis.rpush(queue_name, json.dumps(payload))
                logger.info(
                    "Evento enfileirado | %s | %s @ %s -> %s",
                    tick.camera_id,
                    evt.funcionario_nome,
                    evt.placa,
                    tipo_servico,
                )
    finally:
        await redis.aclose()


if __name__ == "__main__":
    try:
        asyncio.run(run_pipeline())
    except KeyboardInterrupt:
        logger.info("AI-engine encerrado.")

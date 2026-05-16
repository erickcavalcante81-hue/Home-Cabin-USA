import asyncio
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..config import settings
from ..redis_client import get_redis

logger = logging.getLogger(__name__)

router = APIRouter()


class ConnectionManager:
    def __init__(self) -> None:
        self._clients: set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, ws: WebSocket) -> None:
        await ws.accept()
        async with self._lock:
            self._clients.add(ws)

    async def disconnect(self, ws: WebSocket) -> None:
        async with self._lock:
            self._clients.discard(ws)

    async def broadcast(self, message: str) -> None:
        async with self._lock:
            clients = list(self._clients)
        for ws in clients:
            try:
                await ws.send_text(message)
            except Exception:
                await self.disconnect(ws)


manager = ConnectionManager()


async def run_pubsub_listener() -> None:
    """Escuta o canal Redis e propaga via WebSocket para todos os clientes."""
    redis = get_redis()
    pubsub = redis.pubsub()
    await pubsub.subscribe(settings.redis_pubsub_channel)
    logger.info("PubSub escutando canal '%s'", settings.redis_pubsub_channel)
    try:
        async for raw in pubsub.listen():
            if raw is None or raw.get("type") != "message":
                continue
            data = raw.get("data")
            if isinstance(data, bytes):
                data = data.decode("utf-8")
            await manager.broadcast(data)
    finally:
        await pubsub.unsubscribe(settings.redis_pubsub_channel)
        await pubsub.close()
        await redis.aclose()


@router.websocket("/ws/dashboard")
async def dashboard_ws(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception:
        await manager.disconnect(websocket)

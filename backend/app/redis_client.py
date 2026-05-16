import redis.asyncio as aioredis

from .config import settings


def get_redis() -> aioredis.Redis:
    return aioredis.Redis(
        host=settings.redis_host,
        port=settings.redis_port,
        decode_responses=True,
    )

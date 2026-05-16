import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .mqtt_bridge import run_mqtt_bridge
from .routers import dashboard, ws
from .worker import run_worker

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s :: %(message)s")
logger = logging.getLogger("superskill.backend")


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    logger.info("Schema garantido no PostgreSQL.")

    worker_task = asyncio.create_task(run_worker(), name="redis_worker")
    pubsub_task = asyncio.create_task(ws.run_pubsub_listener(), name="ws_pubsub")
    mqtt_task = asyncio.create_task(run_mqtt_bridge(), name="mqtt_bridge")
    logger.info("Tasks de background iniciadas.")

    try:
        yield
    finally:
        for task in (worker_task, pubsub_task, mqtt_task):
            task.cancel()
        await asyncio.gather(worker_task, pubsub_task, mqtt_task, return_exceptions=True)
        logger.info("Backend finalizado.")


app = FastAPI(
    title="Super Skill IA — Torre de Controle",
    version="0.1.0",
    description="Backend FastAPI do gêmeo digital de oficinas automotivas.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(ws.router)


@app.get("/health")
def health():
    return {"status": "ok"}

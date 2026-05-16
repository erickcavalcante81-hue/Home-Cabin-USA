"""Simulador de stream RTSP de 14 câmeras 4K.

Em produção este módulo abriria `cv2.VideoCapture("rtsp://...")` para cada
câmera e produziria frames em batch. Para acelerar o vibe-coding, ele
apenas emite um identificador de câmera e um frame `None` — os detectores
sabem cair no caminho mock quando o frame é None.
"""
from __future__ import annotations

import asyncio
import os
from dataclasses import dataclass


@dataclass
class StreamTick:
    camera_id: str
    frame: object | None  # np.ndarray em produção


class StreamSimulator:
    def __init__(
        self,
        num_cameras: int | None = None,
        tick_interval: float | None = None,
    ) -> None:
        self.num_cameras = num_cameras or int(os.getenv("AI_NUM_CAMERAS", "14"))
        self.tick_interval = tick_interval or float(
            os.getenv("AI_TICK_INTERVAL_SECONDS", "2")
        )

    async def stream(self):
        """Gera ticks em round-robin pelas câmeras configuradas."""
        idx = 0
        while True:
            camera_id = f"CAM-{(idx % self.num_cameras) + 1:02d}"
            yield StreamTick(camera_id=camera_id, frame=None)
            idx += 1
            await asyncio.sleep(self.tick_interval)

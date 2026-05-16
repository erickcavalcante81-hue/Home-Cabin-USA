"""Detecta funcionários via YOLOv8 (mockado por padrão).

Em produção, integra ultralytics.YOLO + ReID por cor de uniforme.
Aqui retornamos bounding boxes simulados para permitir teste end-to-end.
"""
from __future__ import annotations

import random
from dataclasses import dataclass


@dataclass
class EmployeeDetection:
    nome: str
    cor_uniforme: str
    bbox: tuple[int, int, int, int]
    centroid: tuple[float, float]


_MOCK_EQUIPE = [
    ("João Silva", "azul"),
    ("Maria Costa", "verde"),
    ("Pedro Alves", "azul"),
    ("Ana Souza", "vermelho"),
    ("Lucas Pereira", "amarelo"),
    ("Carla Mendes", "verde"),
]


class EmployeeDetector:
    """Stub YOLOv8 — substituir por `ultralytics.YOLO("yolov8n.pt")` quando treinado."""

    def __init__(self, mock: bool = True, model_path: str | None = None) -> None:
        self.mock = mock
        self.model_path = model_path

    def detect(self, frame=None) -> list[EmployeeDetection]:
        if self.mock or frame is None:
            return self._mock_detect()
        return self._yolo_detect(frame)

    def _mock_detect(self) -> list[EmployeeDetection]:
        detections: list[EmployeeDetection] = []
        for nome, cor in random.sample(_MOCK_EQUIPE, k=random.randint(1, 3)):
            x = random.randint(50, 1850)
            y = random.randint(50, 1000)
            w = random.randint(60, 120)
            h = random.randint(140, 220)
            detections.append(
                EmployeeDetection(
                    nome=nome,
                    cor_uniforme=cor,
                    bbox=(x, y, w, h),
                    centroid=(x + w / 2, y + h / 2),
                )
            )
        return detections

    def _yolo_detect(self, frame) -> list[EmployeeDetection]:
        raise NotImplementedError(
            "Substituir por inferência real do YOLOv8 + ReID por cor de uniforme."
        )

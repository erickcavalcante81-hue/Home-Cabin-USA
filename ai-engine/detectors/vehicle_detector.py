"""Detecta veículos via QR Code A4 fixado no teto.

Em produção, usa cv2.QRCodeDetector sobre frames do RTSP.
Em desenvolvimento, retorna detecções simuladas para destravar o pipeline.
"""
from __future__ import annotations

import random
from dataclasses import dataclass

import cv2
import numpy as np


@dataclass
class VehicleDetection:
    placa: str
    id_qr_code: str
    bbox: tuple[int, int, int, int]
    centroid: tuple[float, float]


_MOCK_FROTA = [
    ("ABC1D23", "QR-FROTA-001"),
    ("XYZ9K88", "QR-FROTA-002"),
    ("HCU2024", "QR-FROTA-003"),
    ("BRA1S2C", "QR-FROTA-004"),
    ("RJX5T6Y", "QR-FROTA-005"),
]


class VehicleDetector:
    def __init__(self, mock: bool = True) -> None:
        self.mock = mock
        self._qr = cv2.QRCodeDetector()

    def detect(self, frame: np.ndarray | None = None) -> list[VehicleDetection]:
        if self.mock or frame is None:
            return self._mock_detect()
        return self._cv_detect(frame)

    def _mock_detect(self) -> list[VehicleDetection]:
        detections: list[VehicleDetection] = []
        for placa, qr in random.sample(_MOCK_FROTA, k=random.randint(1, 2)):
            x = random.randint(80, 1800)
            y = random.randint(80, 1000)
            w = h = random.randint(220, 360)
            detections.append(
                VehicleDetection(
                    placa=placa,
                    id_qr_code=qr,
                    bbox=(x, y, w, h),
                    centroid=(x + w / 2, y + h / 2),
                )
            )
        return detections

    def _cv_detect(self, frame: np.ndarray) -> list[VehicleDetection]:
        data, points, _ = self._qr.detectAndDecodeMulti(frame)
        results: list[VehicleDetection] = []
        if not data or points is None:
            return results
        for payload, polygon in zip(data, points):
            if not payload:
                continue
            xs = polygon[:, 0]
            ys = polygon[:, 1]
            x, y = int(xs.min()), int(ys.min())
            w, h = int(xs.max() - xs.min()), int(ys.max() - ys.min())
            placa, _, qr_id = payload.partition("|")
            results.append(
                VehicleDetection(
                    placa=placa or "DESCONHECIDA",
                    id_qr_code=qr_id or payload,
                    bbox=(x, y, w, h),
                    centroid=(x + w / 2, y + h / 2),
                )
            )
        return results

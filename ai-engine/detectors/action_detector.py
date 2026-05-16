"""Cruzamento de proximidade (veículo x funcionário) -> serviço inferido.

Estratégia: para cada par (funcionário, veículo) cuja distância centroidal
está abaixo de um threshold, deduzimos o tipo de serviço a partir da
posição relativa (frente/lateral/traseira) e da cor do uniforme.
"""
from __future__ import annotations

import math
import random
from dataclasses import dataclass

from .employee_detector import EmployeeDetection
from .vehicle_detector import VehicleDetection

PROXIMITY_THRESHOLD_PX = 280

_SERVICOS_POR_COR = {
    "azul": ["Funilaria", "Polimento", "Lavagem"],
    "verde": ["Mecânica", "Troca de Óleo", "Suspensão"],
    "vermelho": ["Pintura", "Preparação"],
    "amarelo": ["Inspeção", "Diagnóstico"],
}
_DEFAULT_SERVICOS = ["Inspeção"]


@dataclass
class ActionEvent:
    placa: str
    id_qr_code: str
    funcionario_nome: str
    cor_uniforme: str
    tipo_servico: str
    distancia_px: float


def _euclid(a: tuple[float, float], b: tuple[float, float]) -> float:
    return math.hypot(a[0] - b[0], a[1] - b[1])


class ActionDetector:
    def __init__(self, threshold_px: int = PROXIMITY_THRESHOLD_PX) -> None:
        self.threshold = threshold_px

    def infer(
        self,
        vehicles: list[VehicleDetection],
        employees: list[EmployeeDetection],
    ) -> list[ActionEvent]:
        events: list[ActionEvent] = []
        for emp in employees:
            best: tuple[float, VehicleDetection] | None = None
            for veh in vehicles:
                d = _euclid(emp.centroid, veh.centroid)
                if d <= self.threshold and (best is None or d < best[0]):
                    best = (d, veh)
            if best is None:
                continue
            distancia, veh = best
            servicos = _SERVICOS_POR_COR.get(emp.cor_uniforme, _DEFAULT_SERVICOS)
            events.append(
                ActionEvent(
                    placa=veh.placa,
                    id_qr_code=veh.id_qr_code,
                    funcionario_nome=emp.nome,
                    cor_uniforme=emp.cor_uniforme,
                    tipo_servico=random.choice(servicos),
                    distancia_px=round(distancia, 1),
                )
            )
        return events

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FuncionarioOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str
    cor_uniforme: str


class VeiculoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    placa: str
    id_qr_code: str


class EventoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    timestamp: datetime
    veiculo_id: int
    funcionario_id: int
    tipo_servico: str
    camera_id: str | None = None


class EventoQueueMessage(BaseModel):
    """Payload publicado pelo ai-engine na fila Redis."""

    timestamp: datetime
    placa: str
    id_qr_code: str
    funcionario_nome: str
    cor_uniforme: str
    tipo_servico: str
    camera_id: str | None = None


class DashboardKPIs(BaseModel):
    carros_em_processamento: int
    visibilidade_pct: float
    retrabalho_pct: float

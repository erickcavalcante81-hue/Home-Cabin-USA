from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import EventoOperacional, Veiculo
from ..schemas import DashboardKPIs, EventoOut

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/eventos", response_model=list[EventoOut])
def list_recent_events(limit: int = 50, db: Session = Depends(get_db)):
    stmt = select(EventoOperacional).order_by(EventoOperacional.timestamp.desc()).limit(limit)
    return list(db.scalars(stmt))


@router.get("/kpis", response_model=DashboardKPIs)
def get_kpis(db: Session = Depends(get_db)):
    one_hour_ago = datetime.now(tz=timezone.utc) - timedelta(hours=1)

    carros_em_processamento = db.scalar(
        select(func.count(func.distinct(EventoOperacional.veiculo_id)))
        .where(EventoOperacional.timestamp >= one_hour_ago)
    ) or 0

    total_veiculos = db.scalar(select(func.count(Veiculo.id))) or 0
    visibilidade_base = 20.0
    visibilidade_pct = min(95.0, visibilidade_base + min(75.0, total_veiculos * 1.5))

    retrabalhos = db.scalar(
        select(func.count(EventoOperacional.id))
        .where(EventoOperacional.tipo_servico.ilike("%retrabalho%"))
    ) or 0
    total_eventos = db.scalar(select(func.count(EventoOperacional.id))) or 0
    retrabalho_pct = (retrabalhos / total_eventos * 100.0) if total_eventos else 0.0

    return DashboardKPIs(
        carros_em_processamento=carros_em_processamento,
        visibilidade_pct=round(visibilidade_pct, 1),
        retrabalho_pct=round(retrabalho_pct, 1),
    )

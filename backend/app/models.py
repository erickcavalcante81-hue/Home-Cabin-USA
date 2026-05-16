from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Funcionario(Base):
    __tablename__ = "funcionarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nome: Mapped[str] = mapped_column(String(120), nullable=False)
    cor_uniforme: Mapped[str] = mapped_column(String(30), nullable=False)

    eventos: Mapped[list["EventoOperacional"]] = relationship(
        back_populates="funcionario", cascade="all, delete-orphan"
    )


class Veiculo(Base):
    __tablename__ = "veiculos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    placa: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    id_qr_code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)

    eventos: Mapped[list["EventoOperacional"]] = relationship(
        back_populates="veiculo", cascade="all, delete-orphan"
    )


class EventoOperacional(Base):
    __tablename__ = "eventos_operacionais"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )
    veiculo_id: Mapped[int] = mapped_column(ForeignKey("veiculos.id"), nullable=False)
    funcionario_id: Mapped[int] = mapped_column(ForeignKey("funcionarios.id"), nullable=False)
    tipo_servico: Mapped[str] = mapped_column(String(80), nullable=False)
    camera_id: Mapped[str | None] = mapped_column(String(32), nullable=True)

    veiculo: Mapped[Veiculo] = relationship(back_populates="eventos")
    funcionario: Mapped[Funcionario] = relationship(back_populates="eventos")

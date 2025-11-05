from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pathfinder.db")

# Crear engine
engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False}
)


def init_db():
    """Inicializa la base de datos creando todas las tablas"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency para obtener una sesión de base de datos"""
    with Session(engine) as session:
        yield session
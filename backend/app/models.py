from typing import Optional
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    """Modelo de usuario para autenticación"""
    __tablename__ = "users" # type: ignore
    
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True, max_length=50)
    hashed_password: str


class Node(SQLModel, table=True):
    """Modelo de nodo del grafo"""
    __tablename__ = "nodes" # type: ignore
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True, max_length=100)


class Edge(SQLModel, table=True):
    """Modelo de arista del grafo"""
    __tablename__ = "edges" # type: ignore
    
    id: Optional[int] = Field(default=None, primary_key=True)
    src_id: int = Field(foreign_key="nodes.id", index=True)
    dst_id: int = Field(foreign_key="nodes.id", index=True)
    weight: float = Field(gt=0)
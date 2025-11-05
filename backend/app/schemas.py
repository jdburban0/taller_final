from pydantic import BaseModel, Field
from typing import List, Optional


# ========== AUTH SCHEMAS ==========
class UserCreate(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


# ========== GRAPH SCHEMAS ==========
class NodeCreate(BaseModel):
    name: str


class NodeResponse(BaseModel):
    id: int
    name: str


class EdgeCreate(BaseModel):
    src_id: int
    dst_id: int
    weight: float = Field(gt=0, description="Weight must be greater than 0")


class EdgeResponse(BaseModel):
    id: int
    src_id: int
    dst_id: int
    weight: float


# ========== ALGORITHM SCHEMAS ==========
class BFSTreeNode(BaseModel):
    node_id: int
    parent_id: Optional[int]
    depth: int


class BFSResponse(BaseModel):
    order: List[int]
    tree: List[BFSTreeNode]


class DijkstraResponse(BaseModel):
    path: List[int]
    distance: float
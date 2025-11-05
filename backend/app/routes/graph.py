from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from ..db import get_session
from ..models import Node, Edge, User
from ..schemas import NodeCreate, NodeResponse, EdgeCreate, EdgeResponse
from ..deps import get_current_user

router = APIRouter()


# ========== NODES ==========
@router.post("/nodes", response_model=NodeResponse, status_code=status.HTTP_201_CREATED)
def create_node(
    node_data: NodeCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Crea un nuevo nodo"""
    statement = select(Node).where(Node.name == node_data.name)
    existing_node = session.exec(statement).first()
    
    if existing_node:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Node with name '{node_data.name}' already exists"
        )
    
    node = Node(name=node_data.name)
    session.add(node)
    session.commit()
    session.refresh(node)
    
    return NodeResponse(id=node.id, name=node.name) # type: ignore


@router.get("/nodes", response_model=List[NodeResponse])
def list_nodes(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Lista todos los nodos"""
    statement = select(Node)
    nodes = session.exec(statement).all()
    return [NodeResponse(id=n.id, name=n.name) for n in nodes] # type: ignore


@router.delete("/nodes/{node_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_node(
    node_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Elimina un nodo y sus aristas asociadas"""
    node = session.get(Node, node_id)
    
    if not node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Node with id {node_id} not found"
        )
    
    # Eliminar aristas donde este nodo es origen o destino
    statement = select(Edge).where(
        (Edge.src_id == node_id) | (Edge.dst_id == node_id)
    )
    edges = session.exec(statement).all()
    for edge in edges:
        session.delete(edge)
    
    # Eliminar nodo
    session.delete(node)
    session.commit()


# ========== EDGES ==========
@router.post("/edges", response_model=EdgeResponse, status_code=status.HTTP_201_CREATED)
def create_edge(
    edge_data: EdgeCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Crea una nueva arista"""
    # Validar que los nodos existen
    src_node = session.get(Node, edge_data.src_id)
    dst_node = session.get(Node, edge_data.dst_id)
    
    if not src_node:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Source node with id {edge_data.src_id} not found"
        )
    
    if not dst_node:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Destination node with id {edge_data.dst_id} not found"
        )
    
    # Validar peso positivo
    if edge_data.weight <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Weight must be greater than 0"
        )
    
    edge = Edge(
        src_id=edge_data.src_id,
        dst_id=edge_data.dst_id,
        weight=edge_data.weight
    )
    
    session.add(edge)
    session.commit()
    session.refresh(edge)
    
    return EdgeResponse(
        id=edge.id, # type: ignore
        src_id=edge.src_id,
        dst_id=edge.dst_id,
        weight=edge.weight
    )


@router.get("/edges", response_model=List[EdgeResponse])
def list_edges(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Lista todas las aristas"""
    statement = select(Edge)
    edges = session.exec(statement).all()
    return [
        EdgeResponse(id=e.id, src_id=e.src_id, dst_id=e.dst_id, weight=e.weight) # type: ignore
        for e in edges
    ]


@router.delete("/edges/{edge_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_edge(
    edge_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Elimina una arista"""
    edge = session.get(Edge, edge_id)
    
    if not edge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Edge with id {edge_id} not found"
        )
    
    session.delete(edge)
    session.commit()
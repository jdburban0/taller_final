from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from collections import deque
import heapq

from ..db import get_session
from ..models import Node, Edge, User
from ..schemas import BFSResponse, BFSTreeNode, DijkstraResponse
from ..deps import get_current_user

router = APIRouter()


@router.get("/bfs", response_model=BFSResponse)
def bfs_traversal(
    start_id: int = Query(..., description="ID del nodo inicial"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Recorrido BFS desde un nodo inicial"""
    # Verificar que el nodo existe
    start_node = session.get(Node, start_id)
    if not start_node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Node with id {start_id} not found"
        )
    
    # Obtener todas las aristas
    statement = select(Edge)
    edges = session.exec(statement).all()
    
    # Construir grafo de adyacencia
    graph = {}
    for edge in edges:
        if edge.src_id not in graph:
            graph[edge.src_id] = []
        graph[edge.src_id].append(edge.dst_id)
    
    # BFS
    visited = set()
    queue = deque([start_id])
    order = []
    parent = {start_id: None}
    depth = {start_id: 0}
    
    while queue:
        node_id = queue.popleft()
        
        if node_id in visited:
            continue
        
        visited.add(node_id)
        order.append(node_id)
        
        # Procesar vecinos
        for neighbor in graph.get(node_id, []):
            if neighbor not in visited and neighbor not in parent:
                parent[neighbor] = node_id # type: ignore
                depth[neighbor] = depth[node_id] + 1
                queue.append(neighbor)
    
    # Construir árbol BFS
    tree = []
    for node_id in order:
        tree.append(BFSTreeNode(
            node_id=node_id,
            parent_id=parent[node_id],
            depth=depth[node_id]
        ))
    
    return BFSResponse(order=order, tree=tree)


@router.get("/shortest-path", response_model=DijkstraResponse)
def dijkstra_shortest_path(
    src_id: int = Query(..., description="ID del nodo origen"),
    dst_id: int = Query(..., description="ID del nodo destino"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Encuentra el camino más corto usando Dijkstra"""
    # Verificar que los nodos existen
    src_node = session.get(Node, src_id)
    dst_node = session.get(Node, dst_id)
    
    if not src_node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Source node with id {src_id} not found"
        )
    
    if not dst_node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Destination node with id {dst_id} not found"
        )
    
    # Obtener todas las aristas
    statement = select(Edge)
    edges = session.exec(statement).all()
    
    # Construir grafo de adyacencia con pesos
    graph = {}
    for edge in edges:
        if edge.src_id not in graph:
            graph[edge.src_id] = []
        graph[edge.src_id].append((edge.dst_id, edge.weight))
    
    # Dijkstra
    dist = {src_id: 0}
    prev = {}
    pq = [(0, src_id)]  # (distancia, nodo)
    visited = set()
    
    while pq:
        current_dist, current_node = heapq.heappop(pq)
        
        if current_node in visited:
            continue
        
        visited.add(current_node)
        
        if current_node == dst_id:
            break
        
        for neighbor, weight in graph.get(current_node, []):
            if neighbor in visited:
                continue
            
            new_dist = current_dist + weight
            
            if neighbor not in dist or new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                prev[neighbor] = current_node
                heapq.heappush(pq, (new_dist, neighbor))
    
    # Verificar si existe camino
    if dst_id not in dist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No path found between nodes {src_id} and {dst_id}"
        )
    
    # Reconstruir camino
    path = []
    current = dst_id
    while current is not None:
        path.append(current)
        current = prev.get(current)
    
    path.reverse()
    
    return DijkstraResponse(path=path, distance=dist[dst_id])
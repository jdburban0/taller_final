#!/usr/bin/env python3
"""
Script de carga de datos desde CSV a la base de datos
Idempotente: puede ejecutarse múltiples veces sin duplicar datos
"""
import sys
import csv
from pathlib import Path

# Agregar el directorio parent al path para importar app
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlmodel import Session, select
from app.db import engine, init_db
from app.models import Node, Edge


def load_nodes(session: Session, csv_path: str) -> dict:
    """Carga nodos desde CSV y retorna mapeo nombre -> id"""
    print(f"📂 Cargando nodos desde {csv_path}...")
    
    name_to_id = {}
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            name = row['name'].strip()
            
            # Verificar si ya existe
            statement = select(Node).where(Node.name == name)
            existing_node = session.exec(statement).first()
            
            if existing_node:
                name_to_id[name] = existing_node.id
                print(f"  ⏭️  Nodo '{name}' ya existe (id={existing_node.id})")
            else:
                node = Node(name=name)
                session.add(node)
                session.commit()
                session.refresh(node)
                name_to_id[name] = node.id
                print(f"  ✅ Nodo '{name}' creado (id={node.id})")
    
    return name_to_id


def load_edges(session: Session, csv_path: str, name_to_id: dict):
    """Carga aristas desde CSV usando el mapeo de nombres a IDs"""
    print(f"\n📂 Cargando aristas desde {csv_path}...")
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            src_name = row['src_name'].strip()
            dst_name = row['dst_name'].strip()
            weight = float(row['weight'])
            
            # Obtener IDs
            src_id = name_to_id.get(src_name)
            dst_id = name_to_id.get(dst_name)
            
            if not src_id or not dst_id:
                print(f"  ⚠️  Arista '{src_name}' -> '{dst_name}' omitida (nodos no encontrados)")
                continue
            
            # Verificar si ya existe esta arista
            statement = select(Edge).where(
                Edge.src_id == src_id,
                Edge.dst_id == dst_id
            )
            existing_edge = session.exec(statement).first()
            
            if existing_edge:
                # Actualizar peso si cambió
                if existing_edge.weight != weight:
                    existing_edge.weight = weight
                    session.add(existing_edge)
                    session.commit()
                    print(f"  🔄 Arista {src_name} -> {dst_name} actualizada (peso={weight})")
                else:
                    print(f"  ⏭️  Arista {src_name} -> {dst_name} ya existe")
            else:
                edge = Edge(src_id=src_id, dst_id=dst_id, weight=weight)
                session.add(edge)
                session.commit()
                print(f"  ✅ Arista {src_name} -> {dst_name} creada (peso={weight})")


def main():
    """Función principal de carga"""
    print("🚀 Iniciando carga de datos...\n")
    
    # Inicializar DB
    init_db()
    print("✅ Base de datos inicializada\n")
    
    # Paths de los CSV
    base_dir = Path(__file__).parent.parent
    nodes_csv = base_dir / "data" / "nodes.csv"
    edges_csv = base_dir / "data" / "edges.csv"
    
    # Verificar que existen los archivos
    if not nodes_csv.exists():
        print(f"❌ Error: No se encontró {nodes_csv}")
        return
    
    if not edges_csv.exists():
        print(f"❌ Error: No se encontró {edges_csv}")
        return
    
    # Cargar datos
    with Session(engine) as session:
        name_to_id = load_nodes(session, str(nodes_csv))
        load_edges(session, str(edges_csv), name_to_id)
    
    print("\n✅ ¡Carga completada exitosamente!")
    print(f"📊 Nodos cargados: {len(name_to_id)}")


if __name__ == "__main__":
    main()
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getMe,
    getNodes,
    createNode,
    deleteNode,
    getEdges,
    createEdge,
    deleteEdge,
    runBFS,
    runDijkstra
} from '../api';

export default function Graph() {
    const [user, setUser] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Estados para formularios
    const [newNodeName, setNewNodeName] = useState('');
    const [newEdge, setNewEdge] = useState({ src_id: '', dst_id: '', weight: '' });
    const [bfsStart, setBfsStart] = useState('');
    const [dijkstra, setDijkstra] = useState({ src_id: '', dst_id: '' });

    // Resultados de algoritmos
    const [bfsResult, setBfsResult] = useState(null);
    const [dijkstraResult, setDijkstraResult] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [userData, nodesData, edgesData] = await Promise.all([
                getMe(),
                getNodes(),
                getEdges()
            ]);
            setUser(userData);
            setNodes(nodesData);
            setEdges(edgesData);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleCreateNode = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createNode(newNodeName);
            setNewNodeName('');
            await loadData();
            alert('✅ Nodo creado');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteNode = async (id) => {
        if (!confirm('¿Eliminar este nodo y sus aristas?')) return;
        try {
            await deleteNode(id);
            await loadData();
            alert('✅ Nodo eliminado');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateEdge = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createEdge(
                parseInt(newEdge.src_id),
                parseInt(newEdge.dst_id),
                parseFloat(newEdge.weight)
            );
            setNewEdge({ src_id: '', dst_id: '', weight: '' });
            await loadData();
            alert('✅ Arista creada');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteEdge = async (id) => {
        if (!confirm('¿Eliminar esta arista?')) return;
        try {
            await deleteEdge(id);
            await loadData();
            alert('✅ Arista eliminada');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRunBFS = async (e) => {
        e.preventDefault();
        setError('');
        setBfsResult(null);
        try {
            const result = await runBFS(parseInt(bfsStart));
            setBfsResult(result);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRunDijkstra = async (e) => {
        e.preventDefault();
        setError('');
        setDijkstraResult(null);
        try {
            const result = await runDijkstra(
                parseInt(dijkstra.src_id),
                parseInt(dijkstra.dst_id)
            );
            setDijkstraResult(result);
        } catch (err) {
            setError(err.message);
        }
    };

    const getNodeName = (id) => {
        const node = nodes.find(n => n.id === id);
        return node ? node.name : `ID ${id}`;
    };

    if (!user) return <div>Cargando...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>🗺️ PathFinder</h1>
                <div>
                    <span style={styles.username}>👤 {user.username}</span>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Cerrar sesión
                    </button>
                </div>
            </header>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.grid}>
                {/* NODOS */}
                <section style={styles.section}>
                    <h2>📍 Nodos</h2>
                    <form onSubmit={handleCreateNode} style={styles.form}>
                        <input
                            type="text"
                            placeholder="Nombre del nodo"
                            value={newNodeName}
                            onChange={(e) => setNewNodeName(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <button type="submit" style={styles.button}>Crear Nodo</button>
                    </form>

                    <div style={styles.list}>
                        {nodes.map((node) => (
                            <div key={node.id} style={styles.listItem}>
                                <span><strong>{node.name}</strong> (ID: {node.id})</span>
                                <button
                                    onClick={() => handleDeleteNode(node.id)}
                                    style={styles.deleteButton}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ARISTAS */}
                <section style={styles.section}>
                    <h2>🔗 Aristas</h2>
                    <form onSubmit={handleCreateEdge} style={styles.form}>
                        <select
                            value={newEdge.src_id}
                            onChange={(e) => setNewEdge({ ...newEdge, src_id: e.target.value })}
                            required
                            style={styles.input}
                        >
                            <option value="">Origen</option>
                            {nodes.map((n) => (
                                <option key={n.id} value={n.id}>{n.name}</option>
                            ))}
                        </select>
                        <select
                            value={newEdge.dst_id}
                            onChange={(e) => setNewEdge({ ...newEdge, dst_id: e.target.value })}
                            required
                            style={styles.input}
                        >
                            <option value="">Destino</option>
                            {nodes.map((n) => (
                                <option key={n.id} value={n.id}>{n.name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            step="0.1"
                            placeholder="Peso"
                            value={newEdge.weight}
                            onChange={(e) => setNewEdge({ ...newEdge, weight: e.target.value })}
                            required
                            style={styles.input}
                        />
                        <button type="submit" style={styles.button}>Crear Arista</button>
                    </form>

                    <div style={styles.list}>
                        {edges.map((edge) => (
                            <div key={edge.id} style={styles.listItem}>
                                <span>
                                    {getNodeName(edge.src_id)} → {getNodeName(edge.dst_id)}
                                    <strong> ({edge.weight})</strong>
                                </span>
                                <button
                                    onClick={() => handleDeleteEdge(edge.id)}
                                    style={styles.deleteButton}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* BFS */}
                <section style={styles.section}>
                    <h2>🌳 BFS (Breadth-First Search)</h2>
                    <form onSubmit={handleRunBFS} style={styles.form}>
                        <select
                            value={bfsStart}
                            onChange={(e) => setBfsStart(e.target.value)}
                            required
                            style={styles.input}
                        >
                            <option value="">Nodo inicial</option>
                            {nodes.map((n) => (
                                <option key={n.id} value={n.id}>{n.name}</option>
                            ))}
                        </select>
                        <button type="submit" style={styles.button}>Ejecutar BFS</button>
                    </form>

                    {bfsResult && (
                        <div style={styles.result}>
                            <h3>Orden de visita:</h3>
                            <p>{bfsResult.order.map(id => getNodeName(id)).join(' → ')}</p>

                            <h3>Árbol BFS:</h3>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Nodo</th>
                                        <th style={styles.th}>Padre</th>
                                        <th style={styles.th}>Profundidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bfsResult.tree.map((item, idx) => (
                                        <tr key={idx}>
                                            <td style={styles.td}>{getNodeName(item.node_id)}</td>
                                            <td style={styles.td}>{item.parent_id ? getNodeName(item.parent_id) : '-'}</td>
                                            <td style={styles.td}>{item.depth}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* DIJKSTRA */}
                <section style={styles.section}>
                    <h2>🛤️ Dijkstra (Camino Mínimo)</h2>
                    <form onSubmit={handleRunDijkstra} style={styles.form}>
                        <select
                            value={dijkstra.src_id}
                            onChange={(e) => setDijkstra({ ...dijkstra, src_id: e.target.value })}
                            required
                            style={styles.input}
                        >
                            <option value="">Origen</option>
                            {nodes.map((n) => (
                                <option key={n.id} value={n.id}>{n.name}</option>
                            ))}
                        </select>
                        <select
                            value={dijkstra.dst_id}
                            onChange={(e) => setDijkstra({ ...dijkstra, dst_id: e.target.value })}
                            required
                            style={styles.input}
                        >
                            <option value="">Destino</option>
                            {nodes.map((n) => (
                                <option key={n.id} value={n.id}>{n.name}</option>
                            ))}
                        </select>
                        <button type="submit" style={styles.button}>Calcular Ruta</button>
                    </form>

                    {dijkstraResult && (
                        <div style={styles.result}>
                            <h3>Camino más corto:</h3>
                            <p style={styles.path}>
                                {dijkstraResult.path.map(id => getNodeName(id)).join(' → ')}
                            </p>
                            <h3>Distancia total:</h3>
                            <p style={styles.distance}>{dijkstraResult.distance.toFixed(2)} km</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    username: {
        marginRight: '15px'
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: 'white',
        color: '#007bff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    error: {
        margin: '20px',
        padding: '15px',
        backgroundColor: '#fee',
        color: '#c33',
        borderRadius: '4px',
        border: '1px solid #fcc'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    section: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px'
    },
    input: {
        padding: '10px',
        fontSize: '14px',
        border: '1px solid #ddd',
        borderRadius: '4px'
    },
    button: {
        padding: '10px',
        fontSize: '14px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxHeight: '300px',
        overflowY: 'auto'
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '14px'
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    result: {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e7f3ff',
        borderRadius: '4px',
        border: '1px solid #b3d9ff'
    },
    path: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#0066cc'
    },
    distance: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#28a745'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px'
    },
    th: {
        padding: '8px',
        textAlign: 'left',
        borderBottom: '2px solid #ddd',
        backgroundColor: '#f8f9fa'
    },
    td: {
        padding: '8px',
        borderBottom: '1px solid #ddd'
    }
};
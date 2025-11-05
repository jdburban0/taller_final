const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

const handleResponse = async (response) => {
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Sesión expirada');
    }

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error en la petición');
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

// AUTH
export const register = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return handleResponse(response);
};

export const login = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    });
    return handleResponse(response);
};

export const getMe = async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
        headers: authHeaders()
    });
    return handleResponse(response);
};

// NODES
export const getNodes = async () => {
    const response = await fetch(`${API_URL}/graph/nodes`, {
        headers: authHeaders()
    });
    return handleResponse(response);
};

export const createNode = async (name) => {
    const response = await fetch(`${API_URL}/graph/nodes`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name })
    });
    return handleResponse(response);
};

export const deleteNode = async (id) => {
    const response = await fetch(`${API_URL}/graph/nodes/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
    return handleResponse(response);
};

// EDGES
export const getEdges = async () => {
    const response = await fetch(`${API_URL}/graph/edges`, {
        headers: authHeaders()
    });
    return handleResponse(response);
};

export const createEdge = async (src_id, dst_id, weight) => {
    const response = await fetch(`${API_URL}/graph/edges`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ src_id, dst_id, weight })
    });
    return handleResponse(response);
};

export const deleteEdge = async (id) => {
    const response = await fetch(`${API_URL}/graph/edges/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
    return handleResponse(response);
};

// ALGORITHMS
export const runBFS = async (startId) => {
    const response = await fetch(`${API_URL}/graph/bfs?start_id=${startId}`, {
        headers: authHeaders()
    });
    return handleResponse(response);
};

export const runDijkstra = async (srcId, dstId) => {
    const response = await fetch(
        `${API_URL}/graph/shortest-path?src_id=${srcId}&dst_id=${dstId}`,
        { headers: authHeaders() }
    );
    return handleResponse(response);
};
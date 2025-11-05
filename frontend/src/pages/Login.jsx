import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isRegistering) {
                await register(username, password);
                alert('✅ Usuario registrado. Ahora inicia sesión.');
                setIsRegistering(false);
                setPassword('');
            } else {
                const data = await login(username, password);
                localStorage.setItem('token', data.access_token);
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>🗺️ PathFinder</h1>
                <h2 style={styles.subtitle}>
                    {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
                </h2>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />

                    {error && <div style={styles.error}>{error}</div>}

                    <button type="submit" style={styles.button}>
                        {isRegistering ? 'Registrarse' : 'Iniciar sesión'}
                    </button>
                </form>

                <button
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError('');
                    }}
                    style={styles.switchButton}
                >
                    {isRegistering
                        ? '¿Ya tienes cuenta? Inicia sesión'
                        : '¿No tienes cuenta? Regístrate'}
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
    },
    title: {
        textAlign: 'center',
        margin: '0 0 10px 0',
        fontSize: '32px'
    },
    subtitle: {
        textAlign: 'center',
        margin: '0 0 30px 0',
        fontSize: '20px',
        color: '#666'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    input: {
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        outline: 'none'
    },
    button: {
        padding: '12px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    error: {
        padding: '10px',
        backgroundColor: '#fee',
        color: '#c33',
        borderRadius: '4px',
        fontSize: '14px'
    },
    switchButton: {
        marginTop: '20px',
        padding: '10px',
        fontSize: '14px',
        backgroundColor: 'transparent',
        color: '#007bff',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'underline'
    }
};
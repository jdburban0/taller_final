import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegistering) {
                // Validaciones de registro
                if (username.length < 3) {
                    setError('El usuario debe tener al menos 3 caracteres');
                    setLoading(false);
                    return;
                }

                if (password.length < 4) {
                    setError('La contraseña debe tener al menos 4 caracteres');
                    setLoading(false);
                    return;
                }

                if (password !== confirmPassword) {
                    setError('Las contraseñas no coinciden');
                    setLoading(false);
                    return;
                }

                await register(username, password);
                alert('✅ Usuario registrado exitosamente. Ahora inicia sesión.');
                setIsRegistering(false);
                setPassword('');
                setConfirmPassword('');
            } else {
                // Login
                const data = await login(username, password);
                localStorage.setItem('token', data.access_token);
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>🗺️ PathFinder</h1>
                <h2 style={styles.subtitle}>
                    {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
                </h2>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Usuario</label>
                        <input
                            type="text"
                            placeholder="Ingresa tu usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={3}
                            style={styles.input}
                            disabled={loading}
                        />
                        {isRegistering && (
                            <small style={styles.hint}>Mínimo 3 caracteres</small>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Contraseña</label>
                        <input
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={4}
                            style={styles.input}
                            disabled={loading}
                        />
                        {isRegistering && (
                            <small style={styles.hint}>Mínimo 4 caracteres</small>
                        )}
                    </div>

                    {isRegistering && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirmar contraseña</label>
                            <input
                                type="password"
                                placeholder="Confirma tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={styles.input}
                                disabled={loading}
                            />
                            {password && confirmPassword && password !== confirmPassword && (
                                <small style={styles.errorHint}>❌ Las contraseñas no coinciden</small>
                            )}
                            {password && confirmPassword && password === confirmPassword && (
                                <small style={styles.successHint}>✓ Las contraseñas coinciden</small>
                            )}
                        </div>
                    )}

                    {error && <div style={styles.error}>❌ {error}</div>}

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {})
                        }}
                        disabled={loading}
                    >
                        {loading ? '⏳ Procesando...' : (isRegistering ? '✓ Registrarse' : '→ Iniciar sesión')}
                    </button>
                </form>

                <button
                    onClick={switchMode}
                    style={styles.switchButton}
                    disabled={loading}
                >
                    {isRegistering
                        ? '¿Ya tienes cuenta? Inicia sesión'
                        : '¿No tienes cuenta? Regístrate'}
                </button>

                {!isRegistering && (
                    <div style={styles.infoBox}>
                        <p style={styles.infoText}>
                            💡 <strong>Tip:</strong> Si es tu primera vez, regístrate primero.
                        </p>
                    </div>
                )}
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
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px'
    },
    title: {
        textAlign: 'center',
        margin: '0 0 10px 0',
        fontSize: '36px',
        color: '#007bff'
    },
    subtitle: {
        textAlign: 'center',
        margin: '0 0 30px 0',
        fontSize: '22px',
        color: '#666',
        fontWeight: '500'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '4px'
    },
    input: {
        padding: '12px 15px',
        fontSize: '16px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        outline: 'none',
        transition: 'border-color 0.3s',
        fontFamily: 'inherit'
    },
    hint: {
        fontSize: '12px',
        color: '#888',
        marginTop: '2px'
    },
    errorHint: {
        fontSize: '12px',
        color: '#dc3545',
        marginTop: '2px',
        fontWeight: '500'
    },
    successHint: {
        fontSize: '12px',
        color: '#28a745',
        marginTop: '2px',
        fontWeight: '500'
    },
    button: {
        padding: '14px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
        marginTop: '10px'
    },
    buttonDisabled: {
        backgroundColor: '#6c757d',
        cursor: 'not-allowed'
    },
    error: {
        padding: '12px 15px',
        backgroundColor: '#fee',
        color: '#c33',
        borderRadius: '8px',
        fontSize: '14px',
        border: '1px solid #fcc',
        fontWeight: '500'
    },
    switchButton: {
        marginTop: '20px',
        padding: '12px',
        fontSize: '14px',
        backgroundColor: 'transparent',
        color: '#007bff',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontWeight: '500',
        width: '100%'
    },
    infoBox: {
        marginTop: '20px',
        padding: '12px 15px',
        backgroundColor: '#e7f3ff',
        borderRadius: '8px',
        border: '1px solid #b3d9ff'
    },
    infoText: {
        margin: 0,
        fontSize: '13px',
        color: '#0066cc',
        textAlign: 'center'
    }
};
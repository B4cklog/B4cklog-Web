import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../../api/apiService';
import '../../styles/AuthForms.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(username, password);
            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
                setLoading(false);
                window.location.href = '/';
            } else {
                setError('Токен не получен');
                setLoading(false);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка входа');
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Вход в аккаунт</h2>
                
                <div className="form-group">
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Имя пользователя"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Пароль"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="auth-button"
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Войти'}
                </button>

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-links">
                    <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;

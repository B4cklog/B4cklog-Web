import React, { useState } from 'react';
import { login } from '../../api/apiService';

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
            const token = response.data.token; // подставь поле, если по-другому
            if (token) {
                localStorage.setItem('token', token);
                setLoading(false);
                // Редирект на главную или профиль — например
                window.location.href = '/profile';
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
        <form onSubmit={handleSubmit}>
            <h2>Вход</h2>
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Имя пользователя"
                required
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Пароль"
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Загрузка...' : 'Войти'}
            </button>

            {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
    );
};

export default LoginPage;

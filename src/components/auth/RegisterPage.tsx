import React, { useState } from 'react';
import { register } from '../../api/apiService';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirm) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            const response = await register(username, password, email);
            const token = response.data.token; // предполагаем, что сервер возвращает токен
            if (token) {
                localStorage.setItem('token', token);
                // Редиректим сразу в профиль
                navigate('/profile');
            } else {
                setError('Регистрация прошла успешно, но токен не получен. Пожалуйста, войдите.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка регистрации');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Регистрация</h2>
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Имя пользователя"
                required
            />
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Пароль"
                required
            />
            <input
                type="password"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                placeholder="Подтверждение пароля"
                required
            />
            <button type="submit">Зарегистрироваться</button>

            {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
    );
};

export default RegisterPage;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/apiService';
import '../../styles/AuthForms.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== passwordConfirm) {
            setError('Пароли не совпадают');
            setLoading(false);
            return;
        }

        try {
            const response = await register(username, password, email);
            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
                navigate('/');
            } else {
                setError('Регистрация прошла успешно, но токен не получен. Пожалуйста, войдите.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Создание аккаунта</h2>
                
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
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
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

                <div className="form-group">
                    <input
                        type="password"
                        value={passwordConfirm}
                        onChange={e => setPasswordConfirm(e.target.value)}
                        placeholder="Подтверждение пароля"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="auth-button"
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                </button>

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-links">
                    <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;

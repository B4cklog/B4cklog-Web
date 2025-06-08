import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../logo.svg';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#222',
            color: '#fff'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={logo} alt="Logo" style={{ height: 32, width: 32 }} />
                <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: 20 }}>
                    B4cklog
                </Link>
            </div>

            <div style={{ display: 'flex', gap: 20 }}>
                {token ? (
                    <>
                        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
                            Главная
                        </Link>
                        <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>
                            Профиль
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                backgroundColor: 'transparent',
                                border: '1px solid #fff',
                                color: '#fff',
                                borderRadius: 4,
                                cursor: 'pointer',
                                padding: '5px 10px',
                                fontSize: 14
                            }}
                        >
                            Выйти
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>
                            Войти
                        </Link>
                        <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>
                            Регистрация
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

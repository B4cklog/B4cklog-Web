import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/WelcomePage.css';

const WelcomePage: React.FC = () => {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>Добро пожаловать в B4cklog</h1>
                <p>Ваш персональный трекер игр и достижений</p>
                <div className="welcome-features">
                    <div className="feature">
                        <h3>Отслеживайте свои игры</h3>
                        <p>Ведите список игр, в которые вы играете или планируете сыграть</p>
                    </div>
                    <div className="feature">
                        <h3>Коллекция игр</h3>
                        <p>Создавайте и организуйте свою игровую библиотеку, добавляйте заметки и оценки</p>
                    </div>
                    <div className="feature">
                        <h3>Социальные функции</h3>
                        <p>Делитесь своим прогрессом с друзьями</p>
                    </div>
                </div>
                <div className="welcome-actions">
                    <Link to="/login" className="welcome-button login">Войти</Link>
                    <Link to="/register" className="welcome-button register">Регистрация</Link>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage; 
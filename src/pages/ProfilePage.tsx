import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/apiService';
import { Game } from './GameDetailPage';
import GameList from '../components/GameList';

interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    isAdmin: boolean;

    backlogWantToPlay: Game[];
    backlogPlaying: Game[];
    backlogPlayed: Game[];
    backlogCompleted: Game[];
    backlogCompleted100: Game[];
}

const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getCurrentUser();
                setUser(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Ошибка при загрузке профиля');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div>Загрузка профиля...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!user) return null;

    return (
        <div>
            <h2>Профиль пользователя</h2>
            <p><b>Имя пользователя:</b> {user.username}</p>
            <p><b>Имя:</b> {user.firstName}</p>
            <p><b>Фамилия:</b> {user.lastName}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Возраст:</b> {user.age}</p>
            <p><b>Админ:</b> {user.isAdmin ? 'Да' : 'Нет'}</p>

            <GameList title="Хочу сыграть" games={user.backlogWantToPlay} />
            <GameList title="Сейчас играю" games={user.backlogPlaying} />
            <GameList title="Играл" games={user.backlogPlayed} />
            <GameList title="Завершил" games={user.backlogCompleted} />
            <GameList title="Завершил на 100%" games={user.backlogCompleted100} />
        </div>
    );
};

export default ProfilePage;

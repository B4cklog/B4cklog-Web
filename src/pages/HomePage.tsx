import React, { useEffect, useState } from 'react';
import { getAllGames } from '../api/apiService'; // путь подкорректируй
import { useNavigate } from 'react-router-dom';

interface Game {
    id: number;
    name: string;
    cover: string;
}

const HomePage = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getAllGames();
                setGames(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Ошибка при загрузке игр');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    // Проверка авторизации — если токена нет, редирект на логин
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    if (loading) return <div>Загрузка игр...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {games.map(game => (
                <div
                    key={game.id}
                    style={{ cursor: 'pointer', width: 150, textAlign: 'center' }}
                    onClick={() => navigate(`/games/${game.id}`)}
                >
                    <img
                        src={game.cover || '/default-cover.png'} // запасная обложка
                        alt={game.name}
                        style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                    />
                    <div style={{ marginTop: 8, fontWeight: 'bold' }}>{game.name}</div>
                </div>
            ))}
        </div>
    );
};

export default HomePage;

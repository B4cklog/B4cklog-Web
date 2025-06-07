import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGame, addGameToList, removeGameFromAllLists, getCurrentUser } from '../api/apiService';

export interface Game {
    id: number;
    name: string;
    summary: string;
    cover: string;
    releaseDate: string;
}

const lists = [
    "wantToPlay",
    "playing",
    "played",
    "completed",
    "completed100"
];

const GameDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [userId, setUserId] = useState<number | null>(null);
    const [selectedList, setSelectedList] = useState<string>(lists[0]);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');
    const [actionSuccess, setActionSuccess] = useState('');

    useEffect(() => {
        const fetchGame = async () => {
            if (!id) return;
            setLoading(true);
            setError('');
            try {
                const response = await getGame(id);
                setGame(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Ошибка при загрузке игры');
            } finally {
                setLoading(false);
            }
        };

        const fetchUser = async () => {
            try {
                const res = await getCurrentUser();
                setUserId(res.data.id);
            } catch {
                setUserId(null);
            }
        };

        fetchGame();
        fetchUser();
    }, [id]);

    const handleAdd = async () => {
        if (!userId || !game) return;
        setActionLoading(true);
        setActionError('');
        setActionSuccess('');
        try {
            await addGameToList(userId, game.id, selectedList);
            setActionSuccess(`Игра добавлена в список ${selectedList}`);
        } catch (e: any) {
            setActionError(e.response?.data?.message || 'Ошибка при добавлении игры');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemove = async () => {
        if (!userId || !game) return;
        setActionLoading(true);
        setActionError('');
        setActionSuccess('');
        try {
            await removeGameFromAllLists(userId, game.id);
            setActionSuccess('Игра удалена из всех списков');
        } catch (e: any) {
            setActionError(e.response?.data?.message || 'Ошибка при удалении игры');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div>Загрузка игры...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!game) return <div>Игра не найдена</div>;

    return (
        <div>
            <h2>{game.name}</h2>
            <img src={game.cover || '/default-cover.png'} alt={game.name} style={{ maxWidth: '300px' }} />
            <p>{game.summary}</p>
            <p><b>Дата релиза:</b> {game.releaseDate}</p>

            {userId ? (
                <div>
                    <h3>Добавить игру в список</h3>
                    <select
                        value={selectedList}
                        onChange={e => setSelectedList(e.target.value)}
                        disabled={actionLoading}
                    >
                        {lists.map(list => (
                            <option key={list} value={list}>{list}</option>
                        ))}
                    </select>
                    <button onClick={handleAdd} disabled={actionLoading}>
                        Добавить
                    </button>

                    <h3>Удалить игру из всех списков</h3>
                    <button onClick={handleRemove} disabled={actionLoading}>
                        Удалить из всех списков
                    </button>

                    {actionError && <p style={{ color: 'red' }}>{actionError}</p>}
                    {actionSuccess && <p style={{ color: 'green' }}>{actionSuccess}</p>}
                </div>
            ) : (
                <p>Авторизуйтесь, чтобы редактировать списки.</p>
            )}
        </div>
    );
};

export default GameDetailPage;

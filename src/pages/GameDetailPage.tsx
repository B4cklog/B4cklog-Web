import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGame, addGameToList, removeGameFromAllLists, getCurrentUser } from '../api/apiService';
import { Game } from '../types/Game';

const lists = [
    { id: "wantToPlay", name: "Хочу поиграть" },
    { id: "playing", name: "Сейчас играю" },
    { id: "played", name: "Играл" },
    { id: "completed", name: "Прошел" },
    { id: "completed100", name: "Прошел на 100%" }
];

const GameDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [userId, setUserId] = useState<number | null>(null);
    const [selectedList, setSelectedList] = useState<string>(lists[0].id);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');
    const [actionSuccess, setActionSuccess] = useState('');

    const getCoverUrl = (game: Game) => {
        if (game.cover) {
            const processedUrl = game.cover.url.replace("t_thumb", "t_cover_big");
            return processedUrl.startsWith("//") ? `https:${processedUrl}` : processedUrl;
        }
        return '/default-cover.png';
    };

    const getReleaseDate = (game: Game) => {
        if (game.first_release_date) {
            const date = new Date(game.first_release_date * 1000);
            return date.toLocaleDateString('ru-RU');
        }
        return 'Не указана';
    };

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
            setActionSuccess(`Игра добавлена в список ${lists.find(l => l.id === selectedList)?.name}`);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-red-500 text-center">{error}</div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-gray-500 dark:text-gray-400 text-center">Игра не найдена</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/3">
                        <img
                            src={getCoverUrl(game)}
                            alt={game.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-6 md:w-2/3">
                        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{game.name}</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{game.summary || 'Описание отсутствует'}</p>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            <span className="font-semibold">Дата релиза:</span> {getReleaseDate(game)}
                        </p>

                        {userId ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                        Добавить игру в список
                                    </h3>
                                    <select
                                        value={selectedList}
                                        onChange={e => setSelectedList(e.target.value)}
                                        disabled={actionLoading}
                                        className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 
                                                 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                    >
                                        {lists.map(list => (
                                            <option key={list.id} value={list.id}>
                                                {list.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleAdd}
                                        disabled={actionLoading}
                                        className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-lg
                                                 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                                                 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {actionLoading ? 'Добавление...' : 'Добавить'}
                                    </button>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                        Удалить игру из всех списков
                                    </h3>
                                    <button
                                        onClick={handleRemove}
                                        disabled={actionLoading}
                                        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg
                                                 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500
                                                 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {actionLoading ? 'Удаление...' : 'Удалить из всех списков'}
                                    </button>
                                </div>

                                {actionError && (
                                    <p className="text-red-500 text-center">{actionError}</p>
                                )}
                                {actionSuccess && (
                                    <p className="text-green-500 text-center">{actionSuccess}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                Авторизуйтесь, чтобы редактировать списки.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameDetailPage;

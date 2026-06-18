import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfileWithGames, getUserFriends, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getIncomingFriendRequests, getOutgoingFriendRequests, cancelFriendRequest, removeFriend } from '../api/apiService';
import GameList from '../components/GameList';
import { Game as GameType } from '../types/Game';
import Settings from '../components/Settings';

interface User {
    id: number;
    username: string;
    email?: string;
    firstName: string;
    lastName: string;
    age: number;
    isAdmin: boolean;
}

interface Game {
    id: number;
    name: string;
    cover?: { url: string };
    // ... другие поля
}

interface UserProfileResponse {
    user: User;
    games: {
        want_to_play: Game[];
        playing: Game[];
        played: Game[];
        completed: Game[];
        completed_100: Game[];
    };
}

interface Friend {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
}

const UserProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'incoming' | 'friends'>('none');
    const [requestId, setRequestId] = useState<number | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showRemovePopup, setShowRemovePopup] = useState(false);
    const [actionError, setActionError] = useState('');

    // Новый универсальный способ загрузки друзей
    const loadUserFriends = async (userId: string, isOwn: boolean) => {
        try {
            const response = isOwn ? await getUserFriends() : await getUserFriends(userId);
            setFriends(response.data);
        } catch {
            setFriends([]);
        }
    };

    // Новый способ проверки статуса дружбы
    const checkFriendStatus = async (userId: string) => {
        try {
            const [incoming, outgoing, myFriends] = await Promise.all([
                getIncomingFriendRequests(),
                getOutgoingFriendRequests(),
                getUserFriends() // только свой список
            ]);
            // Входящая заявка
            const incomingReq = incoming.data.find((req: any) => req.senderId === Number(userId));
            if (incomingReq) {
                setFriendStatus('incoming');
                setRequestId(incomingReq.id);
                return;
            }
            // Исходящая заявка
            const outgoingReq = outgoing.data.find((req: any) => req.receiverId === Number(userId));
            if (outgoingReq) {
                setFriendStatus('pending');
                setRequestId(outgoingReq.id);
                return;
            }
            // Уже друзья
            if (myFriends.data.some((f: any) => f.id === Number(userId))) {
                setFriendStatus('friends');
                setRequestId(null);
                return;
            }
            setFriendStatus('none');
            setRequestId(null);
        } catch {
            setFriendStatus('none');
            setRequestId(null);
        }
    };

    // Универсальный afterAction
    const afterAction = () => {
        const isOwn = Number(id) === currentUserId;
        checkFriendStatus(id!);
        loadUserFriends(id!, isOwn);
    };

    useEffect(() => {
        if (id) {
            loadUserProfile(id);
            fetchCurrentUserId();
        }
    }, [id]);

    useEffect(() => {
        if (id && currentUserId !== null) {
            const isOwn = Number(id) === currentUserId;
            loadUserFriends(id, isOwn);
            checkFriendStatus(id);
        }
    }, [id, currentUserId]);

    useEffect(() => {
        setFriends([]); // Очищаем friends при смене id
    }, [id]);

    const fetchCurrentUserId = async () => {
        try {
            const res = await import('../api/apiService').then(m => m.getCurrentUser());
            setCurrentUserId(res.data.id);
        } catch {
            setCurrentUserId(null);
        }
    };

    const handleSendFriendRequest = async () => {
        setActionLoading(true);
        setActionError('');
        try {
            await sendFriendRequest(Number(id));
        } catch (requestError: any) {
            setActionError(requestError?.response?.data?.detail || 'Не удалось отправить заявку');
        }
        setActionLoading(false);
        afterAction();
    };

    const handleCancelFriendRequest = async () => {
        if (!requestId) return;
        setActionLoading(true);
        setActionError('');
        try {
            await cancelFriendRequest(requestId);
        } catch (requestError: any) {
            setActionError(requestError?.response?.data?.detail || 'Не удалось отозвать заявку');
        }
        setActionLoading(false);
        afterAction();
    };

    const handleAcceptFriendRequest = async () => {
        if (!requestId) return;
        setActionLoading(true);
        setActionError('');
        try {
            await acceptFriendRequest(requestId);
        } catch (requestError: any) {
            setActionError(requestError?.response?.data?.detail || 'Не удалось принять заявку');
        }
        setActionLoading(false);
        afterAction();
    };

    const handleRejectFriendRequest = async () => {
        if (!requestId) return;
        setActionLoading(true);
        setActionError('');
        try {
            await rejectFriendRequest(requestId);
        } catch (requestError: any) {
            setActionError(requestError?.response?.data?.detail || 'Не удалось отклонить заявку');
        }
        setActionLoading(false);
        afterAction();
    };

    const handleRemoveFriend = async () => {
        setActionLoading(true);
        setActionError('');
        try {
            await removeFriend(Number(id));
            setShowRemovePopup(false);
        } catch (requestError: any) {
            setActionError(requestError?.response?.data?.detail || 'Не удалось удалить друга');
        }
        setActionLoading(false);
        afterAction();
    };

    const loadUserProfile = async (userId: string) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await getUserProfileWithGames(userId);
            setProfileData(response.data);
        } catch (err: any) {
            setError('Ошибка загрузки профиля');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGameClick = (gameId: number) => {
        navigate(`/games/${gameId}`);
    };

    // Функция для преобразования cover
    const normalizeGames = (games: any[]): GameType[] => {
        return games.map(g => ({
            ...g,
            cover: g.cover && g.cover.id !== undefined ? g.cover : (g.cover ? { id: 0, ...g.cover } : undefined)
        }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error || 'Ошибка загрузки профиля'}</p>
            </div>
        );
    }

    const { user, games } = profileData;
    const isOwnProfile = currentUserId === user.id;

    if (showSettings && isOwnProfile) {
        return <Settings onBack={() => setShowSettings(false)} />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                {actionError && <p className="mb-4 text-red-600">{actionError}</p>}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {user.username}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            {user.firstName} {user.lastName}, {user.age}
                        </p>
                    </div>
                    {/* Кнопки дружбы или настройки */}
                    {isOwnProfile ? (
                        <button
                            onClick={() => setShowSettings(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                            Настройки
                        </button>
                    ) : (
                        currentUserId && (
                            <div>
                                {friendStatus === 'none' && (
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                        onClick={handleSendFriendRequest}
                                        disabled={actionLoading}
                                    >
                                        Добавить в друзья
                                    </button>
                                )}
                                {friendStatus === 'pending' && (
                                    <>
                                        <span className="text-blue-500 font-semibold mr-2">Заявка отправлена</span>
                                        <button
                                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                                            onClick={handleCancelFriendRequest}
                                            disabled={actionLoading}
                                        >
                                            Отозвать заявку
                                        </button>
                                    </>
                                )}
                                {friendStatus === 'incoming' && (
                                    <>
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-600 transition-colors duration-200"
                                            onClick={handleAcceptFriendRequest}
                                            disabled={actionLoading}
                                        >
                                            Принять
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                                            onClick={handleRejectFriendRequest}
                                            disabled={actionLoading}
                                        >
                                            Отклонить
                                        </button>
                                    </>
                                )}
                                {friendStatus === 'friends' && (
                                    <>
                                        <span className="text-green-600 font-semibold mr-2">В друзьях</span>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                                            onClick={() => setShowRemovePopup(true)}
                                            disabled={actionLoading}
                                        >
                                            Удалить из друзей
                                        </button>
                                    </>
                                )}
                            </div>
                        )
                    )}
                </div>
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Друзья ({friends.length})</h2>
                    <div className="flex flex-wrap gap-2">
                        {friends.map(friend => (
                            <button
                                key={friend.id}
                                className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-3 py-1 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                                onClick={() => navigate(`/user/${friend.id}`)}
                            >
                                {friend.username}
                            </button>
                        ))}
                        {friends.length === 0 && <span className="text-gray-500">Нет друзей</span>}
                    </div>
                </div>
            </div>

            {/* Списки игр */}
            <section>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Хочу поиграть</h2>
                <GameList games={normalizeGames(games.want_to_play)} onGameClick={handleGameClick} layout="grid" />
            </section>
            <section>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Сейчас играю</h2>
                <GameList games={normalizeGames(games.playing)} onGameClick={handleGameClick} layout="grid" />
            </section>
            <section>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Играл</h2>
                <GameList games={normalizeGames(games.played)} onGameClick={handleGameClick} layout="grid" />
            </section>
            <section>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Прошел</h2>
                <GameList games={normalizeGames(games.completed)} onGameClick={handleGameClick} layout="grid" />
            </section>
            <section>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Прошел на 100%</h2>
                <GameList games={normalizeGames(games.completed_100)} onGameClick={handleGameClick} layout="grid" />
            </section>
            {/* Попап подтверждения удаления из друзей */}
            {showRemovePopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Удалить из друзей?</h2>
                        <p className="mb-6 text-gray-700 dark:text-gray-300">Вы уверены, что хотите удалить этого пользователя из друзей?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                                onClick={() => setShowRemovePopup(false)}
                                disabled={actionLoading}
                            >
                                Отмена
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                onClick={handleRemoveFriend}
                                disabled={actionLoading}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;

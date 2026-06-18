import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    acceptFriendRequest,
    cancelFriendRequest,
    getIncomingFriendRequests,
    getOutgoingFriendRequests,
    getUserFriends,
    rejectFriendRequest,
    searchUsers,
    sendFriendRequest
} from '../api/apiService';

interface Friend {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
}

interface FriendRequest {
    id: number;
    senderId: number;
    senderUsername: string;
    receiverId: number;
    receiverUsername: string;
    status: 'PENDING';
}

type FriendStatus = 'none' | 'pending' | 'incoming' | 'friends';

const FriendSearchPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Friend[]>([]);
    const [myFriends, setMyFriends] = useState<Friend[]>([]);
    const [incoming, setIncoming] = useState<FriendRequest[]>([]);
    const [outgoing, setOutgoing] = useState<FriendRequest[]>([]);
    const [loadingActionId, setLoadingActionId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const preloadRelations = async () => {
        const [friends, incomingRequests, outgoingRequests] = await Promise.all([
            getUserFriends(),
            getIncomingFriendRequests(),
            getOutgoingFriendRequests()
        ]);
        setMyFriends(friends.data);
        setIncoming(incomingRequests.data);
        setOutgoing(outgoingRequests.data);
    };

    useEffect(() => {
        preloadRelations().catch(() => setError('Не удалось загрузить данные друзей'));
    }, []);

    const handleSearch = async (value: string) => {
        setQuery(value);
        setError('');
        if (value.trim().length < 2) {
            setResults([]);
            return;
        }
        try {
            const response = await searchUsers(value.trim());
            setResults(response.data);
        } catch {
            setError('Не удалось выполнить поиск');
        }
    };

    const runAction = async (id: number, action: () => Promise<unknown>) => {
        setLoadingActionId(id);
        setError('');
        try {
            await action();
            await preloadRelations();
        } catch (requestError: any) {
            setError(requestError?.response?.data?.detail || 'Не удалось выполнить действие');
        } finally {
            setLoadingActionId(null);
        }
    };

    const getStatus = (userId: number): FriendStatus => {
        if (myFriends.some(friend => friend.id === userId)) return 'friends';
        if (incoming.some(request => request.senderId === userId)) return 'incoming';
        if (outgoing.some(request => request.receiverId === userId)) return 'pending';
        return 'none';
    };

    const renderActions = (user: Friend) => {
        const status = getStatus(user.id);
        const incomingRequest = incoming.find(request => request.senderId === user.id);
        const outgoingRequest = outgoing.find(request => request.receiverId === user.id);
        const disabled = loadingActionId === user.id;

        if (status === 'friends') {
            return <span className="font-semibold text-green-600">В друзьях</span>;
        }
        if (status === 'pending' && outgoingRequest) {
            return (
                <button
                    className="rounded bg-gray-300 px-3 py-2 text-gray-900 disabled:opacity-50"
                    disabled={disabled}
                    onClick={() => runAction(user.id, () => cancelFriendRequest(outgoingRequest.id))}
                >
                    Отозвать
                </button>
            );
        }
        if (status === 'incoming' && incomingRequest) {
            return (
                <div className="flex gap-2">
                    <button
                        className="rounded bg-green-600 px-3 py-2 text-white disabled:opacity-50"
                        disabled={disabled}
                        onClick={() => runAction(user.id, () => acceptFriendRequest(incomingRequest.id))}
                    >
                        Принять
                    </button>
                    <button
                        className="rounded bg-red-600 px-3 py-2 text-white disabled:opacity-50"
                        disabled={disabled}
                        onClick={() => runAction(user.id, () => rejectFriendRequest(incomingRequest.id))}
                    >
                        Отклонить
                    </button>
                </div>
            );
        }
        return (
            <button
                className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
                disabled={disabled}
                onClick={() => runAction(user.id, () => sendFriendRequest(user.id))}
            >
                Добавить
            </button>
        );
    };

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Друзья</h1>

            {error && <p className="mb-4 text-red-600">{error}</p>}

            <section className="mb-8">
                <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                    Входящие заявки ({incoming.length})
                </h2>
                <div className="space-y-2">
                    {incoming.map(request => (
                        <div key={request.id} className="flex items-center justify-between border-b py-3 dark:border-gray-700">
                            <button
                                className="font-semibold text-blue-600 hover:underline"
                                onClick={() => navigate(`/user/${request.senderId}`)}
                            >
                                {request.senderUsername}
                            </button>
                            <div className="flex gap-2">
                                <button
                                    className="rounded bg-green-600 px-3 py-2 text-white disabled:opacity-50"
                                    disabled={loadingActionId === request.senderId}
                                    onClick={() => runAction(request.senderId, () => acceptFriendRequest(request.id))}
                                >
                                    Принять
                                </button>
                                <button
                                    className="rounded bg-red-600 px-3 py-2 text-white disabled:opacity-50"
                                    disabled={loadingActionId === request.senderId}
                                    onClick={() => runAction(request.senderId, () => rejectFriendRequest(request.id))}
                                >
                                    Отклонить
                                </button>
                            </div>
                        </div>
                    ))}
                    {incoming.length === 0 && <p className="text-gray-500">Новых заявок нет</p>}
                </div>
            </section>

            <section className="mb-8">
                <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                    Исходящие заявки ({outgoing.length})
                </h2>
                <div className="space-y-2">
                    {outgoing.map(request => (
                        <div key={request.id} className="flex items-center justify-between border-b py-3 dark:border-gray-700">
                            <button
                                className="font-semibold text-blue-600 hover:underline"
                                onClick={() => navigate(`/user/${request.receiverId}`)}
                            >
                                {request.receiverUsername}
                            </button>
                            <button
                                className="rounded bg-gray-300 px-3 py-2 text-gray-900 disabled:opacity-50"
                                disabled={loadingActionId === request.receiverId}
                                onClick={() => runAction(request.receiverId, () => cancelFriendRequest(request.id))}
                            >
                                Отозвать
                            </button>
                        </div>
                    ))}
                    {outgoing.length === 0 && <p className="text-gray-500">Исходящих заявок нет</p>}
                </div>
            </section>

            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Найти пользователя</h2>
                <input
                    type="search"
                    value={query}
                    onChange={event => handleSearch(event.target.value)}
                    placeholder="Введите имя пользователя"
                    className="mb-4 w-full border bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                <div className="space-y-2">
                    {results.map(user => (
                        <div key={user.id} className="flex items-center justify-between border-b py-3 dark:border-gray-700">
                            <button className="text-left" onClick={() => navigate(`/user/${user.id}`)}>
                                <strong className="block text-gray-900 dark:text-white">{user.username}</strong>
                                <span className="text-sm text-gray-500">{user.firstName} {user.lastName}</span>
                            </button>
                            {renderActions(user)}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default FriendSearchPage;

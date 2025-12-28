import React, { useEffect, useState } from 'react';
import {
    searchUsers,
    getUserFriends,
    getIncomingFriendRequests,
    getOutgoingFriendRequests,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest
} from '../api/apiService';
import { useNavigate } from 'react-router-dom';

interface Friend {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
}

type FriendStatus = 'none' | 'pending' | 'incoming' | 'friends';

const FriendSearchPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Friend[]>([]);
    const [myFriends, setMyFriends] = useState<Friend[]>([]);
    const [incoming, setIncoming] = useState<any[]>([]);
    const [outgoing, setOutgoing] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        preloadRelations();
    }, []);

    const preloadRelations = async () => {
        const [friends, inc, out] = await Promise.all([
            getUserFriends(),
            getIncomingFriendRequests(),
            getOutgoingFriendRequests()
        ]);
        setMyFriends(friends.data);
        setIncoming(inc.data);
        setOutgoing(out.data);
    };

    const handleSearch = async (value: string) => {
        setQuery(value);
        if (value.length < 2) {
            setResults([]);
            return;
        }
        const res = await searchUsers(value);
        setResults(res.data);
    };

    const getStatus = (userId: number): FriendStatus => {
        if (myFriends.some(f => f.id === userId)) return 'friends';
        if (incoming.some(r => r.senderId === userId)) return 'incoming';
        if (outgoing.some(r => r.receiverId === userId)) return 'pending';
        return 'none';
    };

    const getRequestId = (userId: number) => {
        const inc = incoming.find(r => r.senderId === userId);
        if (inc) return inc.id;
        const out = outgoing.find(r => r.receiverId === userId);
        return out?.id;
    };

    const afterAction = async () => {
        await preloadRelations();
        if (query.length >= 2) handleSearch(query);
    };

    const renderActions = (user: Friend) => {
        const status = getStatus(user.id);
        const requestId = getRequestId(user.id);

        switch (status) {
            case 'none':
                return (
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        onClick={async () => {
                            await sendFriendRequest(user.id);
                            afterAction();
                        }}
                    >
                        Добавить
                    </button>
                );

            case 'pending':
                return (
                    <button
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                        onClick={async () => {
                            await cancelFriendRequest(requestId);
                            afterAction();
                        }}
                    >
                        Отмена
                    </button>
                );

            case 'incoming':
                return (
                    <div className="flex gap-2">
                        <button
                            className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
                            onClick={async () => {
                                await acceptFriendRequest(requestId);
                                afterAction();
                            }}
                        >
                            Принять
                        </button>
                        <button
                            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                            onClick={async () => {
                                await rejectFriendRequest(requestId);
                                afterAction();
                            }}
                        >
                            Отклонить
                        </button>
                    </div>
                );

            case 'friends':
                return (
                    <span className="text-green-600 font-semibold">
                        Друзья
                    </span>
                );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Искать пользователей
                </h1>

                <input
                    type="text"
                    value={query}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Искать по имени пользователя"
                    className="w-full px-4 py-2 border rounded-lg mb-4
                               bg-white dark:bg-gray-700
                               text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="space-y-3">
                    {results.map(user => (
                        <div
                            key={user.id}
                            className="flex justify-between items-center
                                       bg-gray-50 dark:bg-gray-700
                                       px-4 py-3 rounded-lg"
                        >
                            <div>
                                <span
                                    className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:underline"
                                    onClick={() => navigate(`/user/${user.id}`)}
                                >
                                    {user.username}
                                </span>
                                <div className="text-sm text-gray-500 dark:text-gray-300">
                                    {user.firstName} {user.lastName}
                                </div>
                            </div>

                            {renderActions(user)}
                        </div>
                    ))}

                    {query.length >= 2 && results.length === 0 && (
                        <p className="text-gray-500 text-center mt-4">
                            Пользователь не найден
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendSearchPage;

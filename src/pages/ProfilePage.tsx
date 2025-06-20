import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserWithGames } from '../api/apiService';
import GameList from '../components/GameList';
import Settings from '../components/Settings';
import { Game } from '../types/Game';

interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    age: number;
    isAdmin: boolean;
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

const ProfilePage: React.FC = () => {
    const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const response = await getCurrentUserWithGames();
            setProfileData(response.data);
        } catch (error) {
            console.error('Failed to load user profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGameClick = (gameId: number) => {
        navigate(`/games/${gameId}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">Ошибка загрузки профиля</p>
            </div>
        );
    }

    const { user, games } = profileData;

    return (
        <div className="container mx-auto px-4 py-8">
            {showSettings ? (
                <Settings
                    onBack={() => setShowSettings(false)}
                />
            ) : (
                <>
                    {/* Информация о пользователе */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {user.username}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {user.firstName} {user.lastName}, {user.age}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {user.email}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowSettings(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                            >
                                Настройки
                            </button>
                        </div>
                    </div>

                    {/* Списки игр */}
                    <div className="space-y-8">
                        {/* Хочу поиграть */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                Хочу поиграть
                            </h2>
                            <GameList
                                games={games.want_to_play}
                                onGameClick={handleGameClick}
                                layout="grid"
                            />
                        </section>

                        {/* Сейчас играю */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                Сейчас играю
                            </h2>
                            <GameList
                                games={games.playing}
                                onGameClick={handleGameClick}
                                layout="grid"
                            />
                        </section>

                        {/* Играл */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                Играл
                            </h2>
                            <GameList
                                games={games.played}
                                onGameClick={handleGameClick}
                                layout="grid"
                            />
                        </section>

                        {/* Прошел */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                Прошел
                            </h2>
                            <GameList
                                games={games.completed}
                                onGameClick={handleGameClick}
                                layout="grid"
                            />
                        </section>

                        {/* Прошел на 100% */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                Прошел на 100%
                            </h2>
                            <GameList
                                games={games.completed_100}
                                onGameClick={handleGameClick}
                                layout="grid"
                            />
                        </section>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfilePage;

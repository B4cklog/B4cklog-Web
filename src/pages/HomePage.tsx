import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopularGames, getLatestGames } from '../api/apiService';
import GameList from '../components/GameList';

interface Game {
    id: number;
    title: string;
    coverUrl: string;
    releaseDate: string;
    description: string;
}

const HomePage: React.FC = () => {
    const [popularGames, setPopularGames] = useState<Game[]>([]);
    const [latestGames, setLatestGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadGames();
    }, []);

    const loadGames = async () => {
        try {
            const [popularResponse, latestResponse] = await Promise.all([
                getPopularGames(),
                getLatestGames()
            ]);
            setPopularGames(popularResponse.data);
            setLatestGames(latestResponse.data);
        } catch (error) {
            console.error('Failed to load games:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGameClick = (gameId: number) => {
        navigate(`/games/${gameId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Популярные игры */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Популярные игры</h2>
                {isLoading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <GameList
                        games={popularGames}
                        onGameClick={handleGameClick}
                        layout="horizontal"
                    />
                )}
            </section>

            {/* Последние релизы */}
            <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Последние релизы</h2>
                {isLoading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <GameList
                        games={latestGames}
                        onGameClick={handleGameClick}
                        layout="horizontal"
                    />
                )}
            </section>
        </div>
    );
};

export default HomePage;

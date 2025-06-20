import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GameList from '../components/GameList';
import { Game } from '../types/Game';

const SearchResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { results, query } = location.state as { results: Game[], query: string };

    const handleGameClick = (gameId: number) => {
        navigate(`/games/${gameId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Результаты поиска: {query}
            </h1>
            {results.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300 text-center">
                    Игры не найдены
                </p>
            ) : (
                <GameList
                    games={results}
                    onGameClick={handleGameClick}
                    layout="grid"
                />
            )}
        </div>
    );
};

export default SearchResultsPage; 
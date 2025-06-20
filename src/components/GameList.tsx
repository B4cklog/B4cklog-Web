import React from 'react';
import { Game } from '../types/Game';

interface GameListProps {
    games: Game[];
    onGameClick: (gameId: number) => void;
    layout: 'grid' | 'horizontal';
}

const GameList: React.FC<GameListProps> = ({ games, onGameClick, layout }) => {
    if (games.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                Нет игр в списке
            </div>
        );
    }

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
            return date.getFullYear().toString();
        }
        return '';
    };

    if (layout === 'horizontal') {
    return (
            <div className="flex overflow-x-auto space-x-4 pb-4">
                {games.map((game) => (
                    <div
                        key={game.id}
                        onClick={() => onGameClick(game.id)}
                        className="flex-none w-48 cursor-pointer group"
                    >
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                        <img
                                src={getCoverUrl(game)}
                                alt={game.name}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white truncate">
                            {game.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {getReleaseDate(game)}
                        </p>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {games.map((game) => (
                <div
                    key={game.id}
                    onClick={() => onGameClick(game.id)}
                    className="cursor-pointer group"
                >
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                        <img
                            src={getCoverUrl(game)}
                            alt={game.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white truncate">
                        {game.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {getReleaseDate(game)}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default GameList;

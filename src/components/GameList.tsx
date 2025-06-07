import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../pages/GameDetailPage'; // путь подкорректируй

interface GameListProps {
    title: string;
    games: Game[];
}

const GameList: React.FC<GameListProps> = ({ title, games }) => {
    const navigate = useNavigate();

    if (games.length === 0) {
        return (
            <div style={{ marginBottom: 24 }}>
                <h3>{title} (0)</h3>
                <p>Список пуст</p>
            </div>
        );
    }

    return (
        <div style={{ marginBottom: 24 }}>
            <h3>{title} ({games.length})</h3>
            <div
                style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 12,
                    paddingBottom: 8,
                }}
            >
                {games.map(game => (
                    <div
                        key={game.id}
                        onClick={() => navigate(`/games/${game.id}`)}
                        style={{
                            cursor: 'pointer',
                            minWidth: 120,
                            flexShrink: 0,
                            textAlign: 'center',
                        }}
                        title={game.name}
                    >
                        <img
                            src={game.cover || '/default-cover.png'}
                            alt={game.name}
                            style={{ width: '100%', height: 'auto', borderRadius: 8, marginBottom: 6 }}
                        />
                        <div
                            style={{
                                fontWeight: 'bold',
                                fontSize: 14,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {game.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameList;

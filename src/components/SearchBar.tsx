/** @jsxImportSource react */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { searchGames } from '../api/apiService';

type SearchBarProps = {
    onClose?: () => void;
};

export function SearchBar({ onClose }: SearchBarProps) {
    const [query, setQuery] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const response = await searchGames(query);
            navigate('/search', { state: { results: response.data, query } });
            if (onClose) onClose();
        } catch (error) {
            console.error('Error searching games:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    placeholder="Поиск игр..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2
                             px-4 py-1 bg-blue-500 text-white rounded-md
                             hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Поиск...' : 'Найти'}
                </button>
            </form>
        </div>
    );
} 
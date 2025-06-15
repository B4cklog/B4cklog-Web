import React, { useState, useEffect } from 'react';
import { updateEmail, updatePassword } from '../api/apiService';

interface SettingsProps {
    onThemeChange: (isDark: boolean) => void;
    initialTheme: boolean;
}

const Settings: React.FC<SettingsProps> = ({ onThemeChange, initialTheme }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(initialTheme);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        setIsDarkTheme(initialTheme);
    }, [initialTheme]);

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isDark = e.target.checked;
        setIsDarkTheme(isDark);
        onThemeChange(isDark);
    };

    const handleEmailUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateEmail(email);
            setMessage({ text: 'Email успешно обновлен', type: 'success' });
            setEmail('');
        } catch (error) {
            setMessage({ text: 'Ошибка при обновлении email', type: 'error' });
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ text: 'Пароли не совпадают', type: 'error' });
            return;
        }
        try {
            await updatePassword(newPassword);
            setMessage({ text: 'Пароль успешно обновлен', type: 'success' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage({ text: 'Ошибка при обновлении пароля', type: 'error' });
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Настройки</h2>

            {/* Тема */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Внешний вид</h3>
                <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isDarkTheme}
                            onChange={handleThemeChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {isDarkTheme ? 'Темная тема' : 'Светлая тема'}
                        </span>
                    </label>
                </div>
            </div>

            {/* Настройки аккаунта */}
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Настройки аккаунта</h3>

                {/* Обновление email */}
                <form onSubmit={handleEmailUpdate} className="mb-6">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Новый email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 
                                     text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Обновить email
                    </button>
                </form>

                {/* Обновление пароля */}
                <form onSubmit={handlePasswordUpdate}>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Новый пароль
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 
                                     text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Подтвердите пароль
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 
                                     text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Обновить пароль
                    </button>
                </form>
            </div>

            {/* Сообщения */}
            {message.text && (
                <div
                    className={`mt-4 p-4 rounded-lg ${
                        message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default Settings; 
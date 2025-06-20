import React, { useState } from 'react';
import { updateEmail, updatePassword } from '../api/apiService';

interface SettingsProps {
    onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Настройки</h2>
                <button
                    onClick={onBack}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
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
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
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
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        Обновить пароль
                    </button>
                </form>
            </div>

            {/* Сообщения */}
            {message.text && (
                <div
                    className={`mt-4 p-4 rounded-lg ${
                        message.type === 'success' 
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    }`}
                >
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default Settings; 
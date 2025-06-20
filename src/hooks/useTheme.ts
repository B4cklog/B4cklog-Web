import { useState, useEffect } from 'react';

export const useTheme = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        // Проверяем localStorage при инициализации
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme === 'dark';
            }
            // Если тема не сохранена, проверяем системные настройки
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        // Применяем тему к документу
        document.documentElement.classList.toggle('dark', isDarkTheme);
        // Сохраняем в localStorage
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    }, [isDarkTheme]);

    // Слушаем изменения системной темы
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            // Меняем тему только если пользователь не выбрал тему вручную
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme) {
                setIsDarkTheme(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    const setTheme = (isDark: boolean) => {
        setIsDarkTheme(isDark);
    };

    return {
        isDarkTheme,
        toggleTheme,
        setTheme
    };
}; 
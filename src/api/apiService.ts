import axios from 'axios';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const SESSION_ID_KEY = 'sessionId';

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        const isRefreshRequest = originalRequest && originalRequest.url && originalRequest.url.includes('/auth/refresh');
        if (error.response && error.response.status === 401 && !originalRequest._retry && !isRefreshRequest) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
            const sessionId = localStorage.getItem(SESSION_ID_KEY);
            if (refreshToken && sessionId) {
                try {
                    const res = await api.post('/auth/refresh', { refreshToken, sessionId });
                    const { accessToken } = res.data;
                    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem(ACCESS_TOKEN_KEY);
                    localStorage.removeItem(REFRESH_TOKEN_KEY);
                    localStorage.removeItem(SESSION_ID_KEY);
                    window.location.href = '/login';
                }
            } else {
                window.location.href = '/login';
            }
        } else if (error.response && error.response.status === 401 && isRefreshRequest) {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(SESSION_ID_KEY);
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    const { accessToken, refreshToken, sessionId } = response.data;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(SESSION_ID_KEY, sessionId);
    return response;
};

export const register = async (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    age: number
) => {
    const response = await api.post('/auth/register', { username, password, email, firstName, lastName, age });
    const { accessToken, refreshToken, sessionId } = response.data;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(SESSION_ID_KEY, sessionId);
    return response;
};

export const logout = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (refreshToken && sessionId) {
        try {
            await api.post('/auth/logout', { refreshToken, sessionId });
        } catch {}
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(SESSION_ID_KEY);
};

export const getUser = (userId: string) => {
    return api.get(`/users/${userId}`);
};

export const getCurrentUser = () => {
    return api.get('/users/profile');
};

export const getCurrentUserWithGames = () => {
    return api.get('/users/profile/withGames');
};

export const addGameToList = (userId: number, gameId: number, listName: string) => {
    return api.post(`/users/${userId}/addGameToList`, null, {
        params: {
            gameId,
            listName
        }
    });
};

export const removeGameFromAllLists = (userId: number, gameId: number) => {
    return api.delete(`/users/${userId}/removeGameFromAllLists`, {
        params: {
            gameId
        }
    });
};

export const getAllGames = () => {
    return api.get('/games/get/all');
};

export const getGame = (id: string) => {
    return api.get(`/games/get/${id}`);
};

export const searchGames = (query: string) => {
    return api.get('/games/search', {
        params: { q: query }
    });
};

export const updateEmail = (newEmail: string) => {
    return api.patch('/users/updateEmail', null, {
        params: { newEmail }
    });
};

export const updatePassword = (newPassword: string) => {
    return api.patch('/users/updatePassword', null, {
        params: { newPassword }
    });
};

export const getPopularGames = () => {
    return api.get('/games/popular');
};

export const getLatestGames = () => {
    return api.get('/games/latest');
};

export const getAverageRating = (gameId: number) => {
    return api.get(`/reviews/game/${gameId}/average`);
};

export const getUserReview = (userId: number, gameId: number) => {
    return api.get(`/reviews/user/${userId}/game/${gameId}`);
};

export const submitReview = (review: import('../types/Review').ReviewRequest) => {
    return api.post('/reviews/add', review);
};
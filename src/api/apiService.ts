import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const login = (username: string, password: string) => {
    return api.post('/auth/login', { username, password });
};

export const register = (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    age: number
) => {
    return api.post('/auth/register', { username, password, email, firstName, lastName, age });
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
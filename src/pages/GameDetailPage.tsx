import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGame, addGameToList, removeGameFromAllLists, getCurrentUser, getAverageRating, getUserReview, submitReview } from '../api/apiService';
import { Game } from '../types/Game';
import { ReviewResponse } from '../types/Review';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Modal from 'react-modal';

const lists = [
    { id: "wantToPlay", name: "Хочу поиграть" },
    { id: "playing", name: "Сейчас играю" },
    { id: "played", name: "Играл" },
    { id: "completed", name: "Прошел" },
    { id: "completed100", name: "Прошел на 100%" }
];

const GameDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [userId, setUserId] = useState<number | null>(null);
    const [selectedList, setSelectedList] = useState<string>(lists[0].id);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');
    const [actionSuccess, setActionSuccess] = useState('');

    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [userReview, setUserReview] = useState<ReviewResponse | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [fullscreenScreenshot, setFullscreenScreenshot] = useState<string | null>(null);

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
            return date.toLocaleDateString('ru-RU');
        }
        return 'Не указана';
    };

    useEffect(() => {
        const fetchGame = async () => {
            if (!id) return;
            setLoading(true);
            setError('');
            try {
                const response = await getGame(id);
                setGame(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Ошибка при загрузке игры');
            } finally {
                setLoading(false);
            }
        };

        const fetchUser = async () => {
            try {
                const res = await getCurrentUser();
                setUserId(res.data.id);
            } catch {
                setUserId(null);
            }
        };

        fetchGame();
        fetchUser();
    }, [id]);

    useEffect(() => {
        if (game) {
            getAverageRating(game.id).then(res => setAverageRating(res.data));
            if (userId) {
                getUserReview(userId, game.id).then(res => {
                    setUserReview(res.data);
                    setReviewRating(res.data.rating);
                    setReviewComment(res.data.comment || '');
                }).catch(() => setUserReview(null));
            }
        }
    }, [game, userId]);

    const handleAdd = async () => {
        if (!userId || !game) return;
        setActionLoading(true);
        setActionError('');
        setActionSuccess('');
        try {
            await addGameToList(userId, game.id, selectedList);
            setActionSuccess(`Игра добавлена в список ${lists.find(l => l.id === selectedList)?.name}`);
        } catch (e: any) {
            setActionError(e.response?.data?.message || 'Ошибка при добавлении игры');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemove = async () => {
        if (!userId || !game) return;
        setActionLoading(true);
        setActionError('');
        setActionSuccess('');
        try {
            await removeGameFromAllLists(userId, game.id);
            setActionSuccess('Игра удалена из всех списков');
        } catch (e: any) {
            setActionError(e.response?.data?.message || 'Ошибка при удалении игры');
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenReviewModal = () => {
        setIsReviewModalOpen(true);
    };
    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
    };
    const handleSubmitReview = async () => {
        if (!userId || !game) return;
        setReviewLoading(true);
        try {
            await submitReview({
                userId,
                gameId: game.id,
                rating: reviewRating,
                comment: reviewComment,
            });
            setUserReview({ rating: reviewRating, comment: reviewComment });
            getAverageRating(game.id).then(res => setAverageRating(res.data));
            setIsReviewModalOpen(false);
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-red-500 text-center">{error}</div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-gray-500 dark:text-gray-400 text-center">Игра не найдена</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Модальное окно для полноразмерного скриншота */}
            <Modal
                isOpen={!!fullscreenScreenshot}
                onRequestClose={() => setFullscreenScreenshot(null)}
                className="fixed inset-0 flex items-center justify-center z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-80 z-40"
                ariaHideApp={false}
            >
                <button
                    onClick={() => setFullscreenScreenshot(null)}
                    className="absolute top-4 right-4 z-50 text-white text-3xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-80 transition"
                    aria-label="Закрыть"
                >
                    &times;
                </button>
                <img
                    src={fullscreenScreenshot || ''}
                    alt="Скриншот"
                    className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
                    onClick={() => setFullscreenScreenshot(null)}
                />
            </Modal>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/3">
                        <img
                            src={getCoverUrl(game)}
                            alt={game.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-6 md:w-2/3">
                        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{game.name}</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{game.summary || 'Описание отсутствует'}</p>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            <span className="font-semibold">Дата релиза:</span> {getReleaseDate(game)}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                            <span className="font-semibold">Жанры:</span> {game.genres && game.genres.length > 0 ? game.genres.map(g => g.name).join(', ') : 'Не указаны'}
                        </p>
                        {/* Галерея скриншотов */}
                        {game.screenshots && game.screenshots.length > 0 && (
                            <div className="mb-6">
                                <span className="font-semibold text-gray-900 dark:text-white block mb-2">Скриншоты:</span>
                                <div className="flex flex-wrap gap-4">
                                    {game.screenshots.map(s => (
                                        <img
                                            key={s.id}
                                            src={s.url.replace('t_thumb', 't_screenshot_big').startsWith('//') ? `https:${s.url.replace('t_thumb', 't_screenshot_big')}` : s.url.replace('t_thumb', 't_screenshot_big')}
                                            alt="Скриншот"
                                            className="rounded shadow w-48 h-28 object-cover cursor-pointer hover:scale-105 transition-transform"
                                            onClick={() => setFullscreenScreenshot(s.url.replace('t_thumb', 't_screenshot_huge').startsWith('//') ? `https:${s.url.replace('t_thumb', 't_screenshot_huge')}` : s.url.replace('t_thumb', 't_screenshot_huge'))}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {userId ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                        Добавить игру в список
                                    </h3>
                                    <select
                                        value={selectedList}
                                        onChange={e => setSelectedList(e.target.value)}
                                        disabled={actionLoading}
                                        className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 
                                                 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                    >
                                        {lists.map(list => (
                                            <option key={list.id} value={list.id}>
                                                {list.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleAdd}
                                        disabled={actionLoading}
                                        className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-lg
                                                 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                                                 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {actionLoading ? 'Добавление...' : 'Добавить'}
                                    </button>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                        Удалить игру из всех списков
                                    </h3>
                                    <button
                                        onClick={handleRemove}
                                        disabled={actionLoading}
                                        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg
                                                 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500
                                                 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {actionLoading ? 'Удаление...' : 'Удалить из всех списков'}
                                    </button>
                                </div>

                                {actionError && (
                                    <p className="text-red-500 text-center">{actionError}</p>
                                )}
                                {actionSuccess && (
                                    <p className="text-green-500 text-center">{actionSuccess}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                Авторизуйтесь, чтобы редактировать списки.
                            </p>
                        )}

                        {/* Средний рейтинг — делаем акцентированным и современным */}
                        <div className="mt-8 mb-6 flex items-center gap-3">
                            <span className="font-semibold text-gray-900 dark:text-white">Средний рейтинг:</span>
                            {averageRating !== null ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-lg font-bold shadow">
                                    <svg className="w-5 h-5 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z"/></svg>
                                    {averageRating.toFixed(1)}
                                </span>
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400">—</span>
                            )}
                        </div>
                        {/* Новый современный блок отзыва */}
                        {userReview && (
                            <div className="mb-6 flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-blue-200 dark:border-blue-800 shadow-lg">
                                <div className="flex flex-col items-center min-w-[64px]">
                                    <div className="w-14 h-14 rounded-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center shadow">
                                        <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z"/></svg>
                                    </div>
                                    <span className="mt-2 text-xl font-extrabold text-blue-700 dark:text-blue-300">{userReview.rating}/5</span>
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-900 dark:text-white mb-1 text-lg">Ваш отзыв</div>
                                    <div className="text-gray-700 dark:text-gray-200 whitespace-pre-line text-base">{userReview.comment || '—'}</div>
                                </div>
                            </div>
                        )}
                        <button
                            className="px-5 py-2 border border-blue-400 dark:border-blue-700 bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition font-semibold shadow-sm mt-2"
                            onClick={handleOpenReviewModal}
                        >
                            {userReview ? 'Изменить отзыв' : 'Оставить отзыв'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Модальное окно для отзыва */}
            <Transition appear show={isReviewModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleCloseReviewModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-7 text-left align-middle shadow-2xl transition-all border border-blue-200 dark:border-blue-800">
                                    <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-blue-700 dark:text-blue-300 mb-4">
                                        {userReview ? 'Изменить отзыв' : 'Оставить отзыв'}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <label className="block mb-2 text-gray-800 dark:text-gray-200 font-semibold">Оценка:</label>
                                        <select
                                            className="w-full p-2 border rounded mb-4 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700 focus:ring-2 focus:ring-blue-400"
                                            value={reviewRating}
                                            onChange={e => setReviewRating(Number(e.target.value))}
                                        >
                                            {[1,2,3,4,5].map(n => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                        <label className="block mb-2 text-gray-800 dark:text-gray-200 font-semibold">Комментарий:</label>
                                        <textarea
                                            className="w-full p-2 border rounded bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700 focus:ring-2 focus:ring-blue-400 placeholder-gray-400 dark:placeholder-gray-500"
                                            rows={4}
                                            value={reviewComment}
                                            onChange={e => setReviewComment(e.target.value)}
                                            placeholder="Ваш отзыв..."
                                        />
                                    </div>
                                    <div className="mt-6 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold"
                                            onClick={handleCloseReviewModal}
                                            disabled={reviewLoading}
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold shadow"
                                            onClick={handleSubmitReview}
                                            disabled={reviewLoading}
                                        >
                                            {reviewLoading ? 'Сохранение...' : 'Сохранить'}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default GameDetailPage;

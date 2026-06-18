import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import GameDetailPage from "./pages/GameDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import UserProfilePage from './pages/UserProfilePage';
import { useTheme } from './hooks/useTheme';
import './styles/themes.css';
import FriendSearchPage from "./pages/FriendSearchPage";

function App() {
    // Инициализируем глобальную тему
    useTheme();

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                {/* Доступно всем */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Главная страница - зависит от авторизации */}
                <Route path="/" element={
                    <PrivateRoute>
                        <HomePage />
                    </PrivateRoute>
                } />

                {/* Только для авторизованных */}
                <Route path="/games/:id" element={
                    <PrivateRoute>
                        <GameDetailPage />
                    </PrivateRoute>
                } />
                <Route path="/search" element={
                    <PrivateRoute>
                        <SearchResultsPage />
                    </PrivateRoute>
                } />
                <Route path="/friends/search" element={
                    <PrivateRoute>
                        <FriendSearchPage />
                    </PrivateRoute>
                } />
                <Route path="/user/:id" element={
                    <PrivateRoute>
                        <UserProfilePage />
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import GameDetailPage from "./pages/GameDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import WelcomePage from './pages/WelcomePage';
import './styles/themes.css';

function App() {
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
                <Route path="/profile" element={
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                } />
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
            </Routes>
        </BrowserRouter>
    );
}

export default App;

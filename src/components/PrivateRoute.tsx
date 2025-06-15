// components/PrivateRoute.tsx
import React, {JSX} from 'react';
import WelcomePage from '../pages/WelcomePage';

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Если токена нет, показываем WelcomePage
        return <WelcomePage />;
    }
    return children;
};

export default PrivateRoute;

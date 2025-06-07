// components/PrivateRoute.tsx
import React, {JSX} from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Если токена нет, редиректим на логин
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default PrivateRoute;

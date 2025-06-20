import React, {JSX} from 'react';
import WelcomePage from '../pages/WelcomePage';

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!accessToken || !refreshToken) {
        return <WelcomePage />;
    }
    return children;
};

export default PrivateRoute;

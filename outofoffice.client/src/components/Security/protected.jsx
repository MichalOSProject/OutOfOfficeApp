import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Protected = () => {
    const token = localStorage.getItem("token");

    if (token === undefined || token === null)
        return <Navigate to="/login" />;

    const decodedToken = jwtDecode(token);
    if ((decodedToken.changePassword === 'True'))
        return <Navigate to="/resetPassword" />;

    try {
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();

        if (isTokenExpired) {
            localStorage.removeItem('token');
            return <Navigate to="/login" />;
        }
    } catch (error) {
        console.error('Invalid token:', error);
        return <Navigate to="/login" />;
    }



    return <Outlet />;
};

export default Protected;
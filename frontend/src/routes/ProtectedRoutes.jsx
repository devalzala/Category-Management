import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes() {

    let auth = { authUser: false };

    if (localStorage.getItem("token")) {
        auth = { authUser: true };
    }

    return auth.authUser ? <Outlet /> : <Navigate to={'/login'} />;
}

export default ProtectedRoutes;
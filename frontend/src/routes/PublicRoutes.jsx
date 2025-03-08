import { Navigate, Outlet } from "react-router-dom";

function PublicRoutes() {

    let auth = { authUser: true };

    if (!localStorage.getItem("token")) {
        auth = { authUser: false };
    }

    return !auth.authUser ? <Outlet /> : <Navigate to={'/'} />;
}

export default PublicRoutes;
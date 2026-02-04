import { useAuth } from "@/context/auth.context";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * This component protects all the routes within it
 * 
 * @returns JSX.Element
 */
export default function ProtectedRoute() {
    const { checkAuth, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, [location.pathname, checkAuth]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center gap-2 w-full h-[90vh]">
                <LoaderCircle className="animate-spin" />
                <span className="text-lg font-medium">Loading</span>
            </div>
        )
    }

    // If there's no session
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // If the user session exists
    return <Outlet />
}

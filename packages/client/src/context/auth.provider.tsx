import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./auth.context";
import type { AuthResponse, Session } from "@/types/Session";
import { authService } from "@/services/authService";
import type { LoginForm } from "@/schemas/loginForm.schema";
import type { RegisterForm } from "@/schemas/registerForm.schema";
import { APIError } from "@/utils/APIError";

/** Provider props */
interface Props {
    children: React.ReactNode;
}

/**
 * This context provider provides the children with the session data, login, register and logout function
 * 
 * @param {Props} props - Component props 
 * @returns JSX.Element - Context provider
 */
export const AuthProvider = ({ children }: Props) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!session;

    // Check if the user is authenticated and set the session
    const checkAuth = useCallback(async (): Promise<AuthResponse> => {
        try {
            setIsLoading(true);

            await authService.isAuthenticated();

            return { success: true, error: null }
        } catch (error) {
            setSession(null);

            if (error instanceof APIError) {
                return { success: false, error }
            }

            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Check if the user is authenticated and set the session
    const getSession = useCallback(async (): Promise<AuthResponse> => {
        try {
            setIsLoading(true);

            const session = await authService.getSession();

            setSession(session);

            return { success: true, error: null }
        } catch (error) {
            setSession(null);

            if (error instanceof APIError) {
                return { success: false, error }
            }

            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Log in the user and set the session
    const login = useCallback(async (data: LoginForm): Promise<AuthResponse> => {
        try {
            setIsLoading(true);

            const session = await authService.login(data);

            setSession(session);

            return { success: true, error: null }
        } catch (error) {
            setSession(null);

            if (error instanceof APIError) {
                return { success: false, error }
            }

            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Register an user and set the session
    const register = useCallback(async (data: RegisterForm): Promise<AuthResponse> => {
        try {
            setIsLoading(true);

            const session = await authService.register(data);

            setSession(session);

            return { success: true, error: null }
        } catch (error) {
            setSession(null);

            if (error instanceof APIError) {
                return { success: false, error }
            }

            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Log out the user and remove the session
    const logout = useCallback(async (): Promise<AuthResponse> => {
        try {
            setIsLoading(true);

            await authService.logout();

            setSession(null);

            return { success: true, error: null }
        } catch (error) {
            setSession(null);

            if (error instanceof APIError) {
                return { success: false, error }
            }

            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getSession();
    }, [getSession]);

    return (
        <AuthContext.Provider value={{
            session,
            isLoading,
            isAuthenticated,
            checkAuth,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}
import type { LoginForm } from "@/schemas/loginForm.schema";
import type { RegisterForm } from "@/schemas/registerForm.schema";
import type { Session } from "@/types/Session";
import { createContext, useContext } from "react";
import type { AuthResponse } from "@/types/Session";

/** Context interface */
interface AuthContextType {
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginForm) => Promise<AuthResponse>;
    register: (data: RegisterForm) => Promise<AuthResponse>;
    logout: () => Promise<AuthResponse>;
}

// AuthContext definition
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * This hook provides a user data, the backend URL...
 * 
 * @returns context - user, BACKEND_URL...
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) throw new Error("useAuth must be used within a AuthProvider");

    return context;
}
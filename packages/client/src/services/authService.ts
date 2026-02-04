import axios, { AxiosError } from "axios";
import type { Session } from "@/types/Session";
import type { LoginForm } from "@/schemas/loginForm.schema";
import type { RegisterForm } from "@/schemas/registerForm.schema";
import { APIError } from "@/utils/APIError";

interface BackendError {
    error: string;
}

// API URL (BACKEND)
const API_URL = import.meta.env.VITE_BACKEND_URL;

// Create an axios instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<BackendError>) => {
        const message = error.response?.data.error || "Server error";
        const status = error.response?.status || 500;

        return Promise.reject(new APIError(message, status));
    }
);

/** 
 * Contain the auth services (login, register and logout)
 */
export const authService = {
    /**
     * Log in the user
     * 
     * @param {LoginForm} credentials - User credentials
     * @returns AxiosResponse with the session info
     */
    async login(credentials: LoginForm) {
        const { data } = await api.post<Session>("/api/auth/login", credentials);

        return data;
    },

    /**
     * Register a new user
     * 
     * @param {RegisterForm} userData - User registration data 
     * @returns AxiosResponse with the session info
     */
    async register(userData: RegisterForm) {
        const { data } = await api.post<Session>("/api/auth/register", userData);

        return data;
    },

    /**
     * Log out an user
     */
    async logout() {
        await api.post("/api/auth/logout");
    },

    /**
     * Verify if the user is authenticated
     * 
     * @returns AxiosResponse with success message
     */
    async isAuthenticated() {
        const { data } = await api.post<{ message: string }>("/api/auth/is-auth");

        return data;
    },

    /**
     * Verify if the user is authenticated and get the session
     * 
     * @returns AxiosResponse with the session info
     */
    async getSession() {
        const { data } = await api.post<Session>("/api/auth/get-session");

        return data;
    }
}
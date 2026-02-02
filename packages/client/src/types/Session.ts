import type { APIError } from "@/utils/APIError";

export interface Session {
    id: string;
    name: string;
    email: string;
}

export type AuthResponse = {
    success: true,
    error: null
} | {
    success: false,
    error: APIError
}

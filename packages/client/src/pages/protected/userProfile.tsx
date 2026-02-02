import { useAuth } from "@/context/auth.context";

/**
 * User profile page
 * (PROTECTED ROUTE)
 * 
 * @returns JSX.Element
 */
export default function UserProfile() {
    const { session, logout, isLoading } = useAuth();

    return (
        <div className="flex flex-col justify-center items-center gap-4 w-full h-[90vh]">
            <pre className="p-2 rounded-md border border-white/15">
                {JSON.stringify(session)}
            </pre>

            <button
                onClick={logout}
                disabled={isLoading}
                className="disabled:opacity-80 flex justify-center items-center gap-2 text-white font-medium mt-6 py-3 px-4 rounded-lg bg-rose-500 cursor-pointer transition hover:bg-rose-600"
            >
                Log out
            </button>
        </div>
    )
}

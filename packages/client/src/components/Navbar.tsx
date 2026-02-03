import { Link, NavLink } from "react-router-dom";
import { LogIn, User } from "lucide-react";
import { useAuth } from "@/context/auth.context";

/**
 * Navigation var component
 * 
 * @returns JSX.Element
 */
export default function Navbar() {
    const { isAuthenticated } = useAuth();
    const isActive = ({ isActive }: { isActive: boolean }) =>
        `${isActive ? "text-amber-500 border-amber-500" : "text-white border-white"} flex items-center gap-2 py-2 px-4 border-2 rounded-full text-sm font-medium transition hover:text-amber-300 hover:border-amber-300`;

    return (
        <div className="fixed top-0 flex items-center justify-between w-full py-4 px-6 bg-zinc-800">
            <Link
                to="/"
                className="text-xl font-semibold"
            >
                SERN Auth
            </Link>

            <ul className="flex items-center gap-8">
                {isAuthenticated ? (
                    <li>
                        <NavLink to="/user_profile" className={isActive}>
                            <User />
                        </NavLink>
                    </li>
                ) : (
                    <li>
                        <NavLink to="/login" className={isActive}>
                            <span>Login</span>
                            <LogIn className="size-4" />
                        </NavLink>
                    </li>
                )}
            </ul>
        </div>
    )
}

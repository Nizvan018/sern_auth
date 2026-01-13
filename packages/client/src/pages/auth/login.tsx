import { Link } from "react-router-dom"

export default function Login() {
    return (
        <main className="flex flex-col justify-center items-center w-full h-[calc(100vh-96px)] mt-24 px-6">
            <div className="flex flex-col gap-6 py-16 px-8 rounded-xl bg-zinc-800">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl">Login</h1>
                    <span className="text-zinc-300">Proced to locked pages</span>
                </div>

                <form className="flex flex-col gap-6 my-4">
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-96 text-zinc-50 py-2 px-3 rounded-lg bg-zinc-700 outline-none focus:shadow-sm"
                    />

                    <div className="flex flex-col gap-2">
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-96 text-zinc-50 py-2 px-3 rounded-lg bg-zinc-700 outline-none focus:shadow-sm"
                        />
                        <Link
                            to="reset_password"
                            className="text-xs hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </form>

                <button
                    className="w-full text-zinc-800 font-medium py-3 px-4 rounded-lg bg-white cursor-pointer transition hover:bg-zinc-100"
                >
                    Log in
                </button>

                <Link
                    to="/register"
                    className="w-full text-center text-sm italic hover:underline"
                >
                    Don't have an account?
                </Link>
            </div>
        </main>
    )
}

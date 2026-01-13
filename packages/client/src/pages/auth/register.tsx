import { Link } from "react-router-dom";

export default function Register() {
    return (
        <main className="flex justify-center items-center w-full h-[calc(100vh-96px)] mt-24 px-6">
            <div className="flex flex-col gap-6 py-16 px-8 rounded-xl bg-zinc-800">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl">Register</h1>
                    <span className="text-zinc-300">Create a new account</span>
                </div>

                <form className="flex flex-col gap-6 my-4">
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-96 text-zinc-50 py-2 px-3 rounded-lg bg-zinc-700 outline-none focus:shadow-sm"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-96 text-zinc-50 py-2 px-3 rounded-lg bg-zinc-700 outline-none focus:shadow-sm"
                    />
                </form>

                <button
                    className="w-full text-zinc-800 font-medium py-3 px-4 rounded-lg bg-white cursor-pointer transition hover:bg-zinc-100"
                >
                    Register
                </button>

                <Link
                    to="/login"
                    className="w-full text-center text-sm italic hover:underline"
                >
                    Do you already have an account?
                </Link>
            </div>
        </main>
    )
}

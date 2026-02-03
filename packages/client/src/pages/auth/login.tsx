import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginFormSchema, type LoginForm } from "../../schemas/loginForm.schema";
import CustomInput from "../../components/CustomInput";
import { useState } from "react";
import { useAuth } from "@/context/auth.context";
import { LoaderCircle } from "lucide-react";
import ErrorIndicator from "@/components/ErrorIndicator";

/**
 * Page for user login
 * 
 * @returns JSX.Element
 */
export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Send data to login the user
    const submit = async (data: LoginForm) => {
        try {
            setIsLoading(true);
            setError(null);

            const { success, error } = await login(data);

            if (!success) {
                console.error(error);
                setError(error.message);
                return;
            }

            navigate("/user_profile");
        } catch (error) {
            console.error(error);
            setError("An unexpected error has ocurred while login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex flex-col justify-center items-center w-full h-[calc(100vh-96px)] mt-24 px-6">
            <div className="flex flex-col gap-6 py-16 px-8 rounded-xl bg-zinc-800">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl">Login</h1>
                    <span className="text-zinc-300">Proced to locked pages</span>
                </div>

                <form
                    onSubmit={handleSubmit(submit)}
                    className="flex flex-col gap-4 my-4"
                >
                    <CustomInput
                        control={control}
                        name="email"
                        placeholder="E-mail"
                        className="w-96"
                        error={errors.email}
                    />

                    <div className="flex flex-col gap-2">
                        <CustomInput
                            control={control}
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="w-96"
                            error={errors.password}
                        />
                        <Link
                            to="reset_password"
                            className="text-xs hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="disabled:opacity-80 flex justify-center items-center gap-2 w-full text-zinc-800 font-medium mt-6 py-3 px-4 rounded-lg bg-white cursor-pointer transition hover:bg-zinc-100"
                    >
                        {isLoading ? (
                            <>
                                <span>Loading</span>
                                <LoaderCircle className="animate-spin" />
                            </>
                        ) : (
                            <span>Log in</span>
                        )}
                    </button>
                </form>

                {error && (
                    <ErrorIndicator error={error} />
                )}

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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import CustomInput from "../../components/CustomInput";
import { registerFormSchema, type RegisterForm } from "../../schemas/registerForm.schema";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth.context";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import ErrorIndicator from "@/components/ErrorIndicator";

/**
 * Page for user registration
 * 
 * @returns JSX.Element
 */
export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Send data to create user
    const submit = async (data: RegisterForm) => {
        try {
            setIsLoading(true);
            setError(null);

            const { success, error } = await register(data);

            if (!success) {
                console.error(error);
                setError(error.message);
                return;
            }

            navigate("/user_profile");
        } catch (error) {
            console.error(error);
            setError("An unexpected error has ocurred while register user");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex justify-center items-center w-full h-[calc(100vh-96px)] mt-24 px-6">
            <div className="flex flex-col gap-6 py-16 px-8 rounded-xl bg-zinc-800">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl">Register</h1>
                    <span className="text-zinc-300">Create a new account</span>
                </div>

                <form
                    onSubmit={handleSubmit(submit)}
                    className="flex flex-col gap-4 my-4"
                >
                    <CustomInput
                        control={control}
                        name="name"
                        placeholder="Full name"
                        className="w-96"
                        error={errors.name}
                    />

                    <CustomInput
                        control={control}
                        name="email"
                        placeholder="E-mail"
                        className="w-96"
                        error={errors.email}
                    />

                    <CustomInput
                        control={control}
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-96"
                        error={errors.password}
                    />

                    <CustomInput
                        control={control}
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        className="w-96"
                        error={errors.confirmPassword}
                    />

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
                            <span>Register</span>
                        )}
                    </button>
                </form>

                {error && (
                    <ErrorIndicator error={error} />
                )}

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

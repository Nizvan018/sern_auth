import { Controller, type Control, type FieldError, type FieldValues, type Path } from "react-hook-form";

/** Component props */
interface Props<T extends FieldValues, F extends FieldValues> {
    name: Path<T>;
    placeholder: string;
    control: Control<T, unknown, F>;
    type?: React.HTMLInputTypeAttribute;
    maxLength?: number;
    disabled?: boolean;
    error?: FieldError;
    className?: string;
}

/**
 * Custom input with Controller
 * 
 * @param {Props} props - Component props
 * @returns JSX.Element
 */
export default function CustomInput<T extends FieldValues, F extends FieldValues>({
    name,
    control,
    placeholder,
    type = "text",
    maxLength,
    disabled,
    error,
    className
}: Props<T, F>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className={`${className} flex flex-col gap-1`}>
                    <input
                        id={name}
                        {...field}
                        type={type}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        disabled={disabled}
                        className="w-full text-zinc-50 py-2 px-3 rounded-lg bg-zinc-700 outline-none focus:shadow-sm"
                    />
                    <span className="h-3 text-xs text-rose-500">
                        {error ? error.message : ""}
                    </span>
                </div>
            )}
        />
    )
}

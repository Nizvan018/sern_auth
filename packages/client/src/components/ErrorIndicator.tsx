/** Component props */
interface Props {
    /** Error message */
    error: string;
    /** Class name */
    className?: string;
}

/**
 * Custom error indicator
 * 
 * @param {Props} props - Component props
 * @returns JSX.Element
 */
export default function ErrorIndicator({ error, className }: Props) {
    return (
        <span className={`${className} flex justify-center items-center text-sm text-rose-500 text-center rounded-md p-2 border border-rose-500 bg-rose-500/10`}>
            {error}
        </span>
    )
}

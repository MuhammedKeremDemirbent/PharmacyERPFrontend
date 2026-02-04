import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = '', error, ...props }, ref) => {

    const baseStyles = "w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out";

    // Hata durumunda kırmızı çerçeve
    const borderColor = error
        ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 hover:border-gray-400";

    return (
        <div className="w-full">
            <input
                ref={ref}
                className={`${baseStyles} ${borderColor} ${className}`}
                {...props}
            />
            {/* Hata mesajı Input atomunun içinde mi olmalı? Genelde FormField'da olur ama burada basitlik için opsiyonel bıraktım */}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

import React from 'react';
import { Input as ShadcnInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
    return (
        <div className="w-full">
            <ShadcnInput
                ref={ref}
                className={cn(
                    error ? "border-red-500 focus-visible:ring-red-500" : "",
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

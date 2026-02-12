import React from 'react';
import { Button as ShadcnButton, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';

// Shadcn Button varyantlarıyla bizim varyantları eşleştirmek için
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'destructive' | 'outline' | 'default' | 'link';
    size?: 'sm' | 'md' | 'lg' | 'default' | 'icon';
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className,
    disabled,
    ...props
}) => {
    // Bizim varyantları Shadcn varyantlarına dönüştürme
    let shadcnVariant: VariantProps<typeof buttonVariants>['variant'] = 'default';
    let customClass = '';

    switch (variant) {
        case 'primary':
        case 'default':
            shadcnVariant = 'default'; // Mavi
            break;
        case 'secondary':
            shadcnVariant = 'secondary'; // Gri
            break;
        case 'danger':
        case 'destructive':
            shadcnVariant = 'destructive'; // Kırmızı
            break;
        case 'ghost':
            shadcnVariant = 'ghost'; // Şeffaf
            break;
        case 'outline':
            shadcnVariant = 'outline';
            break;
        case 'link':
            shadcnVariant = 'link';
            break;
        case 'success':
            shadcnVariant = 'default'; // Yeşil (Özel class ile)
            customClass = 'bg-green-600 hover:bg-green-700 text-white';
            break;
        case 'warning':
            shadcnVariant = 'default'; // Sarı (Özel class ile)
            customClass = 'bg-yellow-500 hover:bg-yellow-600 text-white';
            break;
        default:
            shadcnVariant = 'default';
    }

    // Boyut dönüşümü
    let shadcnSize: VariantProps<typeof buttonVariants>['size'] = 'default';
    switch (size) {
        case 'sm': shadcnSize = 'sm'; break;
        case 'lg': shadcnSize = 'lg'; break;
        case 'icon': shadcnSize = 'icon'; break;
        default: shadcnSize = 'default';
    }

    return (
        <ShadcnButton
            variant={shadcnVariant}
            size={shadcnSize}
            className={cn(customClass, className)}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </ShadcnButton>
    );
};

export default Button;

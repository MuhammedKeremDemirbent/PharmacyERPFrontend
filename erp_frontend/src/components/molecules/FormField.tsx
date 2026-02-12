import React from 'react';
import Input from '../atoms/Input';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

import { Label } from "@/components/ui/label";

const FormField: React.FC<FormFieldProps> = ({ label, id, error, className, ...props }) => {
    return (
        <div className={`mb-4 ${className}`}>
            <Label htmlFor={id} className="mb-2 block">
                {label}
            </Label>
            <Input id={id} error={error} {...props} />
        </div>
    );
};

export default FormField;

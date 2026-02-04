import React from 'react';
import Input from '../atoms/Input';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, id, error, className, ...props }) => {
    return (
        <div className={`mb-4 ${className}`}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <Input id={id} error={error} {...props} />
        </div>
    );
};

export default FormField;

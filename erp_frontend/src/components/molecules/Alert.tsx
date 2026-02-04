import React from 'react';
import Button from '../atoms/Button';

export interface AlertProps {
    type: 'success' | 'error' | 'warning';
    title?: string;
    message: string;
    onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {

    let icon = null;
    let titleColor = 'text-gray-900';
    let buttonVariant: 'success' | 'danger' | 'warning' = 'success';

    if (type === 'success') {
        icon = (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            </div>
        );
        title = title || 'İşlem Başarılı!';
        buttonVariant = 'success';
    } else if (type === 'error') {
        icon = (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        );
        title = title || 'Bir Hata Oluştu!';
        buttonVariant = 'danger';
    } else if (type === 'warning') {
        icon = (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 mb-4">
                <svg className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>
        );
        title = title || 'Dikkat!';
        buttonVariant = 'warning';
    }

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full transform transition-all scale-100">
                <div className="text-center">
                    {icon}
                    <h3 className={`text-2xl font-bold ${titleColor} mb-2`}>
                        {title}
                    </h3>
                    <p className="text-gray-600 mb-8 font-medium">
                        {message}
                    </p>
                    <div className="mt-4">
                        <Button
                            variant={buttonVariant}
                            className="w-full"
                            onClick={onClose}
                        >
                            Tamam
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alert;

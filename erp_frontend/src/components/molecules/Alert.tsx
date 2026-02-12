import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export interface AlertProps {
    type: 'success' | 'error' | 'warning';
    title?: string;
    message: string;
    onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {

    // Varsayılan başlıklar
    const defaultTitles = {
        success: 'İşlem Başarılı!',
        error: 'Bir Hata Oluştu!',
        warning: 'Dikkat!'
    };

    const finalTitle = title || defaultTitles[type];

    // Type'a göre stil veya ikon (İsteğe bağlı, Shadcn sade sever ama renk katabiliriz)
    const titleColorData = {
        success: 'text-green-600',
        error: 'text-destructive',
        warning: 'text-yellow-600'
    };

    return (
        <AlertDialog open={true} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className={titleColorData[type]}>{finalTitle}</AlertDialogTitle>
                    <AlertDialogDescription className="text-base text-foreground/80">
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onClose} className={type === 'error' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}>
                        Tamam
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default Alert;

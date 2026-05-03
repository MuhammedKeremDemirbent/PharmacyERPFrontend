import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../store/api/passwordChangeApi';
import Alert from '../components/molecules/Alert';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await forgotPassword({ email }).unwrap();
            setIsSent(true);
        } catch (err: any) {
            console.error(err);
            setError(err.data?.message || err.data?.detail || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <Card className="w-full max-w-md shadow-lg border-0">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Mail Gönderildi!</h2>
                        <p className="text-gray-500">
                            Lütfen <b>{email}</b> adresini kontrol edin. Şifre sıfırlama bağlantısını içeren bir e-posta gönderdik.
                        </p>
                        <div className="pt-4">
                            <Link to="/">
                                <Button variant="outline" className="w-full">
                                    Giriş Sayfasına Dön
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md shadow-xl border-border/40">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Şifremi Unuttum</CardTitle>
                    <CardDescription className="text-center">
                        E-posta adresinizi girin, size sıfırlama bağlantısı gönderelim.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta Adresi</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ornek@eczane.com"
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
                        </Button>

                        <div className="text-center text-sm">
                            <Link to="/" className="text-primary hover:underline flex items-center justify-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Giriş sayfasına dön
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Global Alert componenti varsa kullanılabilir, yoksa inline error yeterli */}
        </div>
    );
};

export default ForgotPassword;

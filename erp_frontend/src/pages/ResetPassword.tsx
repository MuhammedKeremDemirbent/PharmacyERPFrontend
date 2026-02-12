import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '@/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Eğer token yoksa ana sayfaya yönlendir veya hata göster
    useEffect(() => {
        if (!token) {
            setError("Geçersiz veya eksik sıfırlama bağlantısı.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor.");
            return;
        }

        if (password.length < 6) {
            setError("Şifre en az 6 karakter olmalıdır.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await axios.post('/accounts/reset-password/', {
                token: token,
                new_password: password
            });
            setIsSuccess(true);
            // 3 saniye sonra login'e yönlendir
            setTimeout(() => navigate('/'), 3000);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Bağlantı geçersiz veya süresi dolmuş.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <Card className="w-full max-w-md shadow-lg border-0">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Şifreniz Değiştirildi!</h2>
                        <p className="text-gray-500">
                            Yeni şifrenizle giriş yapabilirsiniz. Yönlendiriliyorsunuz...
                        </p>
                        <Button onClick={() => navigate('/')} className="w-full mt-4">
                            Giriş Yap
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md shadow-xl border-border/40">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Yeni Şifre Belirle</CardTitle>
                    <CardDescription className="text-center">
                        Lütfen yeni şifrenizi giriniz.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!token && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                Hata: Sıfırlama tokeni bulunamadı. Lütfen maildeki linke tekrar tıklayın.
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="password">Yeni Şifre</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="******"
                                    className="pl-10 pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={!token}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="******"
                                    className="pl-10"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={!token}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading || !token}>
                            {isLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;

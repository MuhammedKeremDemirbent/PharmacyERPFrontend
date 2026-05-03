import { useState } from "react";
import { Link } from "react-router-dom";
import { useLoginMutation } from "../store/api/authApi";
import Alert from "../components/molecules/Alert";
import Button from "../components/atoms/Button";
import FormField from "../components/molecules/FormField";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [messageData, setMessageData] = useState<{ type: 'success' | 'error' | 'warning', title?: string, message: string } | null>(null);

    const [login, { isLoading }] = useLoginMutation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessageData(null);

        try {
            // Backend: POST /token/ -> { access: "...", refresh: "..." }
            const response = await login({ username, password }).unwrap();

            const { access, refresh } = response;

            // Tokenları kaydet (Redux üzerinden)
            dispatch(loginSuccess({
                user: username,
                token: access,
                refreshToken: refresh
            }));

            // Dashboard'a yönlendir
            window.location.href = "/";

        } catch (err: any) {
            console.error("Login Hatası:", err);
            // Hata mesajını düzgün gösterelim
            const errorMsg = err.data?.detail || err.data?.error || 'Giriş başarısız! Kullanıcı adı veya şifre hatalı.';
            setMessageData({ type: 'error', message: errorMsg });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40">
            <Card className="w-full max-w-md shadow-2xl border-none">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold text-primary">
                        Eczane Yönetim Sistemi
                    </CardTitle>
                    <CardDescription>
                        Lütfen hesabınıza giriş yapın.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {messageData && (
                        <Alert
                            type={messageData.type}
                            title={messageData.title}
                            message={messageData.message}
                            onClose={() => setMessageData(null)}
                        />
                    )}

                    <form onSubmit={handleLogin} className="space-y-4 pt-4">
                        <FormField
                            id="username"
                            label="Kullanıcı Adı"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            required
                        />

                        <FormField
                            id="password"
                            label="Şifre"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                            required
                        />

                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                                Şifremi Unuttum?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full"
                        >
                            Giriş Yap
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;

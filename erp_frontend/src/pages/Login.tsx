import { useState } from "react";
import api from "../api";
import Alert from "../components/molecules/Alert";
import Button from "../components/atoms/Button";
import FormField from "../components/molecules/FormField";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [messageData, setMessageData] = useState<{ type: 'success' | 'error' | 'warning', title?: string, message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);


        try {
            // Backend: POST /token/ -> { access: "...", refresh: "..." }
            const response = await api.post("/token/", { username, password });

            const { access, refresh } = response.data;

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
            setMessageData({ type: 'error', message: 'Giriş başarısız! Kullanıcı adı veya şifre hatalı.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
                    Eczane Yönetim Sistemi
                </h2>
                <p className="text-gray-500 text-center mb-8">
                    Lütfen hesabınıza giriş yapın.
                </p>

                {messageData && (
                    <Alert
                        type={messageData.type}
                        title={messageData.title}
                        message={messageData.message}
                        onClose={() => setMessageData(null)}
                    />
                )}

                <form onSubmit={handleLogin}>
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
                        className="mb-8"
                    />

                    <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                        Giriş Yap
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;

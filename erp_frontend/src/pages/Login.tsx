import { useState } from "react";
import api from "../api";
import Message from "../components/Message";

const Login = () => {
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

            // Tokenları kaydet
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            // Sayfayı yenile veya yönlendir (App.tsx state'i algılayacak)
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
                    <Message
                        type={messageData.type}
                        title={messageData.title}
                        message={messageData.message}
                        onClose={() => setMessageData(null)}
                    />
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Kullanıcı Adı
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
                            placeholder="admin"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Şifre
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
                            placeholder="******"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transiton duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

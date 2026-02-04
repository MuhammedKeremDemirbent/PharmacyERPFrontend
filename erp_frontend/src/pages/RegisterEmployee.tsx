import { useState } from 'react'
import api from '../api'
import Alert from '../components/molecules/Alert'
import Button from '../components/atoms/Button'
import FormField from '../components/molecules/FormField'
import Input from '../components/atoms/Input'

const RegisterEmployee = () => {
    // PIN Koruması State'leri
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [pin, setPin] = useState('')
    const [pinError, setPinError] = useState('')
    const CORRECT_PIN = "9876" // Şifre

    // Mevcut Form State'leri
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    })
    const [messageData, setMessageData] = useState<{ type: 'success' | 'error' | 'warning', title?: string, message: string } | null>(null)
    const [loading, setLoading] = useState(false)

    // PIN Kontrolü
    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (pin === CORRECT_PIN) {
            setIsAuthenticated(true)
            setPinError('')
        } else {
            setPinError('Hatalı şifre!')
            setPin('')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await api.post('/accounts/register-employee/', formData)
            setMessageData({
                type: 'success',
                title: 'Personel Oluşturuldu',
                message: response.data.message
            });
            // Formu temizle
            setFormData({ username: '', first_name: '', last_name: '', email: '', phone: '' })
        } catch (error: any) {
            console.error('Kayıt hatası:', error)
            const status = error.response?.status
            if (status === 403) {
                setMessageData({
                    type: 'error',
                    title: 'Yetkisiz İşlem',
                    message: 'Bu işlemi yapmaya yetkiniz yok. Sadece Yöneticiler personel ekleyebilir.'
                })
            } else {
                const msg = error.response?.data?.message || JSON.stringify(error.response?.data) || "Bilinmeyen hata"
                setMessageData({
                    type: 'error',
                    title: 'Kayıt Başarısız',
                    message: msg
                })
            }
        } finally {
            setLoading(false)
        }
    }

    // GİRİŞ EKRANI
    if (!isAuthenticated) {
        return (
            <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full text-center border border-gray-200">
                    <div className="mb-4 text-purple-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Yönetici Erişimi</h2>
                    <p className="text-gray-600 mb-6 text-sm">Personel kaydı oluşturmak için lütfen yönetici erişim kodunu giriniz.</p>

                    <form onSubmit={handlePinSubmit}>
                        <div className="mb-4">
                            <Input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="text-center text-lg tracking-widest"
                                placeholder="****"
                                maxLength={4}
                                autoFocus
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                            Giriş Yap
                        </Button>
                    </form>
                    {pinError && <p className="text-red-500 mt-3 text-sm font-bold">{pinError}</p>}
                </div>
            </div>
        )
    }

    // KİLİT AÇILINCA FORM GÖSTER
    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-purple-600">Yeni Personel Kaydı</h1>
                <Button
                    variant="ghost"
                    onClick={() => setIsAuthenticated(false)}
                    className="text-gray-500 hover:text-red-500 underline"
                >
                    🔒 Kilitle
                </Button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <p className="mb-6 text-gray-600">
                    Yeni personel için bilgileri girin. Sistem otomatik olarak şifre oluşturup personelin e-posta adresine gönderecektir.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                            label="Ad"
                            value={formData.first_name}
                            onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                            required
                        />
                        <FormField
                            label="Soyad"
                            value={formData.last_name}
                            onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                            required
                        />
                    </div>

                    <FormField
                        label="Kullanıcı Adı"
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                        required
                        className="mb-4"
                    />

                    <FormField
                        label="E-Posta"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="mb-4"
                    />

                    <FormField
                        label="Telefon"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="mb-6"
                    />

                    <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                        Personel Oluştur ve Mail Gönder
                    </Button>
                </form>
            </div>

            {messageData && (
                <Alert
                    type={messageData.type}
                    title={messageData.title}
                    message={messageData.message}
                    onClose={() => setMessageData(null)}
                />
            )}
        </div>
    )
}

export default RegisterEmployee

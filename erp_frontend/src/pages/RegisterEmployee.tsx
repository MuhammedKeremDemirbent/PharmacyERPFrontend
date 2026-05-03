import { useState } from 'react'
import { axiosService as api } from '../services/httpRequest'
import Alert from '../components/molecules/Alert'
import Button from '../components/atoms/Button'
import FormField from '../components/molecules/FormField'
import Input from '../components/atoms/Input'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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
                <Card className="w-full max-w-sm text-center border-none shadow-lg">
                    <CardHeader>
                        <div className="mb-4 text-primary flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <CardTitle className="text-xl font-bold">Yönetici Erişimi</CardTitle>
                        <CardDescription>Personel kaydı oluşturmak için lütfen yönetici erişim kodunu giriniz.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePinSubmit} className="space-y-4">
                            <Input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="text-center text-lg tracking-widest"
                                placeholder="****"
                                maxLength={4}
                                autoFocus
                            />
                            <Button
                                type="submit"
                                className="w-full"
                            >
                                Giriş Yap
                            </Button>
                        </form>
                        {pinError && <p className="text-destructive mt-3 text-sm font-bold">{pinError}</p>}
                    </CardContent>
                </Card>
            </div>
        )
    }

    // KİLİT AÇILINCA FORM GÖSTER
    return (
        <div className="container mx-auto p-4 max-w-2xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-primary">Yeni Personel Kaydı</h1>
                <Button
                    variant="ghost"
                    onClick={() => setIsAuthenticated(false)}
                    className="text-muted-foreground hover:text-destructive underline"
                >
                    🔒 Kilitle
                </Button>
            </div>

            <Card className="shadow-lg border-none">
                <CardHeader>
                    <CardDescription>
                        Yeni personel için bilgileri girin. Sistem otomatik olarak şifre oluşturup personelin e-posta adresine gönderecektir.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        />

                        <FormField
                            label="E-Posta"
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <FormField
                            label="Telefon"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />

                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full bg-primary hover:bg-primary/90"
                        >
                            Personel Oluştur ve Mail Gönder
                        </Button>
                    </form>
                </CardContent>
            </Card>

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

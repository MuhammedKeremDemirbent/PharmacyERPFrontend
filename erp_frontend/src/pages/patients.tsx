import { useState } from 'react'
import Button from '../components/atoms/Button'
import Input from '../components/atoms/Input'
import PatientForm from '../components/organisms/forms/PatientForm'
import Alert from '../components/molecules/Alert'
import { usePatients } from '../hooks/usePatients'
import type { Patient } from '../types'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const Patients = () => {
    // HOOKS
    const { patients, error: patientError, fetchPatients, addPatient } = usePatients()

    // LOCAL STATE
    const [showModal, setShowModal] = useState(false)
    const [messageData, setMessageData] = useState<{ type: 'success' | 'error' | 'warning', title?: string, message: string } | null>(null)

    // SECURITY STATE
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [pin, setPin] = useState('')
    const CORRECT_PIN = "1234"

    // HANDLERS
    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (pin === CORRECT_PIN) {
            setIsAuthenticated(true)
            fetchPatients() // Giriş yapınca verileri çek
        } else {
            setMessageData({ type: 'error', message: 'Hatalı şifre!' })
            setPin('')
        }
    }

    const handleSave = async (formData: any) => {
        const result = await addPatient(formData)
        if (result.success) {
            setMessageData({ type: 'success', message: 'Hasta başarıyla eklendi!' })
            setShowModal(false)
        } else {
            setMessageData({ type: 'error', message: result.error || 'Kayıt sırasında hata oluştu.' })
        }
    }

    // GİRİŞ EKRANI
    if (!isAuthenticated) {
        return (
            <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
                <Card className="w-full max-w-sm text-center border-none shadow-lg">
                    <CardHeader>
                        <div className="mb-4 text-destructive flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <CardTitle className="text-xl font-bold">Güvenli Erişim</CardTitle>
                        <CardDescription>Hasta verilerini görüntülemek için lütfen erişim kodunu giriniz.</CardDescription>
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
                        {messageData && <p className="text-destructive mt-3 text-sm font-bold">{messageData.message}</p>}
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            {messageData && (
                <Alert
                    type={messageData.type}
                    title={messageData.title}
                    message={messageData.message}
                    onClose={() => setMessageData(null)}
                />
            )}

            {patientError && <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-4">{patientError}</div>}

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Hasta Listesi</h1>
                <div className="flex gap-2 items-center">
                    <Dialog open={showModal} onOpenChange={setShowModal}>
                        <DialogTrigger asChild>
                            <Button>
                                + Yeni Hasta
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Yeni Hasta Ekle</DialogTitle>
                            </DialogHeader>
                            <PatientForm
                                onSubmit={handleSave}
                                onCancel={() => setShowModal(false)}
                            />
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant="ghost"
                        onClick={() => setIsAuthenticated(false)}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        Güvenli Çıkış
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-card text-card-foreground shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Hasta ID</TableHead>
                            <TableHead>Adı Soyadı</TableHead>
                            <TableHead>Telefon</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Adres</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {patients.length > 0 ? (
                            patients.map((patient: Patient) => (
                                <TableRow key={patient.id}>
                                    <TableCell className="font-medium">#{patient.id}</TableCell>
                                    <TableCell className="font-medium">{patient.first_name} {patient.last_name}</TableCell>
                                    <TableCell>{patient.phone_number}</TableCell>
                                    <TableCell>{patient.email || '-'}</TableCell>
                                    <TableCell>{patient.address}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    {patientError ? 'Veri yüklenemedi.' : 'Kayıtlı hasta bulunamadı.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Patients

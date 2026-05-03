import { useState } from 'react'
import Button from '../components/atoms/Button'
import Input from '../components/atoms/Input'
import PatientForm from '../components/organisms/forms/PatientForm'
import Alert from '../components/molecules/Alert'
import {
    useLazyGetPatientsQuery,
    useCreatePatientMutation,
    useUploadPatientExcelMutation,
    useUpdatePatientMutation,
    useDeletePatientMutation
} from '../store/api/patientApi'
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
import { Edit2, Trash2 } from 'lucide-react'

const Patients = () => {
    // RTK QUERY HOOKS
    const [triggerGetPatients, { data: patients = [], isLoading, error: patientError }] = useLazyGetPatientsQuery() //LazyQUery kısmı burada
    const [createPatient] = useCreatePatientMutation()
    const [uploadPatientExcel, { isLoading: isUploading }] = useUploadPatientExcelMutation()
    const [updatePatient] = useUpdatePatientMutation()
    const [deletePatient] = useDeletePatientMutation()

    // LOCAL STATE
    const [showModal, setShowModal] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>(undefined)
    const [messageData, setMessageData] = useState<{ type: 'success' | 'error' | 'warning', title?: string, message: string } | null>(null)

    // SECURITY STATE
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [pin, setPin] = useState('')
    const CORRECT_PIN = "1234"  // ŞİFRE

    // HANDLERS
    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (pin === CORRECT_PIN) {
            setIsAuthenticated(true)
            triggerGetPatients()
        } else {
            setMessageData({ type: 'error', message: 'Hatalı şifre!' })
            setPin('')
        }
    }

    const handleSave = async (formData: any) => {
        try {
            if (selectedPatient) {
                await updatePatient({ id: selectedPatient.id, data: formData }).unwrap()
                setMessageData({ type: 'success', message: 'Hasta başarıyla güncellendi!' })
            } else {
                await createPatient(formData).unwrap()
                setMessageData({ type: 'success', message: 'Hasta başarıyla eklendi!' })
            }
            setShowModal(false)
            setSelectedPatient(undefined)
        } catch (err: any) {
            const msg = err.data?.detail || 'Kayıt sırasında hata oluştu.'
            setMessageData({ type: 'error', message: msg })
        }
    }

    const handleDelete = async (id: number) => {
        if (window.confirm('Bu hastayı silmek istediğinize emin misiniz?')) {
            try {
                await deletePatient(id).unwrap()
                setMessageData({ type: 'success', message: 'Hasta başarıyla silindi!' })
                triggerGetPatients()
            } catch (err: any) {
                setMessageData({ type: 'error', message: 'Silme işlemi sırasında hata oluştu.' })
            }
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await uploadPatientExcel(formData).unwrap()
            setMessageData({ type: 'success', message: res.message || 'Excel başarıyla yüklendi!' })
            triggerGetPatients() // Listeyi güncelle
        } catch (err: any) {
            const msg = err.data?.error || 'Excel yüklenirken bir hata oluştu.'
            setMessageData({ type: 'error', message: msg })
        } finally {
            // Aynı dosyayı tekrar seçebilmek için inputu sıfırla
            if (e.target) e.target.value = ''
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

            {patientError && (
                <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-4" role="alert">
                    <p className="font-semibold">Hastalar yüklenirken bir hata oluştu.</p>
                    <p className="text-sm">
                        {typeof (patientError as any).data === 'string'
                            ? (patientError as any).data
                            : JSON.stringify((patientError as any).data || (patientError as any).error)}
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Hasta Listesi</h1>
                <div className="flex gap-2 items-center">
                    <div>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            id="excel-upload"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                        <Button 
                            variant="secondary" 
                            onClick={() => document.getElementById('excel-upload')?.click()}
                            disabled={isUploading}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none"
                        >
                            {isUploading ? 'İşleniyor...' : 'Excel Yükle'}
                        </Button>
                    </div>

                    <Dialog open={showModal} onOpenChange={setShowModal}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setSelectedPatient(undefined)}>
                                + Yeni Hasta
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{selectedPatient ? 'Hastayı Düzenle' : 'Yeni Hasta Ekle'}</DialogTitle>
                            </DialogHeader>
                            <PatientForm
                                initialData={selectedPatient}
                                onSubmit={handleSave}
                                onCancel={() => {
                                    setShowModal(false)
                                    setSelectedPatient(undefined)
                                }}
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
                            <TableHead>TC Kimlik</TableHead>
                            <TableHead>Adı Soyadı</TableHead>
                            <TableHead>Telefon</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Adres</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">Yükleniyor...</TableCell>
                            </TableRow>
                        ) : patients.length > 0 ? (
                            patients.map((patient: Patient) => (
                                <TableRow key={patient.id}>
                                    <TableCell className="font-medium">#{patient.id}</TableCell>
                                    <TableCell>{patient.tc || '-'}</TableCell>
                                    <TableCell className="font-medium">{patient.first_name} {patient.last_name}</TableCell>
                                    <TableCell>{patient.phone_number}</TableCell>
                                    <TableCell>{patient.email || '-'}</TableCell>
                                    <TableCell>{patient.address}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                className="h-9 w-9 rounded-xl text-primary hover:bg-primary/10 transition-all"
                                                onClick={() => {
                                                    setSelectedPatient(patient)
                                                    setShowModal(true)
                                                }}
                                                title="Düzenle"
                                            >
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
                                                onClick={() => handleDelete(patient.id)}
                                                title="Sil"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Kayıtlı hasta bulunamadı.
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

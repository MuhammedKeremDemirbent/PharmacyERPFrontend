import { useState } from 'react'
import Alert from '../components/molecules/Alert'
import Button from '../components/atoms/Button'
import MedicineForm from '../components/organisms/forms/MedicineForm'
import { useMedicines } from '../hooks/useMedicines'
import { useSuppliers } from '../hooks/useSuppliers'
import type { Medicine } from '../types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const Inventory = () => {
    // HOOKS
    const { medicines, error: medError, deleteMedicine, addMedicine, updateMedicine } = useMedicines()
    const { suppliers } = useSuppliers() // Tedarikçiler form için lazım

    // LOCAL STATE
    const [showModal, setShowModal] = useState(false)
    const [editingMed, setEditingMed] = useState<Partial<Medicine> | undefined>(undefined)
    const [messageData, setMessageData] = useState<{ type: 'success' | 'error' | 'warning', title?: string, message: string } | null>(null)

    // HANDLERS
    const handleSave = async (formData: any) => {
        let result;
        if (editingMed && editingMed.id) {
            result = await updateMedicine(editingMed.id, formData);
        } else {
            result = await addMedicine(formData);
        }

        if (result.success) {
            setMessageData({
                type: 'success',
                message: editingMed ? 'İlaç başarıyla güncellendi!' : 'İlaç başarıyla eklendi!'
            })
            setShowModal(false)
        } else {
            setMessageData({ type: 'error', message: result.error || 'İşlem başarısız.' })
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bu ilacı silmek istediğinize emin misiniz?')) return
        const result = await deleteMedicine(id)
        if (result.success) {
            setMessageData({ type: 'success', message: 'İlaç başarıyla silindi.' })
        } else {
            setMessageData({ type: 'error', message: result.error || 'Silme işlemi başarısız.' })
        }
    }

    const openEdit = (med: Medicine) => {
        setEditingMed(med)
        setShowModal(true)
    }

    const openNew = () => {
        setEditingMed(undefined)
        setShowModal(true)
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

            {medError && <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-4" role="alert">{medError}</div>}

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Eczane Stok Listesi</h1>
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogTrigger asChild>
                        <Button onClick={openNew}>
                            + İlaç Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingMed ? 'İlaç Düzenle' : 'Yeni İlaç Ekle'}</DialogTitle>
                        </DialogHeader>
                        <MedicineForm
                            initialData={editingMed}
                            suppliers={suppliers}
                            onSubmit={handleSave}
                            onCancel={() => setShowModal(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-card text-card-foreground shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>İlaç Adı</TableHead>
                            <TableHead>Form</TableHead>
                            <TableHead>SKT</TableHead>
                            <TableHead>Stok</TableHead>
                            <TableHead>Fiyat</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {medicines.map((med) => (
                            <TableRow key={med.id}>
                                <TableCell className="font-medium">{med.name}</TableCell>
                                <TableCell>{med.form_type}</TableCell>
                                <TableCell>{med.expiry_date}</TableCell>
                                <TableCell>
                                    <Badge variant={med.how_many < 10 ? "destructive" : "secondary"} className={med.how_many >= 10 ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                                        {med.how_many}
                                    </Badge>
                                </TableCell>
                                <TableCell>₺{med.price}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => { setEditingMed(med); setShowModal(true); }}>
                                        Düzenle
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(med.id)}>
                                        Sil
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Inventory

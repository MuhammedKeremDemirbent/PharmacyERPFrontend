import { useState } from 'react'
import Alert from '../components/molecules/Alert'
import Button from '../components/atoms/Button'
import MedicineForm from '../components/organisms/forms/MedicineForm'
import {
    useGetMedicinesQuery,
    useCreateMedicineMutation,
    useUpdateMedicineMutation,
    useDeleteMedicineMutation,
    useUploadMedicineExcelMutation
} from '../store/api/medicineApi'
import { useLazyGetSuppliersQuery } from '../store/api/supplierApi'
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
import { Plus, FileUp, Edit2, Trash2, Search, Package, Calendar, Tag } from 'lucide-react'

const Inventory = () => {
    // RTK QUERY HOOKS
    const { data: medicines = [], isLoading: isMedicinesLoading, error: medicinesError } = useGetMedicinesQuery()
    const [triggerGetSuppliers, { data: suppliers = [], isLoading: isSuppliersLoading }] = useLazyGetSuppliersQuery()

    const [createMedicine, { isLoading: isAdding }] = useCreateMedicineMutation()
    const [updateMedicine, { isLoading: isUpdating }] = useUpdateMedicineMutation()
    const [deleteMedicine, { isLoading: isDeleting }] = useDeleteMedicineMutation()
    const [uploadMedicineExcel, { isLoading: isUploading }] = useUploadMedicineExcelMutation()

    // LOCAL STATE
    const [showModal, setShowModal] = useState(false)
    const [editingMed, setEditingMed] = useState<Partial<Medicine> | undefined>(undefined)
    const [messageData, setMessageData] = useState<{ type: 'success' | 'error' | 'warning', title?: string, message: string } | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    // HANDLERS
    const handleSave = async (formData: any) => {
        try {
            if (editingMed && editingMed.id) {
                await updateMedicine({ id: editingMed.id, data: formData }).unwrap();
                setMessageData({ type: 'success', message: 'İlaç başarıyla güncellendi!' })
            } else {
                await createMedicine(formData).unwrap();
                setMessageData({ type: 'success', message: 'İlaç başarıyla eklendi!' })
            }
            setShowModal(false)
        } catch (err: any) {
            setMessageData({ type: 'error', message: err.data?.detail || 'İşlem başarısız.' })
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bu ilacı silmek istediğinize emin misiniz?')) return
        try {
            await deleteMedicine(id).unwrap()
            setMessageData({ type: 'success', message: 'İlaç başarıyla silindi.' })
        } catch (err: any) {
            setMessageData({ type: 'error', message: err.data?.detail || 'Silme işlemi başarısız.' })
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const formData = new FormData()
        formData.append('file', file)
        try {
            const res = await uploadMedicineExcel(formData).unwrap()
            setMessageData({ type: 'success', message: res.message || 'Excel başarıyla yüklendi!' })
        } catch (err: any) {
            setMessageData({ type: 'error', message: err.data?.error || 'Excel yüklenirken hata oluştu.' })
        } finally {
            if (e.target) e.target.value = ''
        }
    }

    const openEdit = (med: Medicine) => {
        setEditingMed(med)
        setShowModal(true)
        triggerGetSuppliers()
    }

    const openNew = () => {
        setEditingMed(undefined)
        setShowModal(true)
        triggerGetSuppliers()
    }

    const filteredMedicines = medicines.filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        med.barcode?.includes(searchTerm)
    )

    const isLoading = isMedicinesLoading || isAdding || isUpdating || isDeleting || isSuppliersLoading || isUploading;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {messageData && (
                <Alert
                    type={messageData.type}
                    title={messageData.title}
                    message={messageData.message}
                    onClose={() => setMessageData(null)}
                />
            )}

            {medicinesError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl mb-4" role="alert">
                    <p className="font-bold flex items-center gap-2">
                        <span>⚠️</span> İlaçlar yüklenirken bir hata oluştu.
                    </p>
                    <p className="text-xs opacity-80 mt-1">
                        {typeof (medicinesError as any).data === 'string'
                            ? (medicinesError as any).data
                            : JSON.stringify((medicinesError as any).data || (medicinesError as any).error)}
                    </p>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-glow">Stok Yönetimi</h1>
                    <p className="text-muted-foreground mt-1">Eczane envanterini takip edin ve güncelleyin.</p>
                </div>
                
                <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="İlaç veya barkod ara..."
                            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            id="medicine-excel-upload"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                        <Button
                            variant="secondary"
                            onClick={() => document.getElementById('medicine-excel-upload')?.click()}
                            disabled={isUploading}
                            className="flex items-center gap-2 border-white/5 bg-secondary/80 hover:bg-secondary"
                        >
                            <FileUp size={18} />
                            <span>Excel Yükle</span>
                        </Button>
                    </div>

                    <Dialog open={showModal} onOpenChange={setShowModal}>
                        <DialogTrigger asChild>
                            <Button onClick={openNew} disabled={isLoading} className="flex items-center gap-2 shadow-lg shadow-primary/20">
                                <Plus size={18} />
                                <span>{isLoading ? 'İşleniyor...' : 'Yeni İlaç'}</span>
                            </Button>
                        </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] glass border-white/10">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">{editingMed ? 'İlaç Düzenle' : 'Yeni İlaç Ekle'}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                            <MedicineForm
                                initialData={editingMed}
                                suppliers={suppliers}
                                onSubmit={handleSave}
                                onCancel={() => setShowModal(false)}
                            />
                        </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl card-hover">
                <Table>
                    <TableHeader className="bg-secondary/30">
                        <TableRow className="hover:bg-transparent border-white/5">
                            <TableHead className="py-4"><div className="flex items-center gap-2"><Tag size={14}/> Barkod</div></TableHead>
                            <TableHead><div className="flex items-center gap-2"><Package size={14}/> İlaç Adı</div></TableHead>
                            <TableHead>Form</TableHead>
                            <TableHead><div className="flex items-center gap-2"><Calendar size={14}/> SKT</div></TableHead>
                            <TableHead>Stok</TableHead>
                            <TableHead>Fiyat</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isMedicinesLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-48 opacity-50">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                        <span>Veriler yükleniyor...</span>
                                    </div>
                                </TableCell>
                        </TableRow>
                        ) : filteredMedicines.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-48 opacity-50">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Search size={32} />
                                        <span>Kayıtlı ilaç bulunamadı.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMedicines.map((med) => (
                                <TableRow key={med.id} className="border-white/5 hover:bg-primary/5 transition-colors group">
                                    <TableCell className="font-mono text-xs opacity-70">{med.barcode || '-'}</TableCell>
                                    <TableCell className="font-bold text-slate-200">{med.name}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 rounded-md bg-secondary/50 text-[10px] font-bold uppercase tracking-wider border border-white/5">
                                            {med.form_type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm opacity-80">{med.expiry_date}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={med.how_many < 10 ? "destructive" : "secondary"} 
                                            className={`rounded-full px-3 ${med.how_many >= 10 ? "bg-primary/20 text-primary border-primary/20" : "bg-destructive/20 text-destructive border-destructive/20"}`}
                                        >
                                            {med.how_many} Adet
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-primary">₺{med.price}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-9 w-9 rounded-xl hover:bg-primary/20 hover:text-primary transition-all" 
                                            onClick={() => openEdit(med)}
                                        >
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-9 w-9 rounded-xl hover:bg-destructive/20 hover:text-destructive transition-all" 
                                            onClick={() => handleDelete(med.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <div className="flex justify-between items-center text-xs text-muted-foreground px-2">
                <p>Toplam {filteredMedicines.length} kayıt listelendi.</p>
                <p className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Sistem Aktif
                </p>
            </div>
        </div>
    )
}

export default Inventory


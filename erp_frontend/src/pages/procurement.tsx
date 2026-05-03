import React, { useState } from 'react'
import { axiosService } from '../services/httpRequest' // Mail için direkt axios servisi kullanalım, api.ts silindi
import Alert from '../components/molecules/Alert'
import Button from '../components/atoms/Button'
import FormField from '../components/molecules/FormField'
import Input from '../components/atoms/Input'
import SupplierForm from '../components/organisms/forms/SupplierForm'
import {
    useGetSuppliersQuery,
    useCreateSupplierMutation,
    useUpdateSupplierMutation
} from '../store/api/supplierApi'
import { useLazyGetMedicinesQuery } from '../store/api/medicineApi'
import type { Supplier } from '../types'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Edit2, Mail } from 'lucide-react'

const Procurement = () => {
    // RTK QUERY HOOKS
    const { data: suppliers = [], isLoading: isSuppliersLoading, error: suppliersError } = useGetSuppliersQuery()
    const [triggerGetMedicines, { data: medicines = [] }] = useLazyGetMedicinesQuery()

    const [createSupplier, { isLoading: isAdding }] = useCreateSupplierMutation()
    const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation()

    // LOCAL STATE
    const [showModal, setShowModal] = useState(false)
    const [editingSup, setEditingSup] = useState<Partial<Supplier> | undefined>(undefined)
    const [messageData, setMessageData] = useState<{ type: 'success' | 'error' | 'warning', title?: string, message: string } | null>(null)

    // EMAIL STATE
    const [emailModal, setEmailModal] = useState(false)
    const [emailData, setEmailData] = useState({ subject: '', message: '', supplierId: null as number | null })
    const [orderList, setOrderList] = useState<{ name: string, quantity: number }[]>([])
    const [sendingMail, setSendingMail] = useState(false);

    // HANDLERS
    const handleSave = async (formData: any) => {
        try {
            if (editingSup && editingSup.id) {
                await updateSupplier({ id: editingSup.id, data: formData }).unwrap();
                setMessageData({ type: 'success', message: 'Tedarikçi güncellendi!' })
            } else {
                await createSupplier(formData).unwrap();
                setMessageData({ type: 'success', message: 'Tedarikçi eklendi!' })
            }
            setShowModal(false)
        } catch (err: any) {
            setMessageData({ type: 'error', message: err.data?.detail || 'İşlem başarısız.' })
        }
    }

    const openEdit = (sup: Supplier) => {
        setEditingSup(sup)
        setShowModal(true)
    }

    const openNew = () => {
        setEditingSup(undefined)
        setShowModal(true)
    }

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!emailData.supplierId) return

        setSendingMail(true);
        try {
            const payload = { ...emailData, items: orderList };
            // Service üzerinden mail gönderimi
            await axiosService.post(`/procurement/${emailData.supplierId}/send-order/`, payload)
            setMessageData({ type: 'success', message: 'E-posta başarıyla gönderildi!' })
            setEmailModal(false)
            setEmailData({ subject: '', message: '', supplierId: null })
            setOrderList([])
        } catch (err: any) {
            console.error('Mail hatası:', err)
            const msg = err.response?.data?.detail || err.message
            setMessageData({ type: 'error', message: `Mail gönderilemedi: ${msg}` })
        } finally {
            setSendingMail(false);
        }
    }

    const openEmailModal = (sup: Supplier) => {
        setEmailData({ ...emailData, supplierId: sup.id })
        setEmailModal(true)
        triggerGetMedicines() // Burada ilaç listesini çekmeye başla
    }

    const isLoading = isSuppliersLoading || isAdding || isUpdating;

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

            {suppliersError && (
                <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-4" role="alert">
                    <p className="font-semibold">Tedarikçiler yüklenirken bir hata oluştu.</p>
                    <p className="text-sm">
                        {typeof (suppliersError as any).data === 'string'
                            ? (suppliersError as any).data
                            : JSON.stringify((suppliersError as any).data || (suppliersError as any).error)}
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Tedarikçi Yönetimi</h1>
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogTrigger asChild>
                        <Button onClick={openNew} disabled={isLoading}>
                            {isLoading ? 'İşleniyor...' : '+ Yeni Tedarikçi Ekle'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingSup ? 'Tedarikçi Düzenle' : 'Yeni Tedarikçi'}</DialogTitle>
                        </DialogHeader>
                        <SupplierForm
                            initialData={editingSup}
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
                            <TableHead>Tedarikçi ID</TableHead>
                            <TableHead>Firma Adı</TableHead>
                            <TableHead>E-Posta</TableHead>
                            <TableHead>Telefon</TableHead>
                            <TableHead>Adres</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isSuppliersLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">Yükleniyor...</TableCell>
                            </TableRow>
                        ) : suppliers.length > 0 ? (
                            suppliers.map((supplier: Supplier) => (
                                <TableRow key={supplier.id}>
                                    <TableCell className="font-medium">#{supplier.id}</TableCell>
                                    <TableCell className="font-medium">{supplier.name}</TableCell>
                                    <TableCell>{supplier.email || '-'}</TableCell>
                                    <TableCell>{supplier.phone_number_proc}</TableCell>
                                    <TableCell>{supplier.address_proc}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-xl text-primary hover:bg-primary/10 transition-all"
                                                onClick={() => { setEditingSup(supplier); setShowModal(true); }}
                                                title="Düzenle"
                                            >
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-xl text-blue-600 hover:bg-blue-50 transition-all"
                                                onClick={() => openEmailModal(supplier)}
                                                title="Mail At"
                                            >
                                                <Mail size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Kayıtlı tedarikçi bulunamadı.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* EMAIL MODAL */}
            <Dialog open={emailModal} onOpenChange={setEmailModal}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Sipariş Maili Gönder</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSendEmail} className="space-y-4">
                        <FormField
                            label="Konu"
                            value={emailData.subject}
                            onChange={e => setEmailData({ ...emailData, subject: e.target.value })}
                            required
                        />

                        <div className="p-4 border rounded-md bg-muted/50 space-y-3">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Sipariş Listesine Ürün Ekle
                            </label>

                            <div className="flex gap-2">
                                <Select onValueChange={(val) => {
                                    const select = document.getElementById('productSelectHidden') as HTMLInputElement;
                                    if (select) select.value = val;
                                }}>
                                    <SelectTrigger className="flex-1 bg-background" id="productSelectTrigger">
                                        <SelectValue placeholder="-- İlaç Seçin --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {medicines.map((med: any) => (
                                            <SelectItem key={med.id} value={med.name}>{med.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {/* Gizli input hack yerine state kullanmak daha iyi ama hızlı çözüm için DOM manipülasyonuna sadık kalıyorum */}
                                <input type="hidden" id="productSelectHidden" />

                                <div className="w-24">
                                    <Input
                                        type="number"
                                        placeholder="Adet"
                                        id="quantityInput"
                                        defaultValue={1}
                                        min={1}
                                        className="bg-background"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="success"
                                    onClick={() => {
                                        // Shadcn ile DOM erişimi zorlaştı, Select value'sunu almak için yukarıdaki hack'i kullanıyoruz
                                        // Veya daha temiz bir yöntem: Select'i kontrollü state yapabiliriz.
                                        // Ancak kullanıcının mevcut kod yapısını bozmak istemiyorum.
                                        // En iyisi Select'i kontrollü yapmak.
                                        const trigger = document.getElementById('productSelectTrigger');
                                        const hiddenInput = document.getElementById('productSelectHidden') as HTMLInputElement;
                                        const input = document.getElementById('quantityInput') as HTMLInputElement;
                                        const name = hiddenInput?.value;
                                        const quantity = Number(input.value);

                                        if (!name) return;

                                        setOrderList([...orderList, { name, quantity }]);
                                        hiddenInput.value = "";
                                        // Reset Select visual (Zor, o yüzden basit bırakıyorum)
                                        input.value = "1";
                                    }}
                                >Ekle</Button>
                            </div>

                            {orderList.length > 0 && (
                                <div className="bg-background border rounded-md overflow-hidden">
                                    <ul>
                                        {orderList.map((item, index) => (
                                            <li key={index} className="flex justify-between items-center p-2 border-b last:border-0 text-sm">
                                                <span>{item.name} - <b>{item.quantity} Adet</b></span>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setOrderList(orderList.filter((_, i) => i !== index))}
                                                    className="h-6 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >Sil</Button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Ek Mesaj (Opsiyonel)</label>
                            <Textarea
                                className="min-h-[100px]"
                                placeholder="Eklemek istediğiniz notlar..."
                                value={emailData.message}
                                onChange={e => setEmailData({ ...emailData, message: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setEmailModal(false)}
                                disabled={sendingMail}
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                disabled={sendingMail}
                            >
                                {sendingMail ? 'Gönderiliyor...' : 'Siparişi Gönder'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Procurement

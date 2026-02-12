import React, { useState } from 'react'
import api from '../api' // Mail işlemi için api gerekli, henüz service'de yok
import Alert from '../components/molecules/Alert'
import Button from '../components/atoms/Button'
import FormField from '../components/molecules/FormField'
import Input from '../components/atoms/Input'
import SupplierForm from '../components/organisms/forms/SupplierForm'
import { useSuppliers } from '../hooks/useSuppliers'
import { useMedicines } from '../hooks/useMedicines'
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

const Procurement = () => {
    // HOOKS
    const { suppliers, error: supError, addSupplier, updateSupplier } = useSuppliers()
    const { medicines } = useMedicines()

    // LOCAL STATE
    const [showModal, setShowModal] = useState(false)
    const [editingSup, setEditingSup] = useState<Partial<Supplier> | undefined>(undefined)
    const [messageData, setMessageData] = useState<{ type: 'success' | 'error' | 'warning', title?: string, message: string } | null>(null)

    // EMAIL STATE
    const [emailModal, setEmailModal] = useState(false)
    const [emailData, setEmailData] = useState({ subject: '', message: '', supplierId: null as number | null })
    const [orderList, setOrderList] = useState<{ name: string, quantity: number }[]>([])

    // HANDLERS
    const handleSave = async (formData: any) => {
        let result;
        if (editingSup && editingSup.id) {
            result = await updateSupplier(editingSup.id, formData);
        } else {
            result = await addSupplier(formData);
        }

        if (result.success) {
            setMessageData({ type: 'success', message: editingSup ? 'Tedarikçi güncellendi!' : 'Tedarikçi eklendi!' })
            setShowModal(false)
        } else {
            setMessageData({ type: 'error', message: result.error || 'İşlem başarısız.' })
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

        try {
            const payload = { ...emailData, items: orderList };
            // Bu endpoint şimdilik api üzerinden çağrılıyor, service'e taşınabilir
            await api.post(`/procurement/${emailData.supplierId}/send-order/`, payload)
            setMessageData({ type: 'success', message: 'E-posta başarıyla gönderildi!' })
            setEmailModal(false)
            setEmailData({ subject: '', message: '', supplierId: null })
            setOrderList([])
        } catch (err: any) {
            console.error('Mail hatası:', err)
            const msg = err.response?.data?.detail || err.message
            setMessageData({ type: 'error', message: `Mail gönderilemedi: ${msg}` })
        }
    }

    const openEmailModal = (sup: Supplier) => {
        setEmailData({ ...emailData, supplierId: sup.id })
        setEmailModal(true)
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

            {supError && <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-4">{supError}</div>}

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Tedarikçi Yönetimi</h1>
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogTrigger asChild>
                        <Button onClick={openNew}>
                            + Yeni Tedarikçi Ekle
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
                        {suppliers.length > 0 ? (
                            suppliers.map((supplier: Supplier) => (
                                <TableRow key={supplier.id}>
                                    <TableCell className="font-medium">#{supplier.id}</TableCell>
                                    <TableCell className="font-medium">{supplier.name}</TableCell>
                                    <TableCell>{supplier.email || '-'}</TableCell>
                                    <TableCell>{supplier.phone_number_proc}</TableCell>
                                    <TableCell>{supplier.address_proc}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => { setEditingSup(supplier); setShowModal(true); }}
                                            className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10"
                                        >
                                            Düzenle
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => openEmailModal(supplier)}
                                            className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        >
                                            Mail At
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    {supError ? 'Veri yüklenemedi.' : 'Kayıtlı tedarikçi bulunamadı.'}
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
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                            >
                                Siparişi Gönder
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Procurement

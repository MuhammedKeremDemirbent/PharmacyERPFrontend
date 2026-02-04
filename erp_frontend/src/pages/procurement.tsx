import { useState } from 'react'
import api from '../api' // Mail işlemi için api gerekli, henüz service'de yok
import Alert from '../components/molecules/Alert'
import Button from '../components/atoms/Button'
import FormField from '../components/molecules/FormField'
import Input from '../components/atoms/Input'
import SupplierForm from '../components/organisms/forms/SupplierForm'
import { useSuppliers } from '../hooks/useSuppliers'
import { useMedicines } from '../hooks/useMedicines'
import type { Supplier } from '../types'

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
        <div className="container mx-auto p-4">
            {messageData && (
                <Alert
                    type={messageData.type}
                    title={messageData.title}
                    message={messageData.message}
                    onClose={() => setMessageData(null)}
                />
            )}

            {supError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{supError}</div>}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-purple-600">Tedarikçi Yönetimi</h1>
                <Button onClick={openNew} className="bg-purple-600 hover:bg-purple-700">
                    + Yeni Tedarikçi Ekle
                </Button>
            </div>

            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Tedarikçi ID</th>
                            <th scope="col" className="px-6 py-3">Firma Adı</th>
                            <th scope="col" className="px-6 py-3">E-Posta</th>
                            <th scope="col" className="px-6 py-3">Telefon</th>
                            <th scope="col" className="px-6 py-3">Adres</th>
                            <th scope="col" className="px-6 py-3">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.length > 0 ? (
                            suppliers.map((supplier: Supplier) => (
                                <tr key={supplier.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        #{supplier.id}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {supplier.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {supplier.email || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {supplier.phone_number_proc}
                                    </td>
                                    <td className="px-6 py-4">
                                        {supplier.address_proc}
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => openEdit(supplier)}
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            Düzenle
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => openEmailModal(supplier)}
                                            className="font-medium text-green-600 hover:underline"
                                        >
                                            Mail At
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center">
                                    {supError ? 'Veri yüklenemedi.' : 'Kayıtlı tedarikçi bulunamadı.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* EMAIL MODAL (Mevcut yapı korundu) */}
            {emailModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Sipariş Maili Gönder</h2>
                        <form onSubmit={handleSendEmail}>
                            <FormField
                                label="Konu"
                                value={emailData.subject}
                                onChange={e => setEmailData({ ...emailData, subject: e.target.value })}
                                required
                                className="mb-4"
                            />

                            <div className="mb-4 border p-3 rounded bg-gray-50">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Sipariş Listesine Ürün Ekle</label>
                                <div className="flex gap-2 mb-2">
                                    <select
                                        className="border p-2 flex-grow rounded text-sm bg-white"
                                        id="productSelect"
                                    >
                                        <option value="">-- İlaç Seçin --</option>
                                        {medicines.map((med: any) => (
                                            <option key={med.id} value={med.name}>{med.name}</option>
                                        ))}
                                    </select>
                                    <div className="w-24">
                                        <Input
                                            type="number"
                                            placeholder="Adet"
                                            id="quantityInput"
                                            defaultValue={1}
                                            min={1}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="success"
                                        onClick={() => {
                                            const select = document.getElementById('productSelect') as HTMLSelectElement;
                                            const input = document.getElementById('quantityInput') as HTMLInputElement;
                                            const name = select.value;
                                            const quantity = Number(input.value);

                                            if (!name) return;

                                            setOrderList([...orderList, { name, quantity }]);
                                            select.value = "";
                                            input.value = "1";
                                        }}
                                    >
                                        Ekle
                                    </Button>
                                </div>

                                {orderList.length > 0 && (
                                    <div className="mt-2 bg-white border rounded">
                                        <ul>
                                            {orderList.map((item, index) => (
                                                <li key={index} className="flex justify-between items-center p-2 border-b last:border-0 text-sm">
                                                    <span>{item.name} - <b>{item.quantity} Adet</b></span>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="danger"
                                                        onClick={() => setOrderList(orderList.filter((_, i) => i !== index))}
                                                        className="px-2 py-1 text-xs"
                                                    >
                                                        Sil
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Ek Mesaj (Opsiyonel)</label>
                                <textarea
                                    className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Eklemek istediğiniz notlar..."
                                    value={emailData.message}
                                    onChange={e => setEmailData({ ...emailData, message: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setEmailModal(false)}
                                >
                                    İptal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                >
                                    Siparişi Gönder
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* SUPPLIER FORM MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {editingSup ? 'Tedarikçi Düzenle' : 'Yeni Tedarikçi'}
                        </h2>
                        <SupplierForm
                            initialData={editingSup}
                            onSubmit={handleSave}
                            onCancel={() => setShowModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Procurement

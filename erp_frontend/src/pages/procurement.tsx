import { useEffect, useState } from 'react'
import api from '../api'
import Message from '../components/Message'

const Procurement = () => {
    const [suppliers, setSuppliers] = useState([])
    const [error, setError] = useState('')


    const [orderList, setOrderList] = useState<{ name: string, quantity: number }[]>([])
    const [medicines, setMedicines] = useState([])

    useEffect(() => {
        api.get('/procurement/')
            .then(response => {
                console.log('Suppliers fetched:', response.data)
                setSuppliers(response.data)
            })
            .catch(err => {
                console.error('Error fetching suppliers:', err)
                setError('Tedarikçi listesi yüklenirken hata oluştu.')
            })

        // İlaçları çek
        api.get('/inventory/medicines/')
            .then(res => setMedicines(res.data))
            .catch(err => console.error("İlaçlar yüklenemedi", err))
    }, [])
    const [showModal, setShowModal] = useState(false)
    const [newItem, setNewItem] = useState({ name: '', phone_number_proc: '', address_proc: '', email: '' })
    const [editingId, setEditingId] = useState<number | null>(null)
    const [messageData, setMessageData] = useState<{ type: 'success' | 'error' | 'warning', title?: string, message: string } | null>(null)

    // Kaydet
    const handleSaveSupplier = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingId) {
                await api.put(`/procurement/${editingId}/`, newItem)
                setMessageData({ type: 'success', message: 'Tedarikçi güncellendi!' })
            } else {
                await api.post('/procurement/', newItem)
                setMessageData({ type: 'success', message: 'Tedarikçi eklendi!' })
            }
            setShowModal(false)
            resetForm()
            // Refresh list
            const res = await api.get('/procurement/')
            setSuppliers(res.data)
        } catch (err: any) {
            console.error('İşlem hatası:', err)
            const status = err.response?.status
            const msg = err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message
            setError(`Hata (${status}): ${msg}`)
            setError(`Hata (${status}): ${msg}`)
            setMessageData({ type: 'error', title: 'İşlem Başarısız!', message: `Hata Kodu: ${status}\nMesaj: ${msg}` })
        }
    }

    const resetForm = () => {
        setNewItem({ name: '', phone_number_proc: '', address_proc: '', email: '' })
        setEditingId(null)
    }

    const openEditModal = (supplier: any) => {
        setEditingId(supplier.id)
        setNewItem({
            name: supplier.name,
            phone_number_proc: supplier.phone_number_proc,
            address_proc: supplier.address_proc,
            email: supplier.email || ''
        })
        setShowModal(true)
    }

    const [emailModal, setEmailModal] = useState(false)
    const [emailData, setEmailData] = useState({ subject: '', message: '', supplierId: null as number | null })

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!emailData.supplierId) return

        try {
            const payload = { ...emailData, items: orderList };
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

    const openEmailModal = (supplier: any) => {
        setEmailData({ ...emailData, supplierId: supplier.id })
        setEmailModal(true)
    }

    const openNewModal = () => {
        resetForm()
        setShowModal(true)
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-purple-600">Tedarikçi Yönetimi</h1>
                <button
                    onClick={openNewModal}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow-lg flex items-center gap-2"
                >
                    <span>+</span> Yeni Tedarikçi Ekle
                </button>
            </div>

            {messageData && (
                <Message
                    type={messageData.type}
                    title={messageData.title}
                    message={messageData.message}
                    onClose={() => setMessageData(null)}
                />
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Hata: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* EMAIL MODAL (SİPARİŞ OLUŞTURMA) */}
            {emailModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Sipariş Maili Gönder</h2>
                        <form onSubmit={handleSendEmail}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Konu</label>
                                <input
                                    type="text"
                                    required
                                    className="border p-2 w-full rounded"
                                    value={emailData.subject}
                                    onChange={e => setEmailData({ ...emailData, subject: e.target.value })}
                                />
                            </div>

                            {/* Ürün Seçme Kısmı */}
                            <div className="mb-4 border p-3 rounded bg-gray-50">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Sipariş Listesine Ürün Ekle</label>
                                <div className="flex gap-2 mb-2">
                                    <select
                                        className="border p-2 flex-1 rounded text-sm"
                                        id="productSelect"
                                    >
                                        <option value="">-- İlaç Seçin --</option>
                                        {medicines.map((med: any) => (
                                            <option key={med.id} value={med.name}>{med.name}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Adet"
                                        className="border p-2 w-20 rounded text-sm"
                                        id="quantityInput"
                                        defaultValue={1}
                                        min={1}
                                    />
                                    <button
                                        type="button"
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
                                        className="bg-green-600 text-white px-3 rounded text-sm hover:bg-green-700"
                                    >
                                        Ekle
                                    </button>
                                </div>

                                {/* Eklenen Ürünler */}
                                {orderList.length > 0 && (
                                    <div className="mt-2 bg-white border rounded">
                                        <ul>
                                            {orderList.map((item, index) => (
                                                <li key={index} className="flex justify-between p-2 border-b last:border-0 text-sm">
                                                    <span>{item.name} - <b>{item.quantity} Adet</b></span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setOrderList(orderList.filter((_, i) => i !== index))}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Sil
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Ek Mesaj (Opsiyonel)</label>
                                <textarea
                                    className="border p-2 w-full rounded"
                                    rows={3}
                                    placeholder="Eklemek istediğiniz notlar..."
                                    value={emailData.message}
                                    onChange={e => setEmailData({ ...emailData, message: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEmailModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                >
                                    Siparişi Gönder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT/NEW MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {editingId ? 'Tedarikçi Düzenle' : 'Yeni Tedarikçi'}
                        </h2>
                        <form onSubmit={handleSaveSupplier}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Firma Adı</label>
                                <input
                                    type="text"
                                    required
                                    className="border p-2 w-full rounded"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">E-Posta</label>
                                <input
                                    type="email"
                                    required
                                    className="border p-2 w-full rounded"
                                    value={newItem.email}
                                    onChange={e => setNewItem({ ...newItem, email: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Telefon</label>
                                <input
                                    type="text"
                                    required
                                    className="border p-2 w-full rounded"
                                    value={newItem.phone_number_proc}
                                    onChange={e => setNewItem({ ...newItem, phone_number_proc: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Adres</label>
                                <textarea
                                    required
                                    className="border p-2 w-full rounded"
                                    rows={3}
                                    value={newItem.address_proc}
                                    onChange={e => setNewItem({ ...newItem, address_proc: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                                >
                                    {editingId ? 'Güncelle' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                            suppliers.map((supplier: any) => (
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
                                        <button
                                            onClick={() => openEditModal(supplier)}
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={() => openEmailModal(supplier)}
                                            className="font-medium text-green-600 hover:underline"
                                        >
                                            Mail At
                                        </button>
                                    </td>
                                </tr>
                            ))

                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center">
                                    {error ? 'Veri yüklenemedi.' : 'Kayıtlı tedarikçi bulunamadı.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Procurement

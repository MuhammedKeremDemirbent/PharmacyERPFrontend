import { useEffect, useState } from 'react'
import api from '../api'
import Message from '../components/Message'

const Inventory = () => {
    const [medicines, setMedicines] = useState([])
    const [error, setError] = useState('') // This might be kept for inline fetching errors or removed if we strictly use the modal. I'll keep it for table loading errors but use Modal for actions.
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)

    // Custom Message State
    const [messageData, setMessageData] = useState<{ type: 'success' | 'error' | 'warning', title?: string, message: string } | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        expiry_date: '',
        price: '',
        form_type: 'TABLET',
        how_many: 0
    })

    const fetchMedicines = async () => {
        try {
            const response = await api.get('/inventory/medicines/')
            setMedicines(response.data)
        } catch (err) {
            console.error(err)
            setError('Veri çekilemedi.') // Optional: Use modal here too if desired, but maybe intrusive on load.
        }
    }

    useEffect(() => {
        fetchMedicines()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingId) {
                await api.put(`/inventory/medicines/${editingId}/`, formData)
                setMessageData({ type: 'success', message: 'İlaç başarıyla güncellendi!' })
            } else {
                await api.post('/inventory/medicines/', formData)
                setMessageData({ type: 'success', message: 'İlaç başarıyla eklendi!' })
            }
            setShowModal(false)
            fetchMedicines()
            resetForm()
        } catch (err) {
            console.error(err)
            setMessageData({ type: 'error', message: 'İşlem sırasında bir hata oluştu.' })
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bu ilacı silmek istediğinize emin misiniz?')) return
        try {
            await api.delete(`/inventory/medicines/${id}/`)
            setMessageData({ type: 'success', message: 'İlaç başarıyla silindi.' })
            fetchMedicines()
        } catch (err) {
            console.error(err)
            setMessageData({ type: 'error', message: 'Silme işlemi başarısız.' })
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            expiry_date: '',
            price: '',
            form_type: 'TABLET',
            how_many: 0
        })
        setEditingId(null)
    }

    const openEdit = (med: any) => {
        setEditingId(med.id)
        setFormData({
            name: med.name,
            expiry_date: med.expiry_date,
            price: med.price,
            form_type: med.form_type,
            how_many: med.how_many
        })
        setShowModal(true)
    }

    const openNew = () => {
        resetForm()
        setShowModal(true)
    }

    return (
        <div className="container mx-auto p-4">
            {/* Custom Message Modal */}
            {messageData && (
                <Message
                    type={messageData.type}
                    title={messageData.title}
                    message={messageData.message}
                    onClose={() => setMessageData(null)}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Eczane Stok Listesi</h1>
                <button
                    onClick={openNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-200 flex items-center"
                >
                    + İlaç Ekle
                </button>
            </div>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{error}</div>}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                İlaç Adı
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Form
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                SKT
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Stok
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Fiyat
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                İşlemler
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((med: any) => (
                            <tr key={med.id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center">
                                        <div className="ml-3">
                                            <p className="text-gray-900 whitespace-no-wrap font-semibold">
                                                {med.name}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{med.form_type}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className={`text-gray-900 whitespace-no-wrap`}>
                                        {med.expiry_date}
                                    </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${med.how_many < 10 ? 'text-red-900' : 'text-green-900'}`}>
                                        <span aria-hidden className={`absolute inset-0 ${med.how_many < 10 ? 'bg-red-200' : 'bg-green-200'} opacity-50 rounded-full`}></span>
                                        <span className="relative">{med.how_many}</span>
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">₺{med.price}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button onClick={() => openEdit(med)} className="text-blue-600 hover:text-blue-900 mr-4 transition duration-150">Düzenle</button>
                                    <button onClick={() => handleDelete(med.id)} className="text-red-600 hover:text-red-900 transition duration-150">Sil</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-40 flex items-center justify-center">
                    <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{editingId ? 'İlaç Düzenle' : 'Yeni İlaç Ekle'}</h3>
                            <form onSubmit={handleSave}>
                                <div className="mb-3">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">İlaç Adı</label>
                                    <input
                                        required
                                        type="text"
                                        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">İlaç Formu</label>
                                    <select
                                        required
                                        className="border p-2 w-full rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.form_type}
                                        onChange={e => setFormData({ ...formData, form_type: e.target.value })}
                                    >
                                        <option value="TABLET">Hap / Tablet</option>
                                        <option value="LIQUID">Sıvı / Şurup</option>
                                        <option value="OTHER">Diğer</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Son Kullanma Tarihi</label>
                                    <input
                                        required
                                        type="date"
                                        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.expiry_date}
                                        onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Stok Adedi</label>
                                    <input
                                        required
                                        type="number"
                                        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.how_many}
                                        onChange={e => setFormData({ ...formData, how_many: Number(e.target.value) })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Fiyat (₺)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-200"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                                    >
                                        Kaydet
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Inventory

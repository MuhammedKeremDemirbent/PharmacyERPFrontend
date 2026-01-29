import { useEffect, useState } from 'react'
import api from '../api'

const Inventory = () => {
    const [medicines, setMedicines] = useState([])
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        expiry_date: '',
        price: '',
        form_type: 'TABLET',
        how_many: 0
    })

    const fetchMedicines = () => {
        api.get('/inventory/medicines/')
            .then(res => setMedicines(res.data))
            .catch(err => {
                console.error(err)
                setError('Veri çekilemedi.')
            })
    }

    useEffect(() => {
        fetchMedicines()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingId) {
                await api.put(`/inventory/medicines/${editingId}/`, formData)
                alert('İlaç güncellendi!')
            } else {
                await api.post('/inventory/medicines/', formData)
                alert('İlaç eklendi!')
            }
            setShowModal(false)
            resetForm()
            fetchMedicines()
        } catch (err: any) {
            console.error(err)
            const msg = err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message
            alert(`İşlem başarısız: ${msg}`)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Bu ilacı silmek istediğinize emin misiniz?')) return
        try {
            await api.delete(`/inventory/medicines/${id}/`)
            alert('İlaç silindi.')
            fetchMedicines()
        } catch (err: any) {
            console.error(err)
            alert('Silme işlemi başarısız.')
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-600">Eczane Stok Listesi</h1>
                <button
                    onClick={openNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 shadow-lg"
                >
                    <span>+</span> İlaç Ekle
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {editingId ? 'İlacı Düzenle' : 'Yeni İlaç Ekle'}
                        </h2>
                        <form onSubmit={handleSave}>
                            <div className="mb-3">
                                <label className="block text-gray-700 text-sm font-bold mb-2">İlaç Adı</label>
                                <input
                                    required
                                    className="border p-2 w-full rounded"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-700 text-sm font-bold mb-2">İlaç Formu</label>
                                <select
                                    required
                                    className="border p-2 w-full rounded bg-white"
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
                                    type="date"
                                    required
                                    className="border p-2 w-full rounded"
                                    value={formData.expiry_date}
                                    onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Stok Adedi</label>
                                <input
                                    type="number"
                                    required
                                    className="border p-2 w-full rounded"
                                    value={formData.how_many}
                                    onChange={e => setFormData({ ...formData, how_many: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Fiyat (₺)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    className="border p-2 w-full rounded"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-800 py-2 px-4 rounded">İptal</button>
                                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">İlaç Adı</th>
                            <th scope="col" className="px-6 py-3">Form</th>
                            <th scope="col" className="px-6 py-3">SKT</th>
                            <th scope="col" className="px-6 py-3">Stok</th>
                            <th scope="col" className="px-6 py-3">Fiyat</th>
                            <th scope="col" className="px-6 py-3">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((med: any) => (
                            <tr key={med.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{med.name}</td>
                                <td className="px-6 py-4">{med.form_type}</td>
                                <td className="px-6 py-4 text-red-600">{med.expiry_date}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${med.how_many < 10 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                        {med.how_many}
                                    </div>
                                </td>
                                <td className="px-6 py-4">₺{med.price}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => openEdit(med)} className="text-blue-600 hover:underline">Düzenle</button>
                                    <button onClick={() => handleDelete(med.id)} className="text-red-600 hover:underline">Sil</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Inventory

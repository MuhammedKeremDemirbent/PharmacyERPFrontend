import { useState } from 'react'
import Alert from '../components/molecules/Alert'
import Button from '../components/atoms/Button'
import MedicineForm from '../components/organisms/forms/MedicineForm'
import { useMedicines } from '../hooks/useMedicines'
import { useSuppliers } from '../hooks/useSuppliers'
import type { Medicine } from '../types'

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
        <div className="container mx-auto p-4">
            {messageData && (
                <Alert
                    type={messageData.type}
                    title={messageData.title}
                    message={messageData.message}
                    onClose={() => setMessageData(null)}
                />
            )}

            {medError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{medError}</div>}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Eczane Stok Listesi</h1>
                <Button onClick={openNew}>
                    + İlaç Ekle
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">İlaç Adı</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Form</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SKT</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stok</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fiyat</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((med) => (
                            <tr key={med.id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center">
                                        <div className="ml-3">
                                            <p className="text-gray-900 whitespace-no-wrap font-semibold">{med.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{med.form_type}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{med.expiry_date}</p>
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
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-900" onClick={() => openEdit(med)}>Düzenle</Button>
                                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-900" onClick={() => handleDelete(med.id)}>Sil</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-40 flex items-center justify-center">
                    <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                {editingMed ? 'İlaç Düzenle' : 'Yeni İlaç Ekle'}
                            </h3>
                            <MedicineForm
                                initialData={editingMed}
                                suppliers={suppliers}
                                onSubmit={handleSave}
                                onCancel={() => setShowModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Inventory

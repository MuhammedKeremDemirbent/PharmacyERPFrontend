import React, { useEffect, useState } from 'react';
import FormField from '../../molecules/FormField';
import Button from '../../atoms/Button';
import type { Medicine, Supplier } from '../../../types';

interface MedicineFormProps {
    initialData?: Partial<Medicine>;
    suppliers: Supplier[];
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const MedicineForm: React.FC<MedicineFormProps> = ({ initialData, suppliers, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        expiry_date: '',
        price: '',
        form_type: 'TABLET',
        how_many: 0,
        supplier: '' as string | number
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                expiry_date: initialData.expiry_date || '',
                price: initialData.price?.toString() || '',
                form_type: initialData.form_type || 'TABLET',
                how_many: initialData.how_many || 0,
                supplier: typeof initialData.supplier === 'object' ? initialData.supplier?.id || '' : initialData.supplier || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormField
                label="İlaç Adı"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
            />

            <div className="mb-3">
                <label className="block text-gray-700 text-sm font-medium mb-1">İlaç Formu</label>
                <select
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.form_type}
                    onChange={e => setFormData({ ...formData, form_type: e.target.value })}
                >
                    <option value="TABLET">Hap / Tablet</option>
                    <option value="LIQUID">Sıvı / Şurup</option>
                    <option value="OTHER">Diğer</option>
                </select>
            </div>

            <FormField
                label="Son Kullanma Tarihi"
                required
                type="date"
                value={formData.expiry_date}
                onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
            />

            <FormField
                label="Stok Adedi"
                required
                type="number"
                value={formData.how_many}
                onChange={e => setFormData({ ...formData, how_many: Number(e.target.value) })}
            />

            {!initialData?.id && (
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Tedarikçi</label>
                    <select
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.supplier}
                        onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                    >
                        <option value="">-- Tedarikçi Seçin --</option>
                        {suppliers.map((sup) => (
                            <option key={sup.id} value={sup.id}>{sup.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <FormField
                label="Fiyat (₺)"
                required
                type="number"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
            />

            <div className="flex justify-end gap-2 mt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    İptal
                </Button>
                <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                >
                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
            </div>
        </form>
    );
};

export default MedicineForm;

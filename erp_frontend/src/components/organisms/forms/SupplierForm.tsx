import React, { useEffect, useState } from 'react';
import FormField from '../../molecules/FormField';
import Button from '../../atoms/Button';
import type { Supplier } from '../../../types';

interface SupplierFormProps {
    initialData?: Partial<Supplier>;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number_proc: '',
        address_proc: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                phone_number_proc: initialData.phone_number_proc || '',
                address_proc: initialData.address_proc || ''
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
                label="Firma Adı"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <FormField
                label="Email Adresi"
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <FormField
                label="Telefon No"
                required
                value={formData.phone_number_proc}
                onChange={e => setFormData({ ...formData, phone_number_proc: e.target.value })}
            />
            <div className="mb-3">
                <label className="block text-gray-700 text-sm font-medium mb-1">Adres</label>
                <textarea
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={3}
                    value={formData.address_proc}
                    onChange={e => setFormData({ ...formData, address_proc: e.target.value })}
                />
            </div>

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

export default SupplierForm;

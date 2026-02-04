import React, { useEffect, useState } from 'react';
import FormField from '../../molecules/FormField';
import Button from '../../atoms/Button';
import type { Patient } from '../../../types';

interface PatientFormProps {
    initialData?: Partial<Patient>;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        address: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                first_name: initialData.first_name || '',
                last_name: initialData.last_name || '',
                phone_number: initialData.phone_number || '',
                email: initialData.email || '',
                address: initialData.address || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    label="Ad"
                    required
                    value={formData.first_name}
                    onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                />
                <FormField
                    label="Soyad"
                    required
                    value={formData.last_name}
                    onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                />
            </div>

            <FormField
                label="Telefon"
                required
                value={formData.phone_number}
                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
            />

            <FormField
                label="Email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
            />

            <div className="mb-3">
                <label className="block text-gray-700 text-sm font-medium mb-1">Adres</label>
                <textarea
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={3}
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
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
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                >
                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
            </div>
        </form>
    );
};

export default PatientForm;

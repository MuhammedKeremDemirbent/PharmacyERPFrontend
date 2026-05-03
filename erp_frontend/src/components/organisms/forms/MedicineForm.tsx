import React, { useEffect, useState } from 'react';
import FormField from '../../molecules/FormField';
import Button from '../../atoms/Button';
import type { Medicine, Supplier } from '../../../types';
import { Label } from "@/components/ui/label";

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

    const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
                label="İlaç Adı"
                required
                placeholder="Örn: Parol 500mg"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
            />

            <div className="space-y-2">
                <Label className="text-sm font-semibold tracking-wide">İlaç Formu</Label>
                <select
                    required
                    className={selectClass}
                    value={formData.form_type}
                    onChange={e => setFormData({ ...formData, form_type: e.target.value })}
                >
                    <option value="TABLET" className="bg-slate-900 text-white">Hap / Tablet</option>
                    <option value="LIQUID" className="bg-slate-900 text-white">Sıvı / Şurup</option>
                    <option value="OTHER" className="bg-slate-900 text-white">Diğer</option>
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
                min="0"
                value={formData.how_many}
                onChange={e => setFormData({ ...formData, how_many: Number(e.target.value) })}
            />

            {!initialData?.id && (
                <div className="space-y-2">
                    <Label className="text-sm font-semibold tracking-wide">Tedarikçi</Label>
                    <select
                        className={selectClass}
                        value={formData.supplier}
                        onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                    >
                        <option value="" className="bg-slate-900 text-white opacity-50">-- Tedarikçi Seçin --</option>
                        {suppliers.map((sup) => (
                            <option key={sup.id} value={sup.id} className="bg-slate-900 text-white">{sup.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <FormField
                label="Fiyat (₺)"
                required
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
            />

            <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="hover:bg-white/5"
                >
                    İptal
                </Button>
                <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                    disabled={isLoading}
                >
                    {isLoading ? 'Kaydediliyor...' : 'İlacı Kaydet'}
                </Button>
            </div>
        </form>
    );
};

export default MedicineForm;


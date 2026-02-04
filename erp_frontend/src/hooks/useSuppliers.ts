import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { setSuppliers } from '../store/slices/supplierSlice';
import { supplierService } from '../services/supplierService';
import type { Supplier } from '../types';

export const useSuppliers = () => {
    const dispatch = useDispatch();
    const suppliers = useSelector((state: RootState) => state.supplier.list);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSuppliers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await supplierService.getAll();
            dispatch(setSuppliers(data));
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Tedarikçiler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
        setLoading(true);
        try {
            await supplierService.create(supplier);
            await fetchSuppliers();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const updateSupplier = async (id: number, supplier: Partial<Supplier>) => {
        setLoading(true);
        try {
            await supplierService.update(id, supplier);
            await fetchSuppliers();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (suppliers.length === 0) {
            fetchSuppliers();
        }
    }, [fetchSuppliers, suppliers.length]);

    // Delete fonksiyonu eklenebilir

    return {
        suppliers,
        loading,
        error,
        fetchSuppliers,
        addSupplier,
        updateSupplier
    };
};

import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { setMedicines } from '../store/slices/medicineSlice';
import { medicineService } from '../services/medicineService';
import type { Medicine } from '../types';

export const useMedicines = () => {
    const dispatch = useDispatch();
    const medicines = useSelector((state: RootState) => state.medicine.list);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMedicines = useCallback(async () => {
        setLoading(true);
        try {
            const data = await medicineService.getAll();
            dispatch(setMedicines(data));
            setError(null);
        } catch (err: any) {
            setError(err.message || 'İlaçlar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const addMedicine = async (medicine: Omit<Medicine, 'id'>) => {
        setLoading(true);
        try {
            await medicineService.create(medicine);
            // Listeyi güncellemek için tekrar çekiyoruz
            // Alternatif: Direkt Redux'a push da edilebilir ama ID backend'den gelmeli
            await fetchMedicines();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const updateMedicine = async (id: number, medicine: Partial<Medicine>) => {
        setLoading(true);
        try {
            await medicineService.update(id, medicine);
            await fetchMedicines();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const deleteMedicine = async (id: number) => {
        setLoading(true);
        try {
            await medicineService.delete(id);
            await fetchMedicines();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (medicines.length === 0) {
            fetchMedicines();
        }
    }, [fetchMedicines, medicines.length]);

    return {
        medicines,
        loading,
        error,
        fetchMedicines,
        addMedicine,
        updateMedicine,
        deleteMedicine
    };
};

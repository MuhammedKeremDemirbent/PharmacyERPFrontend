import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { setPatients } from '../store/slices/patientSlice';
import { patientService } from '../services/patientService';
import type { Patient } from '../types';

export const usePatients = () => {
    const dispatch = useDispatch();
    const patients = useSelector((state: RootState) => state.patient.list);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPatients = useCallback(async () => {
        setLoading(true);
        try {
            const data = await patientService.getAll();
            dispatch(setPatients(data));
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Hastalar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const addPatient = async (patient: Omit<Patient, 'id'>) => {
        setLoading(true);
        try {
            await patientService.create(patient);
            await fetchPatients();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Update ve Delete frontend'de henüz kullanılmıyor olabilir ama hook hazır olsun
    const updatePatient = async (id: number, patient: Partial<Patient>) => {
        setLoading(true);
        try {
            await patientService.update(id, patient);
            await fetchPatients();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const deletePatient = async (id: number) => {
        setLoading(true);
        try {
            await patientService.delete(id);
            await fetchPatients();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Otomatik veri çekme isteğe bağlı, şimdilik lazım olursa çekeriz
        // if (patients.length === 0) fetchPatients();
    }, []);

    return {
        patients,
        loading,
        error,
        fetchPatients,
        addPatient,
        updatePatient,
        deletePatient
    };
};

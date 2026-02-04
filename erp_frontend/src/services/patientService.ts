import api from '../api';
import type { Patient } from '../types';

export const patientService = {
    getAll: async () => {
        const response = await api.get<Patient[]>('/patients/');
        return response.data;
    },

    create: async (data: Omit<Patient, 'id'>) => {
        const response = await api.post<Patient>('/patients/', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Patient>) => {
        // Backend'de update endpoint'i varsa buraya eklenmeli
        // Şimdilik sadece create ve list var gibi duruyor ama standart CRUD için ekliyorum
        const response = await api.put<Patient>(`/patients/${id}/`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/patients/${id}/`);
        return response.data;
    }
};

import api from '../api';
import type { Medicine } from '../types';

export const medicineService = {
    getAll: async () => {
        const response = await api.get<Medicine[]>('/inventory/medicines/');
        return response.data;
    },

    create: async (data: Omit<Medicine, 'id'>) => {
        const response = await api.post<Medicine>('/inventory/medicines/', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Medicine>) => {
        const response = await api.put<Medicine>(`/inventory/medicines/${id}/`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/inventory/medicines/${id}/`);
        return response.data;
    }
};

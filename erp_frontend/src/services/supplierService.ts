import api from '../api';
import type { Supplier } from '../types';

export const supplierService = {
    getAll: async () => {
        const response = await api.get<Supplier[]>('/procurement/');
        return response.data;
    },

    create: async (data: Omit<Supplier, 'id'>) => {
        const response = await api.post<Supplier>('/procurement/', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Supplier>) => {
        const response = await api.put<Supplier>(`/procurement/${id}/`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/procurement/${id}/`);
        return response.data;
    }
};

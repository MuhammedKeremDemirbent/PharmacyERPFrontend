import type { Medicine } from '@/types';
import { baseProtectedApi } from '../baseApi';

export const medicineApi = baseProtectedApi.injectEndpoints({
    endpoints: (builder) => ({
        getMedicines: builder.query<Medicine[], void>({
            query: () => ({
                url: '/inventory/medicines/',
                method: 'GET',
            }),
            providesTags: ['Medicine'],
        }),
        createMedicine: builder.mutation<Medicine, Omit<Medicine, 'id'>>({
            query: (data) => ({
                url: '/inventory/medicines/',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Medicine'],
        }),
        updateMedicine: builder.mutation<Medicine, { id: number; data: Partial<Medicine> }>({
            query: ({ id, data }) => ({
                url: `/inventory/medicines/${id}/`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: ['Medicine'],
        }),
        deleteMedicine: builder.mutation<void, number>({
            query: (id) => ({
                url: `/inventory/medicines/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Medicine'],
        }),
        uploadMedicineExcel: builder.mutation<{ message: string }, FormData>({
            query: (formData) => ({
                url: '/inventory/medicines/excel-upload/',
                method: 'POST',
                data: formData,
            }),
            invalidatesTags: ['Medicine'],
        }),
    }),
});

export const {
    useGetMedicinesQuery,
    useLazyGetMedicinesQuery, //LazyQuery kısmı burada
    useCreateMedicineMutation,
    useUpdateMedicineMutation,
    useDeleteMedicineMutation,
    useUploadMedicineExcelMutation,
} = medicineApi;

//İlaç getirir, oluşturur, günceller, siler.
//baseaip.ts kısmındaki baseProtectedApi kullanıldı
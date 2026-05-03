import type { Supplier } from '@/types';
import { baseProtectedApi } from '../baseApi';

export const supplierApi = baseProtectedApi.injectEndpoints({
    endpoints: (builder) => ({
        getSuppliers: builder.query<Supplier[], void>({
            query: () => ({
                url: '/procurement/',
                method: 'GET',
            }),
            providesTags: ['Supplier'],
        }),
        createSupplier: builder.mutation<Supplier, Omit<Supplier, 'id'>>({
            query: (data) => ({
                url: '/procurement/',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Supplier'],
        }),
        updateSupplier: builder.mutation<Supplier, { id: number; data: Partial<Supplier> }>({
            query: ({ id, data }) => ({
                url: `/procurement/${id}/`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: ['Supplier'],
        }),
        deleteSupplier: builder.mutation<void, number>({
            query: (id) => ({
                url: `/procurement/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Supplier'],
        }),
    }),
});

export const {
    useGetSuppliersQuery, //React Hook
    useLazyGetSuppliersQuery, //Lazy Hook
    useCreateSupplierMutation,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation,
} = supplierApi;

//Tedarikçi getirir, oluşturur, günceller, siler.

//baseapi.ts kısmındaki baseProtectedApi kullandık.

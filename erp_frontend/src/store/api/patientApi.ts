import type { Patient } from '@/types';
import { baseProtectedApi } from '../baseApi';

export const patientApi = baseProtectedApi.injectEndpoints({
    endpoints: (builder) => ({
        getPatients: builder.query<Patient[], void>({
            query: () => ({
                url: '/patients/',
                method: 'GET',
            }),
            providesTags: ['Patient'],
        }),
        createPatient: builder.mutation<Patient, Omit<Patient, 'id'>>({
            query: (data) => ({
                url: '/patients/',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Patient'],
        }),
        updatePatient: builder.mutation<Patient, { id: number; data: Partial<Patient> }>({
            query: ({ id, data }) => ({
                url: `/patients/${id}/`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: ['Patient'],
        }),
        deletePatient: builder.mutation<void, number>({
            query: (id) => ({
                url: `/patients/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Patient'],
        }),
        //EXCEL dosyası için gerekli POST
        uploadPatientExcel: builder.mutation<{ message: string }, FormData>({
            query: (formData) => ({
                url: '/patients/excel-upload/',
                method: 'POST',
                data: formData,
            }),
            invalidatesTags: ['Patient'],
        }),
    }),
});

export const {
    useGetPatientsQuery,
    useLazyGetPatientsQuery, //Lazy Query
    useCreatePatientMutation,
    useUpdatePatientMutation,
    useDeletePatientMutation,
    useUploadPatientExcelMutation,
} = patientApi;

//Hasta getirir, oluşturur, günceller, siler.

//baseaip.ts kısmındaki baseProtectedApi kullanıldı

//lazy methodu
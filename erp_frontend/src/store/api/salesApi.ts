import { baseProtectedApi } from '../baseApi';

export interface CheckoutItem {
    product_id: number;
    quantity: number;
}

export interface CheckoutRequest {
    items: CheckoutItem[];
    patient_id: number | null;
}

export interface CheckoutResponse {
    sale_id: number;
    total: string;
    message?: string;
}

export const salesApi = baseProtectedApi.injectEndpoints({
    endpoints: (builder) => ({
        checkout: builder.mutation<CheckoutResponse, { data: CheckoutRequest; idempotencyKey: string }>({
            query: ({ data, idempotencyKey }) => ({
                url: '/sales/checkout/',
                method: 'POST',
                data,
                headers: {
                    'Idempotency-Key': idempotencyKey,
                },
            }),
            invalidatesTags: ['Medicine'], // Satıştan sonra stoklar güncellensin
        }),
    }),
});

export const {
    useCheckoutMutation
} = salesApi;

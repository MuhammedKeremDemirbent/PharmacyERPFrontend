import type { PasswordChangeRequestData, PasswordChangeResponseData } from '@/types/service';

import { baseProtectedApi } from '@/store/baseApi';

export const passwordChangeApi = baseProtectedApi.injectEndpoints({
  endpoints: (builder) => ({
    passwordChange: builder.mutation<PasswordChangeResponseData, PasswordChangeRequestData>({
      query: (data) => ({
        url: '/accounts/password-change/',
        method: 'POST',
        data: data,
      }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: '/accounts/forgot-password/', // Endpoint adı backend ile uyumlu olmalı
        method: 'POST',
        data,
      }),
    }),
    resetPassword: builder.mutation<void, { token: string; new_password: string }>({
      query: (data) => ({
        url: '/accounts/reset-password/',
        method: 'POST',
        data,
      }),
    }),
  }),
});

export const {
  usePasswordChangeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = passwordChangeApi;

//Şifre değiştirir, şifremi unuttum, şifre sıfırla.

//GET METODU QUERY İLE ÇEKİLİR.
//POST,PUT,DELETE METODLARI MUTATION İLE ÇEKİLİR.

//baseaip.ts kısmındaki baseProtectedApi kullanıldı

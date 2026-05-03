import type {
  PasswordSetConfirmRequestData,
  PasswordSetConfirmResponseData,
  PasswordSetRequestData,
  PasswordSetResponseData,
} from '@/types/service';

import { basePublicApi } from '@/store/baseApi';

export const passwordSetApi = basePublicApi.injectEndpoints({
  endpoints: (builder) => ({
    passwordSet: builder.mutation<PasswordSetResponseData, PasswordSetRequestData>({
      query: (data) => ({
        url: '/account/password-set/',
        method: 'POST',
        data: data,
      }),
    }),
    passwordSetConfirm: builder.mutation<
      PasswordSetConfirmResponseData,
      PasswordSetConfirmRequestData
    >({
      query: (data) => ({
        url: '/account/password-set-confirm/',
        method: 'POST',
        data: data,
      }),
    }),
  }),
});

export const {
  usePasswordSetMutation,
  usePasswordSetConfirmMutation
} = passwordSetApi;

//Genellikle sosyal medya ile (Google, Facebook) giriş yapan kullanıcıların, sisteme sonradan bir şifre belirlemesi için kullanılır. 
//Bizde zaten passwordChange var daha profesyonel yaparsak buna geçeriz
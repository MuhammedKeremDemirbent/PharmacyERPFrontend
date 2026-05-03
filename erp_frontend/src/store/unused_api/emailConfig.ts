import type {
  GetEmailConfigResponseData,
  UpdateEmailConfigRequestData,
  UpdateEmailConfigResponseData,
} from '@/types/service';

import { baseProtectedApi } from '@/store/baseApi';

export const emailConfigApi = baseProtectedApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmailConfig: builder.query<GetEmailConfigResponseData, void>({
      query: () => ({
        url: '/account/email-change/',
        method: 'GET',
      }),
      providesTags: ['EmailChange'],
    }),
    updateEmailConfig: builder.mutation<
      UpdateEmailConfigResponseData,
      UpdateEmailConfigRequestData
    >({
      query: (data) => ({
        url: '/account/email-change/',
        method: 'PUT',
        data: data,
      }),
      invalidatesTags: ['UserProfile', 'EmailChange'],
    }),
  }),
});

export const {
  useGetEmailConfigQuery,
  useUpdateEmailConfigMutation
} = emailConfigApi;

//Kullanıcının sistemdeki kayıtlı e-posta adresini değiştirmesini sağlar.
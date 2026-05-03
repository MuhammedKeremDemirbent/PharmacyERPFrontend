import type {
  EmailVerifyRequestData,
  EmailVerifyResponseData,
  LoginRequestData,
  LoginResponseData,
  OtpValidateRequestData,
  OtpValidateResponseData,
  RefreshTokenRequestData,
  RefreshTokenResponseData,
  RegistrationRequestData,
  RegistrationResponseData,
} from '@/types/service';

import { basePublicApi } from '@/store/baseApi';

export const authApi = basePublicApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseData, LoginRequestData>({
      query: (data) => ({
        url: '/token/',
        method: 'POST',
        data: data,
      }),
    }),
    otpValidate: builder.mutation<OtpValidateResponseData, OtpValidateRequestData>({
      query: (data) => ({
        url: '/account/otp-validate/',
        method: 'POST',
        data: data,
      }),
    }),
    registration: builder.mutation<RegistrationResponseData, RegistrationRequestData>({
      query: (data) => ({
        url: '/account/registration/',
        method: 'POST',
        data: data,
      }),
    }),
    emailVerify: builder.mutation<EmailVerifyResponseData, EmailVerifyRequestData>({
      query: (data) => ({
        url: '/account/email-verify/',
        method: 'POST',
        data: data,
      }),
    }),
    refreshToken: builder.mutation<RefreshTokenResponseData, RefreshTokenRequestData>({
      query: (data) => ({
        url: '/token/refresh/',
        method: 'POST',
        data: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useOtpValidateMutation,
  useRegistrationMutation,
  useEmailVerifyMutation,
  useRefreshTokenMutation,
} = authApi;


//Giriş yap, kayıt ol.

//Pages bu apileri kullanarak veri çeker veya gönderir. Veri gelince otomatik olarak storeda cache alınır.

//baseaip.ts kısmındaki basePublicApi kullanıldı
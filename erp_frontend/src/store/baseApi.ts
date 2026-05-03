import { Mutex } from 'async-mutex';
import type { AxiosError, AxiosRequestConfig } from 'axios';

import type { RequestOptions } from '@/types/service';

import { httpRequest } from '@/services/httpRequest';
import { refreshTokenAPI } from '@/services/refreshToken';

import type { RootState } from './store';
import { refreshTokens, logout } from './slices/authSlice';
import { isTokenExpired, isTokenExpiringSoon } from './utils';

import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';

const mutex = new Mutex();

interface QueryError {
  status: number | undefined;
  data: object | string;
}

export const axiosQueryWrapper = async (
  config: AxiosRequestConfig,
  options: RequestOptions = {},
) => {
  try {
    const response = await httpRequest(config, options);
    return { data: response.data };
  } catch (axiosError) {
    const error = axiosError as AxiosError;
    // Log error for debugging
    console.error(`[API Error] ${config.method?.toUpperCase()} ${config.url}:`, error.response?.data || error.message);

    return {
      error: {
        status: error.response?.status,
        data: error.response?.data || error.message,
      },
    };
  }
};

export const basePublicQuery = //token önemsiz
  (): BaseQueryFn<AxiosRequestConfig, unknown, QueryError> => async (args) => {
    return await axiosQueryWrapper(args);
  };

export const baseProtectedQuery = //token önemli
  (): BaseQueryFn<AxiosRequestConfig, unknown, QueryError> => async (args, api) => {
    await mutex.waitForUnlock();
    const state = api.getState() as RootState;
    // Refresh token if it's expiring soon
    if (
      !!state.auth.token &&
      !!state.auth.refreshToken &&
      isTokenExpiringSoon(state.auth.token)
    ) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          const refreshResult = await refreshTokenAPI({
            refresh: state.auth.refreshToken,
          });
          api.dispatch(refreshTokens(refreshResult.data));
          return await axiosQueryWrapper(args);
        } catch (refreshError) {
          const error = refreshError as AxiosError;
          if (error && error.status !== 500) {
            api.dispatch(logout());
          }
          return await axiosQueryWrapper(args);
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        return await axiosQueryWrapper(args);
      }
    }

    await mutex.waitForUnlock();
    try {
      const result = await axiosQueryWrapper(args);

      // If result has error, check if it's 401/403 for manual refresh
      if ('error' in result && result.error) {
        const errorStatus = (result.error as any).status;

        if (
          (errorStatus === 401 || errorStatus === 403) &&
          !!state.auth.refreshToken &&
          !isTokenExpired(state.auth.refreshToken)
        ) {
          if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
              const refreshResult = await refreshTokenAPI({
                refresh: state.auth.refreshToken,
              });
              api.dispatch(refreshTokens(refreshResult.data));
              return await axiosQueryWrapper(args);
            } catch (refreshError) {
              api.dispatch(logout());
              return result;
            } finally {
              release();
            }
          } else {
            await mutex.waitForUnlock();
            return await axiosQueryWrapper(args);
          }
        }
      }

      return result;
    } catch (error) {
      return {
        error: {
          status: (error as any)?.status,
          data: (error as any)?.data || (error as any)?.message || 'Unknown error',
        },
      };
    }
  };

export const baseProtectedApi = createApi({ //Kullanıcıların giriş yaptıktan sonra kullanabildiği apiler
  reducerPath: 'baseProtectedApi',          //Her isteğin başlığına (Header) otomatik olarak Authorization: Bearer bilgisini ekler.
  baseQuery: baseProtectedQuery(),
  keepUnusedDataFor: 300, //Api 5dk boyunca kullanılmazsa bellekten siler.
  endpoints: () => ({}),
  tagTypes: ['UserProfile', 'UserList', 'EmailChange', 'Medicine', 'Supplier', 'Patient'],
});

export const basePublicApi = createApi({   //Giriş yapmamış kişilerde kullanabilir. Login ve Register kısımları için
  reducerPath: 'basePublicApi',
  baseQuery: basePublicQuery(),
  endpoints: () => ({}),
});


//RTK Query'nin temeli buradadır.
//httpRequest.ts'i kullanarak backend ile nasıl konuşacağını bilir. Tüm diğer API dosyaları (medicineApi) bunun üzerine inşa edilir.
//keepUnusedDataFor: 5 bu kısmı apinin süresini ayarlamak için kullanabiliriz. Şuan 1dk default


import type {
  ForecastAllRequestParams,
  ForecastAllResponseData,
  ForecastRequestParams,
  ForecastResponseData,
} from '@/types/service';

import { baseProtectedApi } from '@/store/baseApi';

export const forecastApi = baseProtectedApi.injectEndpoints({
  endpoints: (builder) => ({
    getForecast: builder.query<ForecastResponseData, ForecastRequestParams>({
      query: (params) => ({
        url: '/exchange/forecast/',
        method: 'GET',
        params: params,
      }),
    }),
    getForecastAll: builder.query<ForecastAllResponseData, ForecastAllRequestParams>({
      query: (params) => ({
        url: '/exchange/forecast/all/',
        method: 'GET',
        params: params,
      }),
    }),
  }),
});

export const {
  useGetForecastQuery,
  useLazyGetForecastQuery,
  useGetForecastAllQuery,
  useLazyGetForecastAllQuery,
} = forecastApi;


//Gelecekteki satışı tahmin etmek için kullanılıyor

import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';

import type { RequestOptions } from '@/types/service';

import { ACCESS_TOKEN_STORAGE_KEY, ACCESS_TOKEN_TYPE } from '@/config/constants';
import { siteConfig } from '@/config/site';

const axiosService = axios.create({
  baseURL: siteConfig.apiURL,
  timeout: 6000,
});

axiosService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `${ACCESS_TOKEN_TYPE} ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const httpRequest = async <T>(
  config: AxiosRequestConfig,
  options: RequestOptions = {},
): Promise<AxiosResponse<T>> => {
  try {
    const { contentType = null, timeout = null } = options;
    if (contentType) {
      config.headers = { ...config.headers, 'Content-Type': contentType };
    }
    if (timeout) {
      config.timeout = timeout;
    }
    return await axiosService.request(config);
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    return Promise.reject(err);
  }
};

export { httpRequest, axiosService };

//Tüm istekler (GET, POST, PUT, DELETE) buradan yönetilir.
//Axios kütüphanesi kullanırız. Projenin kalbi burasıdır.

//Config'den API adresini alır LocalStoragedan tokenı alıp her isteğe otomatik ekler İsteklerin sonucunu veya hatasını store/api ye iletir.

//baseURL bilgisini alır.
//LocalStoragedan tokenı alıp her isteğe otomatik ekler.
//İsteklerin sonucunu veya hatasını store/api ye iletir.
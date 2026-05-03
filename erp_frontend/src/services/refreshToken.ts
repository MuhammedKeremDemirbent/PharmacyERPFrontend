import type { RefreshTokenRequestData, RefreshTokenResponseData } from '@/types/service';

import { httpRequest } from '@/services/httpRequest';

export function refreshTokenAPI(data: RefreshTokenRequestData) {
  return httpRequest<RefreshTokenResponseData>({
    url: '/token/refresh/',
    method: 'POST',
    data: data,
  });
}

//Refresh token API'sini yönetir. Yenileme yapar.

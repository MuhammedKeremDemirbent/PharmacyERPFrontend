import { jwtDecode } from 'jwt-decode';

import { siteConfig } from '@/config/site';

const getJwtPayload = (token: string) => {
  const payload = jwtDecode<{
    exp: number;
    claims: {
      user_type: string;
      email: string;
      email_verified: boolean;
    };
  }>(token);
  return payload;
};

const isTokenExpired = (token: string) => {
  if (!token) return true;
  const decoded = getJwtPayload(token);
  return new Date().getTime() > decoded.exp * 1000;
};

const isTokenExpiringSoon = (token: string) => {
  const bufferMinutes = siteConfig.tokenExpiryBuffer || 5;
  const decoded = getJwtPayload(token);
  const bufferTime = bufferMinutes * 60 * 1000;
  const now = new Date().getTime();
  const exp = decoded.exp * 1000;
  const expLeft = exp - now;
  return expLeft < bufferTime;
};

export { getJwtPayload, isTokenExpired, isTokenExpiringSoon };

export const siteConfig = {
  apiURL: import.meta.env.VITE_ENV_API_URL || '/api',
  appName: import.meta.env.VITE_ENV_APP_NAME,
  tokenExpiryBuffer: import.meta.env.VITE_ENV_TOKEN_EXPIRY_BUFFER,
  demoURL: import.meta.env.VITE_ENV_DEMO_URL,
  recaptchaSiteKey: import.meta.env.VITE_ENV_RECAPTCHA_SITE_KEY,
};

//.env dosyasından veya vite config dosyasından gelen adresi otomatik alır.
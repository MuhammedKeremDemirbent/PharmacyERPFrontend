import type { AxiosRequestConfig } from 'axios';

export interface RequestOptions {
    contentType?: string;
    timeout?: number;
}

export interface RefreshTokenRequestData {
    refresh: string;
}

export interface RefreshTokenResponseData {
    access: string;
    refresh?: string;
}

// Auth & Password Types
export interface LoginRequestData {
    username?: string;
    password?: string;
}
export interface LoginResponseData {
    access: string;
    refresh: string;
    user: any; // User interface can be imported if needed
}

export interface RegisterRequestData {
    username?: string;
    password?: string;
    email?: string;
}

export interface OtpValidateRequestData {
    otp: string;
}
export interface OtpValidateResponseData {
    success: boolean;
}

export interface RegistrationRequestData {
    username?: string;
    password?: string;
    email?: string;
}
export interface RegistrationResponseData {
    id: number;
    username: string;
    email: string;
}

export interface EmailVerifyRequestData {
    token: string;
}
export interface EmailVerifyResponseData {
    success: boolean;
}

// Password Change & Set
export interface PasswordChangeRequestData {
    old_password?: string;
    new_password?: string;
}
export interface PasswordChangeResponseData {
    success: boolean;
}

export interface PasswordSetRequestData {
    email: string;
}
export interface PasswordSetResponseData {
    success: boolean;
}

export interface PasswordSetConfirmRequestData {
    uid: string;
    token: string;
    new_password?: string;
}
export interface PasswordSetConfirmResponseData {
    success: boolean;
}

// Email Config
export interface GetEmailConfigResponseData {
    email_host: string;
    email_port: number;
    email_use_tls: boolean;
}
export interface UpdateEmailConfigRequestData {
    email_host?: string;
    email_port?: number;
    email_use_tls?: boolean;
}
export interface UpdateEmailConfigResponseData {
    success: boolean;
}

// Forecast
export interface ForecastRequestParams {
    date?: string;
    product_id?: number;
}
export interface ForecastResponseData {
    prediction: number;
    confidence: number;
}
export interface ForecastAllRequestParams {
    start_date?: string;
    end_date?: string;
}
export interface ForecastAllResponseData {
    predictions: Array<{ date: string; value: number }>;
}

// User Profile
export interface GetUserProfileResponseData {
    id: number;
    username: string;
    email: string;
}
export interface UpdateUserProfileRequestData {
    first_name?: string;
    last_name?: string;
}
export interface UpdateUserProfileResponseData {
    id: number;
    username: string;
    email: string;
}

export interface GetUserListResponseData extends Array<any> { }
export interface UpdateUserRequestData {
    id: number;
    is_active?: boolean;
}

//Typescriptin devreye girdiği yer.
//Veri tipinin ne olduğunu belirler.

//Request ve Response tiplerini belirler.

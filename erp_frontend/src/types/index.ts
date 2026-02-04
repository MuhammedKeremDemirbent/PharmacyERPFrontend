export interface User {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role?: 'admin' | 'staff'; // Rol tabanlı yetkilendirme için
}

export interface Supplier {
    id: number;
    name: string;
    contact_person?: string; // Backend'de olmayabilir, kontrol edilecek
    email: string;
    phone_number_proc: string;
    address_proc: string;
}

export interface Medicine {
    id: number;
    name: string;
    form_type: 'TABLET' | 'LIQUID' | 'OTHER' | string;
    expiry_date: string;
    price: string | number;
    how_many: number;
    supplier?: number | Supplier; // ID veya Obje olabilir
}

export interface Patient {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    email?: string;
}

export interface CartItem {
    product: Medicine;
    count: number;
}

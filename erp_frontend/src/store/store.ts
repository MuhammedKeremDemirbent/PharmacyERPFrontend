import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import supplierReducer from './slices/supplierSlice';
import patientReducer from './slices/patientSlice';
import medicineReducer from './slices/medicineSlice';

// 1. Persist Konfigürasyonu
const persistConfig = {
    key: 'root', // Deponun genel anahtarı
    storage, // Hangi hafıza? (localStorage)
    whitelist: ['cart', 'auth'] // Sadece Sepet ve Auth'u sakla (Medicine/Supplier/Patient API'dan gelir)
};

// 2. Reducerları Birleştir
const rootReducer = combineReducers({
    cart: cartReducer,
    auth: authReducer,
    supplier: supplierReducer,
    patient: patientReducer,
    medicine: medicineReducer,
});

// 3. Persist ile Zırhla
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Redux Persist için gerekli (Hata vermesin diye)
        }),
});

export const persistor = persistStore(store); // Persist yöneticisi

// TypeScript Tipleri
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//Ana Depo
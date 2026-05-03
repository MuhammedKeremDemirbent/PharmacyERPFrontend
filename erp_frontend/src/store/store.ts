import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';

import { basePublicApi, baseProtectedApi } from './baseApi';


const persistConfig = {
    key: 'root', // Deponun genel anahtarı
    storage, // Hangi hafıza? (localStorage)
    whitelist: ['cart', 'auth'] // Sadece Sepet ve Auth'u sakla (Diğerleri API'dan anlık gelir)
};


const rootReducer = combineReducers({
    cart: cartReducer,
    auth: authReducer,
    [basePublicApi.reducerPath]: basePublicApi.reducer,
    [baseProtectedApi.reducerPath]: baseProtectedApi.reducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Redux Persist için gerekli
        }).concat(basePublicApi.middleware, baseProtectedApi.middleware),
});

export const persistor = persistStore(store); // Persist yöneticisi

// TypeScript Tipleri
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//Ana Depo herşeyi birleştirir.

//Sepet (cart), Giriş Bilgileri (auth) ve tüm API'lar burada birleşir.


 
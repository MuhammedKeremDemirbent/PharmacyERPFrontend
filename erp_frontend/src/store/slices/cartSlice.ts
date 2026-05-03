import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Medicine } from '../../types';

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Medicine>) => {
            const product = action.payload;
            const existing = state.items.find(item => item.product.id === product.id);

            if (existing) {
                if (existing.count < product.how_many) {
                    existing.count += 1;
                }
            } else {
                state.items.push({ product, count: 1 });
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            const productId = action.payload;
            state.items = state.items.filter(item => item.product.id !== productId);
        },
        decreaseQuantity: (state, action: PayloadAction<number>) => {
            const productId = action.payload;
            const item = state.items.find(item => item.product.id === productId);
            if (item) {
                if (item.count > 1) {
                    item.count -= 1;
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        }
    },
});

export const { addToCart, removeFromCart, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

//Sepetteki ürünleri tutar.
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Supplier } from '../../types';

interface SupplierState {
    list: Supplier[];
}

const initialState: SupplierState = {
    list: [],
};

const supplierSlice = createSlice({
    name: 'supplier',
    initialState,
    reducers: {
        setSuppliers: (state, action: PayloadAction<Supplier[]>) => {
            state.list = action.payload;
        },
        addSupplier: (state, action: PayloadAction<Supplier>) => {
            state.list.push(action.payload);
        },
        updateSupplier: (state, action: PayloadAction<Supplier>) => {
            const index = state.list.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
    },
});

export const { setSuppliers, addSupplier, updateSupplier } = supplierSlice.actions;
export default supplierSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Medicine } from '../../types';

interface MedicineState {
    list: Medicine[];
}

const initialState: MedicineState = {
    list: [],
};

const medicineSlice = createSlice({
    name: 'medicine',
    initialState,
    reducers: {
        setMedicines: (state, action: PayloadAction<Medicine[]>) => {
            state.list = action.payload;
        },
        addMedicine: (state, action: PayloadAction<Medicine>) => {
            state.list.push(action.payload);
        },
        updateMedicine: (state, action: PayloadAction<Medicine>) => {
            const index = state.list.findIndex(m => m.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        deleteMedicine: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter(m => m.id !== action.payload);
        }
    },
});

export const { setMedicines, addMedicine, updateMedicine, deleteMedicine } = medicineSlice.actions;
export default medicineSlice.reducer;

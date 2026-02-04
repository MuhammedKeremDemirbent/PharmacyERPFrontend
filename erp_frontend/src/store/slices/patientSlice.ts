import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Patient } from '../../types';

interface PatientState {
    list: Patient[];
}

const initialState: PatientState = {
    list: [],
};

const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {
        setPatients: (state, action: PayloadAction<Patient[]>) => {
            state.list = action.payload;
        },
        addPatient: (state, action: PayloadAction<Patient>) => {
            state.list.push(action.payload);
        },
    },
});

export const { setPatients, addPatient } = patientSlice.actions;
export default patientSlice.reducer;

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  login: [],
  medicalRecord: []
}

export const slices = createSlice({
  name: "appReducers",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.login = action.payload;
    },
    setMedicalRecord: (state, action) => {
      state.medicalRecord = action.payload;
    }
  }
});

export const { setLogin, setMedicalRecord } = slices.actions;


export const getLogin = (state) => state.appReducers.login;
export const getMedicalRecord = (state) => state.appReducers.medicalRecord;


export default slices.reducer;
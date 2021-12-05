import {createSlice} from "@reduxjs/toolkit";

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        value: []
    },
    reducers: {
        modifyChart: (state, action)=>{
            let temp = state.value;
            temp[action.index] = action.chart;
            state.value = temp;
        },
        createState: ((state, action) => {
            state.value = action.payload;
        })
    }
})

export const {modifyState, createState} = dashboardSlice.actions
export default dashboardSlice.reducer

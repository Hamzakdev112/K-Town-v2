import { createSlice } from "@reduxjs/toolkit";


const ordersSlice = createSlice({
    name:"Orders",
    initialState:{
        isFetching:false,
        error:null,
        orders:null
    },
    reducers:{
        getAllOrdersStart:(state)=>{
            state.isFetching = true;
        },
        getAllOrdersSuccess:(state, action)=>{
            state.isFetching = false;
            state.error = null;
            state.orders = action.payload;
        },
        getAllOrdersFailure:(state, action)=>{
            state.isFetching = true;
            state.error = action.payload;
        },
    }
})

export const  {getAllOrdersStart, getAllOrdersSuccess, getAllOrdersFailure} = ordersSlice.actions;
export default ordersSlice.reducer

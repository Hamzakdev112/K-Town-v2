import { configureStore, combineReducers } from "@reduxjs/toolkit";
import ordersReducer from "./slices/ordersSlice";
const rootReducer = combineReducers({
    orders:ordersReducer,
})
export default  configureStore({
    reducer:rootReducer
})

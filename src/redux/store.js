import { configureStore } from "@reduxjs/toolkit"
import metricsReducer from "./reducers/metricsSlice";

export const store = configureStore({
    reducer: {
        metrics: metricsReducer
    }
});
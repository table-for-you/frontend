import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from './auth';

export default configureStore({
    reducer: {
        authToken: tokenReducer
    }
})
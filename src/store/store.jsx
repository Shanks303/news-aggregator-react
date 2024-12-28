import { configureStore } from "@reduxjs/toolkit";
import articlesReducer from './articles/articlesSlice';

export const store = configureStore({
    reducer: {
        articles: articlesReducer
    }
})
import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import subCategoriesReducer from "./subCategoriesSlice";

export const store = configureStore({
    reducer:{
        subCategories : subCategoriesReducer,
        products: productsReducer
    }
});
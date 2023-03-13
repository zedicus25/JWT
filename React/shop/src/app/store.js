import { configureStore } from "@reduxjs/toolkit";
import categoriesSlice from "./categoriesSlice";
import productsReducer from "./productsSlice";
import subCategoriesReducer from "./subCategoriesSlice";

export const store = configureStore({
    reducer:{
        subCategories : subCategoriesReducer,
        products: productsReducer,
        categories: categoriesSlice
    }
});
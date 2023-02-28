import api from '../apiAccess';

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';


export const getAsync = createAsyncThunk(
    'products/getAll',
    async () => {
        const res = await api.getAllAssets();
        return res;
    }
);

export const getPopularAsync = createAsyncThunk(
    'products/getPopulars',
    async () => {
        const res = await api.getPopularAssets();
        return res;
    }
)

export const getProductsInCategory = createAsyncThunk(
    'products/getProductsInCategory',
    async(state) => {
        const res = await api.getProductsInCategory(state);
        return res;
    }
)

export const productsSlice = createSlice({
    name: 'products',
    initialState: {
        values : [],
        status: 'idle'
    },
    extraReducers:(builder) => {
        builder.addCase(getAsync.pending, (state) =>{
                state.status = 'loading';
            }).addCase(getAsync.fulfilled, (state, action) => {
                state.values = [];
                state.status = 'idle';
                state.values = action.payload;
            }).addCase(getPopularAsync.pending, (state) =>{
                state.status = 'loading';
            }).addCase(getPopularAsync.fulfilled, (state, action) => {
                state.values = [];
                state.status = 'idle';
                state.values = action.payload;
            }).addCase(getProductsInCategory.pending, (state) => {
                state.status = 'loading';
            }).addCase(getProductsInCategory.fulfilled, (state, action) => {
                state.values = [];
                state.status = 'idle';
                state.values = action.payload;
            });
    }
});


export const selectValues = (state) => state.products.values;

export default productsSlice.reducer
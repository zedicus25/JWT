import api from '../apiAccess';

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

export const getAsync = createAsyncThunk(
    'categories/getAll',
    async () => {
        const res = await api.getCategories();
        return res;
    }
);

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        values : [],
        status: 'idle'
    },
    extraReducers:(builder) => {
        builder.addCase(getAsync.pending, (state) =>{
                state.status = 'loading';
            }).addCase(getAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.values = action.payload;
            });
    }
});


export const selectValues = (state) => state.categories.values;

export default categoriesSlice.reducer

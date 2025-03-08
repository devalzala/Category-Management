import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getApisHeaders } from "../utils/utils";

export const createCategory = createAsyncThunk(
    "category/createCategory",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/category`,
                data,
                getApisHeaders()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API}/category/${data.id}`,
                data,
                getApisHeaders()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_API}/category/${data.id}`,
                getApisHeaders()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const getCategories = createAsyncThunk(
    "category/getCategories",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_API}/category`,
                getApisHeaders()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const getCategoryById = createAsyncThunk(
    "category/getCategoryById",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_API}/category/getcategorybyid/${data.id}`,
                getApisHeaders()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const searchCategory = createAsyncThunk(
    "category/searchCategory",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/category/searchcategory`,
                data,
                getApisHeaders()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
        category: {},
        loading: false,
        error: null,
    },
    reducers: {}, // Keep empty if no synchronous reducers
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.data; // Store the authenticated user data
                state.error = null;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.category = action.payload.data; // Store the authenticated user data
                state.error = null;
            })
            .addCase(getCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default categorySlice.reducer;
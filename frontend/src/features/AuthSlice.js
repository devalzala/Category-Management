import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
    "auth/login",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/auth/login`,
                data
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Login failed");
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/auth/register`,
                data
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Register failed");
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        auth: null,
        loading: false,
        error: null,
    },
    reducers: {}, // Keep empty if no synchronous reducers
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.auth = action.payload; // Store the authenticated user data
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.auth = action.payload; // Store the authenticated user data
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;
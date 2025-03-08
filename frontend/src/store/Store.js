import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/AuthSlice";
import categorySlice from "../features/CategorySlice";

const reducers = {
  authData: authSlice,
  categoryData: categorySlice
};

export const store = configureStore({
  reducer: reducers,
});
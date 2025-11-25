import { createSlice } from "@reduxjs/toolkit";

const saved = localStorage.getItem("auth");

const initialState =
  saved !== null
    ? JSON.parse(saved)
    : {
        user: null,
        accessToken: null,
        refreshToken: null,
        status: "idle",
        error: null,
      };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken || null;
      state.refreshToken = refreshToken || null;
      localStorage.setItem("auth", JSON.stringify(state));
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("auth");
    },
    setAuthError(state, action) {
      state.error = action.payload || null;
    },
    setAuthStatus(state, action) {
      state.status = action.payload || "idle";
    },
  },
});

export const { setCredentials, logout, setAuthError, setAuthStatus } =
  authSlice.actions;

export default authSlice.reducer;

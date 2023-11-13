import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState{
  role: boolean | null;
  token: string | null;
}

interface setAuthDataPayload{
  role: boolean;
  token: string;
}

const initialState: AuthState = {
  role: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<setAuthDataPayload>) => {
      state.role = action.payload.role;
      state.token = action.payload.token;
    }
  }
})

export const { setAuthData } = authSlice.actions;
export default authSlice.reducer;
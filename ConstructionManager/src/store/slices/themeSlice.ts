import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '@/types';
import { lightTheme, darkTheme } from '@/utils/theme';

interface ThemeState {
  isDark: boolean;
  theme: Theme;
}

const initialState: ThemeState = {
  isDark: false,
  theme: lightTheme,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      state.theme = state.isDark ? darkTheme : lightTheme;
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
      state.theme = action.payload ? darkTheme : lightTheme;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
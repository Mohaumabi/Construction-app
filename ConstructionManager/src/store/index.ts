import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import slices
import authSlice from './slices/authSlice';
import themeSlice from './slices/themeSlice';
import projectSlice from './slices/projectSlice';
import teamSlice from './slices/teamSlice';
import payrollSlice from './slices/payrollSlice';
import notificationSlice from './slices/notificationSlice';
import calendarSlice from './slices/calendarSlice';
import reportsSlice from './slices/reportsSlice';

// Import middleware
import { realtimeMiddleware } from './middleware/realtimeMiddleware';
import { loggingMiddleware } from './middleware/loggingMiddleware';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'theme'], // Only persist auth and theme
};

const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  projects: projectSlice,
  teams: teamSlice,
  payroll: payrollSlice,
  notifications: notificationSlice,
  calendar: calendarSlice,
  reports: reportsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    })
      .concat(realtimeMiddleware)
      .concat(loggingMiddleware),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CalendarEvent } from '@/types';
import { supabase, TABLES } from '@/services/supabase';

interface CalendarState {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  syncStatus: {
    google: boolean;
    outlook: boolean;
    apple: boolean;
  };
}

const initialState: CalendarState = {
  events: [],
  isLoading: false,
  error: null,
  syncStatus: {
    google: false,
    outlook: false,
    apple: false,
  },
};

export const fetchCalendarEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CALENDAR_EVENTS)
        .select('*')
        .gte('startDate', startDate)
        .lte('endDate', endDate)
        .order('startDate', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCalendarEvent = createAsyncThunk(
  'calendar/createEvent',
  async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CALENDAR_EVENTS)
        .insert(eventData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSyncStatus: (state, action) => {
      state.syncStatus = { ...state.syncStatus, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
      })
      .addCase(fetchCalendarEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createCalendarEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
        state.events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      });
  },
});

export const { clearError, setSyncStatus } = calendarSlice.actions;
export default calendarSlice.reducer;
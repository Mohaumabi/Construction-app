import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FortnightlyReport } from '@/types';
import { supabase, TABLES } from '@/services/supabase';

interface ReportsState {
  reports: FortnightlyReport[];
  currentReport: FortnightlyReport | null;
  isLoading: boolean;
  error: string | null;
  isGenerating: boolean;
}

const initialState: ReportsState = {
  reports: [],
  currentReport: null,
  isLoading: false,
  error: null,
  isGenerating: false,
};

export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (projectId: string | undefined, { rejectWithValue }) => {
    try {
      let query = supabase
        .from(TABLES.FORTNIGHTLY_REPORTS)
        .select('*, project:projects(*)');

      if (projectId) {
        query = query.eq('projectId', projectId);
      }

      const { data, error } = await query.order('periodStart', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateReport = createAsyncThunk(
  'reports/generateReport',
  async (reportData: Omit<FortnightlyReport, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.FORTNIGHTLY_REPORTS)
        .insert(reportData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentReport: (state, action) => {
      state.currentReport = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(generateReport.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.reports.unshift(action.payload);
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentReport } = reportsSlice.actions;
export default reportsSlice.reducer;
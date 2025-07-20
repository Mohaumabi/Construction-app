import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PayrollRecord, WorkRecord } from '@/types';
import { supabase, TABLES } from '@/services/supabase';

interface PayrollState {
  payrollRecords: PayrollRecord[];
  workRecords: WorkRecord[];
  currentPayroll: PayrollRecord | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PayrollState = {
  payrollRecords: [],
  workRecords: [],
  currentPayroll: null,
  isLoading: false,
  error: null,
};

export const fetchWorkRecords = createAsyncThunk(
  'payroll/fetchWorkRecords',
  async ({ userId, projectId }: { userId?: string; projectId?: string }, { rejectWithValue }) => {
    try {
      let query = supabase
        .from(TABLES.WORK_RECORDS)
        .select('*, user:users(*), project:projects(*)');

      if (userId) query = query.eq('userId', userId);
      if (projectId) query = query.eq('projectId', projectId);

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createWorkRecord = createAsyncThunk(
  'payroll/createWorkRecord',
  async (workData: Omit<WorkRecord, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.WORK_RECORDS)
        .insert(workData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPayrollRecords = createAsyncThunk(
  'payroll/fetchPayrollRecords',
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      let query = supabase
        .from(TABLES.PAYROLL_RECORDS)
        .select('*, user:users(*)');

      if (userId) query = query.eq('userId', userId);

      const { data, error } = await query.order('periodStart', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workRecords = action.payload;
      })
      .addCase(fetchWorkRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createWorkRecord.fulfilled, (state, action) => {
        state.workRecords.unshift(action.payload);
      })
      .addCase(fetchPayrollRecords.fulfilled, (state, action) => {
        state.payrollRecords = action.payload;
      });
  },
});

export const { clearError } = payrollSlice.actions;
export default payrollSlice.reducer;
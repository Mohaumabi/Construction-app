import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Team, User } from '@/types';
import { supabase, TABLES } from '@/services/supabase';

interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  teams: [],
  currentTeam: null,
  teamMembers: [],
  isLoading: false,
  error: null,
};

export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEAMS)
        .select('*, members:team_members(*, user:users(*))')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTeamById = createAsyncThunk(
  'teams/fetchTeamById',
  async (teamId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEAMS)
        .select('*, members:team_members(*, user:users(*))')
        .eq('id', teamId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEAMS)
        .insert(teamData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.currentTeam = action.payload;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.unshift(action.payload);
      });
  },
});

export const { clearError } = teamSlice.actions;
export default teamSlice.reducer;
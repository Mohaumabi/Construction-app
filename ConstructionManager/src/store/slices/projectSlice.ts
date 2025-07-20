import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Project, ProjectStatus, ProjectTimeline, PaginatedResponse } from '@/types';
import { supabase, TABLES } from '@/services/supabase';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  timeline: ProjectTimeline[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  timeline: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  hasMore: true,
};

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      const { data, error, count } = await supabase
        .from(TABLES.PROJECTS)
        .select('*, timeline:project_timelines(*)', { count: 'exact' })
        .range(start, end)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0,
        page,
        limit,
        hasMore: (count || 0) > end + 1,
      } as PaginatedResponse<Project>;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select('*, timeline:project_timelines(*)')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .insert(projectData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, updates }: { id: string; updates: Partial<Project> }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from(TABLES.PROJECTS)
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      return projectId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  'projects/updateStatus',
  async ({ projectId, status }: { projectId: string; status: ProjectStatus }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .update({ status })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProjectTimeline = createAsyncThunk(
  'projects/fetchTimeline',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECT_TIMELINES)
        .select('*')
        .eq('projectId', projectId)
        .order('startDate', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTimelineItem = createAsyncThunk(
  'projects/createTimelineItem',
  async (timelineData: Omit<ProjectTimeline, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECT_TIMELINES)
        .insert(timelineData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTimelineItem = createAsyncThunk(
  'projects/updateTimelineItem',
  async ({ id, updates }: { id: string; updates: Partial<ProjectTimeline> }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECT_TIMELINES)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    clearProjects: (state) => {
      state.projects = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.totalCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.page === 1) {
          state.projects = action.payload.data;
        } else {
          state.projects.push(...action.payload.data);
        }
        state.totalCount = action.payload.total;
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch project by ID
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })

      // Create project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
        state.totalCount += 1;
      })

      // Update project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })

      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
        state.totalCount -= 1;
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null;
        }
      })

      // Update project status
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })

      // Fetch timeline
      .addCase(fetchProjectTimeline.fulfilled, (state, action) => {
        state.timeline = action.payload;
      })

      // Create timeline item
      .addCase(createTimelineItem.fulfilled, (state, action) => {
        state.timeline.push(action.payload);
        state.timeline.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      })

      // Update timeline item
      .addCase(updateTimelineItem.fulfilled, (state, action) => {
        const index = state.timeline.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.timeline[index] = action.payload;
        }
      });
  },
});

export const { clearError, setCurrentProject, clearProjects } = projectSlice.actions;
export default projectSlice.reducer;
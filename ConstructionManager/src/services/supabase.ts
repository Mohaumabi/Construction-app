import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { AppConfig } from '@/types';

// Configuration - These should be moved to environment variables
const supabaseConfig: Pick<AppConfig, 'supabaseUrl' | 'supabaseAnonKey'> = {
  supabaseUrl: 'YOUR_SUPABASE_URL', // Replace with your Supabase URL
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY', // Replace with your Supabase anon key
};

// Custom storage adapter for Expo SecureStore
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Create Supabase client
export const supabase: SupabaseClient = createClient(
  supabaseConfig.supabaseUrl,
  supabaseConfig.supabaseAnonKey,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Database table names
export const TABLES = {
  USERS: 'users',
  PROJECTS: 'projects',
  PROJECT_TIMELINES: 'project_timelines',
  TEAMS: 'teams',
  TEAM_MEMBERS: 'team_members',
  WORK_RECORDS: 'work_records',
  PAYROLL_RECORDS: 'payroll_records',
  FORTNIGHTLY_REPORTS: 'fortnightly_reports',
  NOTIFICATIONS: 'notifications',
  CALENDAR_EVENTS: 'calendar_events',
  AUDIT_LOGS: 'audit_logs',
} as const;

// Real-time subscriptions
export const subscribeToTable = (
  table: string,
  callback: (payload: any) => void,
  filter?: string
) => {
  const subscription = supabase
    .channel(`public:${table}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        filter,
      },
      callback
    )
    .subscribe();

  return subscription;
};

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Database helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from(TABLES.USERS)
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from(TABLES.USERS)
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Error handler
export const handleSupabaseError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
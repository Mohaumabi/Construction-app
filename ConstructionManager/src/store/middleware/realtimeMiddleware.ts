import { Middleware } from '@reduxjs/toolkit';
import { subscribeToTable, TABLES } from '@/services/supabase';
import { addNotification } from '../slices/notificationSlice';

export const realtimeMiddleware: Middleware = (store) => {
  const subscriptions: any[] = [];

  return (next) => (action: any) => {
    const result = next(action);

    // Initialize real-time subscriptions when auth is successful
    if (action.type === 'auth/signInWithEmail/fulfilled' || 
        action.type === 'auth/initializeAuth/fulfilled') {
      
      const state = store.getState() as any;
      const userId = state.auth.user?.id;

      if (userId) {
        // Subscribe to notifications
        const notificationSub = subscribeToTable(
          TABLES.NOTIFICATIONS,
          (payload) => {
            if (payload.new && payload.new.userId === userId) {
              store.dispatch(addNotification(payload.new));
            }
          },
          `userId=eq.${userId}`
        );
        subscriptions.push(notificationSub);

        // Subscribe to project updates
        const projectSub = subscribeToTable(
          TABLES.PROJECTS,
          (payload) => {
            // Handle project updates
            console.log('Project update:', payload);
          }
        );
        subscriptions.push(projectSub);

        // Subscribe to work records
        const workRecordSub = subscribeToTable(
          TABLES.WORK_RECORDS,
          (payload) => {
            // Handle work record updates
            console.log('Work record update:', payload);
          }
        );
        subscriptions.push(workRecordSub);
      }
    }

    // Clean up subscriptions on sign out
    if (action.type === 'auth/signOutUser/fulfilled') {
      subscriptions.forEach(sub => {
        if (sub && typeof sub.unsubscribe === 'function') {
          sub.unsubscribe();
        }
      });
      subscriptions.length = 0;
    }

    return result;
  };
};
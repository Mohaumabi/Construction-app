import { Middleware } from '@reduxjs/toolkit';
import { supabase, TABLES } from '@/services/supabase';

export const loggingMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  // Log sensitive actions for POPIA compliance
  const sensitiveActions = [
    'auth/signInWithEmail/fulfilled',
    'auth/signUpWithEmail/fulfilled',
    'auth/updateProfile/fulfilled',
    'projects/createProject/fulfilled',
    'projects/updateProject/fulfilled',
    'projects/deleteProject/fulfilled',
    'payroll/createWorkRecord/fulfilled',
    'teams/createTeam/fulfilled',
  ];

  if (sensitiveActions.includes(action.type)) {
    const state = store.getState() as any;
    const userId = state.auth.user?.id;

    if (userId) {
      // Create audit log entry
      const auditLog = {
        userId,
        action: action.type,
        resourceType: getResourceTypeFromAction(action.type),
        resourceId: action.payload?.id || 'unknown',
        newValues: action.payload,
        ipAddress: 'unknown', // Would need to be passed from client
        userAgent: 'unknown', // Would need to be passed from client
        timestamp: new Date().toISOString(),
      };

      // Log to Supabase (fire and forget)
      supabase
        .from(TABLES.AUDIT_LOGS)
        .insert(auditLog)
        .then(({ error }) => {
          if (error) {
            console.error('Failed to create audit log:', error);
          }
        });
    }
  }

  // Log errors for debugging
  if (action.type.endsWith('/rejected')) {
    console.error('Redux action failed:', {
      type: action.type,
      error: action.payload,
      timestamp: new Date().toISOString(),
    });
  }

  return result;
};

function getResourceTypeFromAction(actionType: string): string {
  if (actionType.includes('auth')) return 'user';
  if (actionType.includes('project')) return 'project';
  if (actionType.includes('team')) return 'team';
  if (actionType.includes('payroll')) return 'payroll';
  if (actionType.includes('notification')) return 'notification';
  if (actionType.includes('calendar')) return 'calendar';
  if (actionType.includes('report')) return 'report';
  return 'unknown';
}
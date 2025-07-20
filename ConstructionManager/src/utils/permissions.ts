import { UserRole } from '@/types';

export interface Permission {
  resource: string;
  action: string;
  roles: UserRole[];
}

// Define permissions for different resources and actions
export const PERMISSIONS: Permission[] = [
  // Project permissions
  {
    resource: 'projects',
    action: 'view',
    roles: [
      UserRole.OWNER,
      UserRole.PROJECT_MANAGER,
      UserRole.SITE_FOREMAN,
      UserRole.SUPERVISOR,
      UserRole.CLIENT_INVESTOR,
      UserRole.ACCOUNTANT,
    ],
  },
  {
    resource: 'projects',
    action: 'create',
    roles: [UserRole.OWNER, UserRole.PROJECT_MANAGER],
  },
  {
    resource: 'projects',
    action: 'edit',
    roles: [UserRole.OWNER, UserRole.PROJECT_MANAGER],
  },
  {
    resource: 'projects',
    action: 'delete',
    roles: [UserRole.OWNER],
  },

  // Team permissions
  {
    resource: 'teams',
    action: 'view',
    roles: [
      UserRole.OWNER,
      UserRole.PROJECT_MANAGER,
      UserRole.SITE_FOREMAN,
      UserRole.HR_MANAGER,
      UserRole.SUPERVISOR,
    ],
  },
  {
    resource: 'teams',
    action: 'create',
    roles: [UserRole.OWNER, UserRole.PROJECT_MANAGER, UserRole.HR_MANAGER],
  },
  {
    resource: 'teams',
    action: 'edit',
    roles: [UserRole.OWNER, UserRole.PROJECT_MANAGER, UserRole.HR_MANAGER],
  },
  {
    resource: 'teams',
    action: 'delete',
    roles: [UserRole.OWNER, UserRole.HR_MANAGER],
  },

  // Payroll permissions
  {
    resource: 'payroll',
    action: 'view_own',
    roles: Object.values(UserRole), // All users can view their own payroll
  },
  {
    resource: 'payroll',
    action: 'view_all',
    roles: [UserRole.OWNER, UserRole.ACCOUNTANT, UserRole.HR_MANAGER],
  },
  {
    resource: 'payroll',
    action: 'create',
    roles: [UserRole.OWNER, UserRole.ACCOUNTANT, UserRole.HR_MANAGER],
  },
  {
    resource: 'payroll',
    action: 'approve',
    roles: [UserRole.OWNER, UserRole.ACCOUNTANT],
  },

  // Work records permissions
  {
    resource: 'work_records',
    action: 'create_own',
    roles: [
      UserRole.SITE_WORKER,
      UserRole.SUPERVISOR,
      UserRole.SITE_FOREMAN,
      UserRole.SUBCONTRACTOR,
    ],
  },
  {
    resource: 'work_records',
    action: 'view_all',
    roles: [
      UserRole.OWNER,
      UserRole.PROJECT_MANAGER,
      UserRole.SITE_FOREMAN,
      UserRole.ACCOUNTANT,
    ],
  },
  {
    resource: 'work_records',
    action: 'approve',
    roles: [UserRole.OWNER, UserRole.PROJECT_MANAGER, UserRole.SITE_FOREMAN],
  },

  // Reports permissions
  {
    resource: 'reports',
    action: 'view',
    roles: [
      UserRole.OWNER,
      UserRole.PROJECT_MANAGER,
      UserRole.ACCOUNTANT,
      UserRole.CLIENT_INVESTOR,
    ],
  },
  {
    resource: 'reports',
    action: 'generate',
    roles: [UserRole.OWNER, UserRole.PROJECT_MANAGER, UserRole.SITE_FOREMAN],
  },

  // Calendar permissions
  {
    resource: 'calendar',
    action: 'view',
    roles: Object.values(UserRole), // All users can view calendar
  },
  {
    resource: 'calendar',
    action: 'create',
    roles: [
      UserRole.OWNER,
      UserRole.PROJECT_MANAGER,
      UserRole.SITE_FOREMAN,
      UserRole.HR_MANAGER,
    ],
  },

  // User management permissions
  {
    resource: 'users',
    action: 'view',
    roles: [UserRole.OWNER, UserRole.HR_MANAGER, UserRole.PROJECT_MANAGER],
  },
  {
    resource: 'users',
    action: 'create',
    roles: [UserRole.OWNER, UserRole.HR_MANAGER],
  },
  {
    resource: 'users',
    action: 'edit',
    roles: [UserRole.OWNER, UserRole.HR_MANAGER],
  },
  {
    resource: 'users',
    action: 'delete',
    roles: [UserRole.OWNER],
  },
];

export const hasPermission = (
  userRole: UserRole,
  resource: string,
  action: string
): boolean => {
  const permission = PERMISSIONS.find(
    (p) => p.resource === resource && p.action === action
  );

  if (!permission) {
    console.warn(`Permission not found for ${resource}:${action}`);
    return false;
  }

  return permission.roles.includes(userRole);
};

export const filterByPermission = <T extends { id: string }>(
  items: T[],
  userRole: UserRole,
  resource: string,
  action: string
): T[] => {
  if (!hasPermission(userRole, resource, action)) {
    return [];
  }
  return items;
};

export const canViewResource = (userRole: UserRole, resource: string): boolean => {
  return hasPermission(userRole, resource, 'view');
};

export const canEditResource = (userRole: UserRole, resource: string): boolean => {
  return hasPermission(userRole, resource, 'edit');
};

export const canCreateResource = (userRole: UserRole, resource: string): boolean => {
  return hasPermission(userRole, resource, 'create');
};

export const canDeleteResource = (userRole: UserRole, resource: string): boolean => {
  return hasPermission(userRole, resource, 'delete');
};

// Helper function to get user role display name
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    [UserRole.OWNER]: 'Owner',
    [UserRole.PROJECT_MANAGER]: 'Project Manager',
    [UserRole.SITE_FOREMAN]: 'Site Foreman',
    [UserRole.SUPERVISOR]: 'Supervisor',
    [UserRole.SITE_WORKER]: 'Site Worker',
    [UserRole.ACCOUNTANT]: 'Accountant',
    [UserRole.HR_MANAGER]: 'HR Manager',
    [UserRole.ADMIN_ASSISTANT]: 'Admin Assistant',
    [UserRole.SUBCONTRACTOR]: 'Subcontractor',
    [UserRole.CLIENT_INVESTOR]: 'Client/Investor',
  };

  return roleNames[role] || role;
};

// Helper function to check if user can access sensitive data
export const canAccessSensitiveData = (userRole: UserRole): boolean => {
  const sensitiveRoles = [
    UserRole.OWNER,
    UserRole.ACCOUNTANT,
    UserRole.HR_MANAGER,
  ];
  return sensitiveRoles.includes(userRole);
};

// Helper function to check if user needs MFA
export const requiresMFA = (userRole: UserRole): boolean => {
  const mfaRequiredRoles = [
    UserRole.OWNER,
    UserRole.ACCOUNTANT,
    UserRole.HR_MANAGER,
  ];
  return mfaRequiredRoles.includes(userRole);
};
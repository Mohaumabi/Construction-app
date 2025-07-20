export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  OWNER = 'owner',
  PROJECT_MANAGER = 'project_manager',
  SITE_FOREMAN = 'site_foreman',
  SUPERVISOR = 'supervisor',
  SITE_WORKER = 'site_worker',
  ACCOUNTANT = 'accountant',
  HR_MANAGER = 'hr_manager',
  ADMIN_ASSISTANT = 'admin_assistant',
  SUBCONTRACTOR = 'subcontractor',
  CLIENT_INVESTOR = 'client_investor',
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  address: string;
  startDate: string;
  endDate: string;
  estimatedCost: number;
  actualCost: number;
  revenue: number;
  status: ProjectStatus;
  progress: number;
  clientId: string;
  managerId: string;
  foremanId?: string;
  teamMembers: string[];
  timeline: ProjectTimeline[];
  createdAt: string;
  updatedAt: string;
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface ProjectTimeline {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: TimelineStatus;
  assignedTo: string[];
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
}

export enum TimelineStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
  BLOCKED = 'blocked',
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  leaderId: string;
  members: TeamMember[];
  projectIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  userId: string;
  role: UserRole;
  hourlyRate: number;
  joinedAt: string;
  isActive: boolean;
}

export interface WorkRecord {
  id: string;
  userId: string;
  projectId: string;
  date: string;
  hoursWorked: number;
  description: string;
  taskType: string;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  periodStart: string;
  periodEnd: string;
  regularHours: number;
  overtimeHours: number;
  regularRate: number;
  overtimeRate: number;
  grossPay: number;
  deductions: PayrollDeduction[];
  netPay: number;
  status: PayrollStatus;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollDeduction {
  type: DeductionType;
  amount: number;
  description?: string;
}

export enum DeductionType {
  TAX = 'tax',
  UIF = 'uif',
  MEDICAL_AID = 'medical_aid',
  PENSION = 'pension',
  OTHER = 'other',
}

export enum PayrollStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  PAID = 'paid',
  REJECTED = 'rejected',
}

export interface FortnightlyReport {
  id: string;
  projectId: string;
  periodStart: string;
  periodEnd: string;
  summary: string;
  progressAchieved: number;
  costIncurred: number;
  issuesEncountered: string[];
  nextSteps: string[];
  photos: string[];
  generatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum NotificationType {
  PROJECT_UPDATE = 'project_update',
  TIMELINE_CHANGE = 'timeline_change',
  PAYROLL_READY = 'payroll_ready',
  REPORT_GENERATED = 'report_generated',
  SYSTEM_ALERT = 'system_alert',
  CALENDAR_REMINDER = 'calendar_reminder',
  TASK_ASSIGNMENT = 'task_assignment',
  APPROVAL_REQUEST = 'approval_request',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  isAllDay: boolean;
  location?: string;
  projectId?: string;
  attendees: string[];
  reminderMinutes: number[];
  source: CalendarSource;
  externalId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export enum CalendarSource {
  INTERNAL = 'internal',
  GOOGLE = 'google',
  OUTLOOK = 'outlook',
  APPLE = 'apple',
}

export interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    alert: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    card: string;
    success: string;
    warning: string;
    error: string;
  };
}

export interface AppConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  sendgridApiKey: string;
  twilioConfig: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
  };
  googleCalendarConfig: {
    clientId: string;
    clientSecret: string;
  };
  encryptionKey: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface FormErrors {
  [key: string]: string | undefined;
}
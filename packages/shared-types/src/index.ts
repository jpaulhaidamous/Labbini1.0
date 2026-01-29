// User & Auth Types
export enum UserRole {
  CLIENT = 'CLIENT',
  FREELANCER = 'FREELANCER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  displayNameEn: string;
  displayNameAr?: string;
}

// Profile Types
export interface Profile {
  id: string;
  userId: string;
  displayNameEn: string;
  displayNameAr: string | null;
  bioEn: string | null;
  bioAr: string | null;
  avatarUrl: string | null;
  governorate: string | null;
  city: string | null;
  hourlyRate: number | null;
  isAvailable: boolean;
  jobSuccessScore: number;
  totalJobsCompleted: number;
  totalEarned: string;
}

// Job Types
export enum JobType {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY',
  QUICK_TASK = 'QUICK_TASK',
}

export enum JobStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum LocationType {
  REMOTE = 'REMOTE',
  ONSITE = 'ONSITE',
  HYBRID = 'HYBRID',
}

export interface Job {
  id: string;
  clientId: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  jobType: JobType;
  status: JobStatus;
  budgetType: string;
  budgetMin: number | null;
  budgetMax: number | null;
  budgetFixed: number | null;
  locationType: LocationType;
  governorate: string | null;
  city: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Proposal Types
export enum ProposalStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  coverLetterEn: string;
  coverLetterAr: string | null;
  proposedRate: number;
  estimatedDuration: number;
  status: ProposalStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Contract Types
export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
}

export interface Contract {
  id: string;
  jobId: string;
  freelancerId: string;
  clientId: string;
  proposalId: string;
  agreedRate: number;
  startDate: Date;
  endDate: Date | null;
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
export enum PaymentStatus {
  PENDING = 'PENDING',
  HELD = 'HELD',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CARD = 'CARD',
  WHISH = 'WHISH',
  OMT = 'OMT',
}

export interface Payment {
  id: string;
  contractId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Lebanese Governorates
export const LEBANESE_GOVERNORATES = [
  'Beirut',
  'Mount Lebanon',
  'North',
  'South',
  'Beqaa',
  'Nabatieh',
  'Akkar',
  'Baalbek-Hermel',
] as const;

export type LebanonGovernorate = typeof LEBANESE_GOVERNORATES[number];

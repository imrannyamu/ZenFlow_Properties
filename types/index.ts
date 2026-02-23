
import React from 'react';

export type UserRole = 'FOUNDER' | 'LANDLORD' | 'MANAGER' | 'TENANT' | 'SERVICE_PROVIDER';

export interface TenantDocument {
  id: string;
  name: string;
  type: 'Lease' | 'Invoice' | 'Receipt' | 'ID' | 'Utility';
  date: string;
  size: string;
}

export interface Payment {
  id: string;
  amount: number;
  month: string;
  method: 'M-Pesa' | 'Cash' | 'Bank';
  reference: string;
  date: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  balance: number;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  idNumber: string;
  unit: string;
  phone: string;
  rentAmount: number;
  depositHeld?: number;
  depositStatus?: 'Held' | 'Refunded' | 'Deducted';
  moveInPhotos?: string[];
  moveInReportPhotos?: Record<string, string>; // Mapping room names to photo URLs
  conditionReportSubmitted?: boolean;
  conditionReportDate?: string;
  dueDate: number; // Day of the month (1-31)
  leaseStart: string;
  leaseEnd: string;
  status: 'Active' | 'Vacated' | 'Late' | 'Paid' | 'Partial' | 'Prospectus';
  lastPaymentDate?: string;
  documents?: TenantDocument[];
  payments?: Payment[];
  ledger?: LedgerEntry[];
  waterBill?: number;
  serviceCharge?: number;
  lastBilledDate?: string;
  lateFees?: number;
}

export interface Alert {
  id: number;
  message: string;
  type: 'rent' | 'lease' | 'maintenance';
  severity: 'high' | 'medium' | 'low';
  isResolved: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'payment' | 'inquiry' | 'lease' | 'document' | 'support' | 'billing';
  timestamp: string;
  isRead: boolean;
  link: string;
  count?: number;
}

export type LeadStatus = 'New' | 'Contacted' | 'Viewing' | 'Interested';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  idNumber: string;
  interestedProperty: string;
  interestedUnit: string;
  source: 'Facebook' | 'Walk-in' | 'Website' | 'Referral';
  status: LeadStatus;
  unitType: string;
  unitRent: number;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  ip: string;
  status: 'SUCCESS' | 'WARNING' | 'INFO';
}

export type SupportIssueType = 'Payment not reflecting' | 'STK Push failed' | 'Wrong Amount' | 'General Inquiry';

export interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
  variant?: 'emerald' | 'rose' | 'slate';
}

export interface MaintenanceTicket {
  id: string;
  title: string;
  description: string;
  unit: string;
  priority: 'Routine' | 'Urgent' | 'Emergency';
  status: 'Pending' | 'In Progress' | 'Completed';
  contractorId?: string;
  createdAt: string;
  priceOffered?: number;
  deadline?: string;
}

export interface Contractor {
  id: string;
  name: string;
  trade: string;
  phone: string;
}

export interface ProviderApplication {
  id: string;
  name: string;
  skill: string;
  idNumber: string;
  kraPin: string;
  location: string;
  phone: string;
  bio: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
}

export type ExpenseCategory = 'Maintenance' | 'Utilities' | 'Taxes' | 'Staff Wages' | 'Marketing' | 'Other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  recipient: string;
  receiptUrl?: string; 
}

export interface Unit {
  id: string;
  name: string;
  type: string;
  status: 'Occupied' | 'Vacant';
  tenantName?: string;
  monthlyRent: number;
  dueDate: number;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  units: Unit[];
}


import React from 'react';

export interface TenantDocument {
  id: string;
  name: string;
  type: 'Lease' | 'Invoice' | 'Receipt' | 'ID' | 'Utility';
  date: string;
  size: string;
}

export interface Tenant {
  id: string;
  name: string;
  unit: string;
  phone: string;
  amount: number;
  totalPaid: number;
  lateFees: number;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Arrears';
  leaseExpiryDate: string;
  dueDate: number; // Day of the month (1-31)
  documents?: TenantDocument[];
}

export interface Unit {
  id: string;
  name: string;
  type: 'Bedsitter' | '1BR' | '2BR' | 'Shop';
  status: 'Vacant' | 'Occupied';
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

export interface Expense {
  id: string;
  category: 'Maintenance' | 'Utilities' | 'Staff' | 'Taxes';
  description: string;
  amount: number;
  date: string;
  recipient: string;
}

export interface MaintenanceTicket {
  id: string;
  unit: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
  contractorId?: string;
}

export interface Contractor {
  id: string;
  name: string;
  trade: string;
}

export interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
  variant?: 'emerald' | 'rose' | 'slate';
}

export interface AutomationSettings {
  sendSmsReminder: boolean;
  alertOnLateRent: boolean;
  sendLeaseExpiryNotice: boolean;
  lateFeeAmount: number;
}

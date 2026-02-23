
/**
 * APP CONSTANTS
 * Centralized configuration for the ZenFlow platform.
 */

// REPLACE WITH DATABASE QUERY
export const INITIAL_PROPERTIES = [
  {
    id: 'p1',
    name: 'Zen Plaza',
    location: 'Westlands, Nairobi',
    units: [
      { id: 'u1', name: 'A1', type: 'Shop', status: 'Occupied', tenantName: 'James Kamau', monthlyRent: 25000, dueDate: 5 },
      { id: 'u2', name: 'A2', type: 'Shop', status: 'Vacant', monthlyRent: 22000, dueDate: 5 },
      { id: 'u3', name: 'B1', type: '1BR', status: 'Occupied', tenantName: 'Sarah Hassan', monthlyRent: 30000, dueDate: 5 },
      { id: 'u4', name: 'B2', type: '1BR', status: 'Vacant', monthlyRent: 28000, dueDate: 5 },
      { id: 'u5', name: 'B3', type: '1BR', status: 'Vacant', monthlyRent: 28000, dueDate: 5 },
      { id: 'u6', name: 'C1', type: '2BR', status: 'Occupied', tenantName: 'Moses Otieno', monthlyRent: 45000, dueDate: 5 },
    ],
  },
  {
    id: 'p2',
    name: 'Emerald Heights',
    location: 'Kilimani, Nairobi',
    units: [
      { id: 'u7', name: '101', type: 'Bedsitter', status: 'Occupied', tenantName: 'Jane Doe', monthlyRent: 15000, dueDate: 1 },
      { id: 'u8', name: '102', type: 'Bedsitter', status: 'Vacant', monthlyRent: 15000, dueDate: 1 },
    ],
  },
];

// REPLACE WITH DATABASE QUERY
export const INITIAL_LEADS = [
  {
    id: 'l1',
    name: 'John Doe',
    phone: '254700111222',
    email: 'john.doe@email.com',
    idNumber: '33221100',
    interestedProperty: 'Zen Plaza',
    interestedUnit: 'C2',
    source: 'Website',
    status: 'Pending Review',
    unitType: '2BR',
    unitRent: 45000,
    createdAt: '2026-02-01T10:00:00Z'
  },
  {
    id: 'l2',
    name: 'Sarah Wanjiku',
    phone: '254711222333',
    email: 'sarah.w@email.com',
    idNumber: '44556677',
    interestedProperty: 'Zen Plaza',
    interestedUnit: 'A5',
    source: 'Facebook',
    status: 'Background Check',
    unitType: 'Shop',
    unitRent: 25000,
    createdAt: '2026-02-03T14:30:00Z'
  },
  {
    id: 'l3',
    name: 'Kevin Otieno',
    phone: '254722333444',
    email: 'kevin.o@email.com',
    idNumber: '88990011',
    interestedProperty: 'Emerald Heights',
    interestedUnit: 'B1',
    source: 'Walk-in',
    status: 'Ready for Approval',
    unitType: 'Bedsitter',
    unitRent: 15000,
    createdAt: '2026-02-05T09:15:00Z'
  }
];

// REPLACE WITH DATABASE QUERY
export const INITIAL_TENANTS = [
  { 
    id: 't1', 
    name: 'John Kamau', 
    email: 'john.k@email.com',
    idNumber: '33445566',
    unit: 'A1', 
    phone: '254712345678', 
    rentAmount: 25000, 
    depositHeld: 25000,
    dueDate: 5, 
    leaseStart: '2025-01-01',
    leaseEnd: '2026-01-01',
    status: 'Paid',
    payments: []
  }
];

// REQUIRES AUTH INTEGRATION
export const FOUNDER_CREDENTIALS = {
  email: 'ZenflowFounder@gmail.com',
  password: 'Zenflow'
};

// REQUIRES PAYMENT VERIFICATION
export const MPESA_CONFIG = {
  PAYBILL: '4088222',
  BUSINESS_NAME: 'Zenflow Management'
};

// REPLACE WITH DATABASE QUERY
export const SUBSCRIPTION_PLANS = [
  {
    id: 'pro-digital',
    name: 'The Pro Digital',
    price: 3000,
    currency: 'KES',
    period: 'month',
    features: [
      "Up to 20 Property Units",
      "Native M-Pesa STK Integration",
      "Automated SMS Billing",
      "Digital Receipt Vault (KRA)",
      "AI Financial Intelligence",
      "Maintenance Portal Access"
    ]
  }
];

// REQUIRES BACKEND API ROUTE
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  PAYMENTS: '/api/payments',
  SMS: '/api/sms',
  PDF: '/api/pdf',
  TENANTS: '/api/tenants',
  PROPERTIES: '/api/properties',
  MAINTENANCE: '/api/maintenance'
};

// REPLACE WITH DATABASE QUERY
export const LANDING_STATS = [
  { label: "Units Managed", value: "500+", prefix: "" },
  { label: "Total Collected", value: "2M+", prefix: "KES " },
  { label: "Uptime", value: "99.9%", prefix: "" },
];

// REQUIRES ENV VARIABLE
export const SYSTEM_CONFIG = {
  DATE: '2026-02-15', // Mock System Date for demo logic
  LATE_FEE_DEFAULT: 500,
  GRACE_PERIOD_DEFAULT: 2
};

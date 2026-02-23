
/**
 * SMS SERVICE
 * REQUIRES ENV VARIABLE (e.g., Africa's Talking API Key, Twilio SID)
 */

export const smsService = {
  // TODO: Replace with backend API call
  // REQUIRES BACKEND API ROUTE
  sendSMS: async (phone: string, message: string): Promise<{ success: boolean }> => {
    console.log(`Sending SMS to ${phone}: ${message}`);
    
    // In frontend-only mode, we use window.location.href = 'sms:...'
    // In production, this should be a backend call to an SMS gateway
    
    return { success: true };
  },

  // Helper to format billing SMS
  formatBillingSMS: (data: {
    clientName: string,
    unit: string,
    account: string,
    month: string,
    year: number,
    rent: number,
    water: number,
    service: number,
    total: number,
    paybill: string,
    dueDate: string,
    generatedOn: string
  }) => {
    return `Zenflow Management
--------------------
Generated: ${data.generatedOn}
Client: ${data.clientName}
Unit: ${data.unit}
Acc No: ${data.account}
Month: ${data.month} ${data.year}

BILL BREAKDOWN:
- Rent: KES ${data.rent.toLocaleString()}
- Water: KES ${data.water.toLocaleString()}
- Service: KES ${data.service.toLocaleString()}

TOTAL DUE: KES ${data.total.toLocaleString()}

PAYMENT DETAILS:
- Paybill: ${data.paybill}
- Account: ${data.account}
- Due Date: ${data.dueDate}

Please pay promptly to avoid late fees.
Regards, Zenflow.`;
  }
};

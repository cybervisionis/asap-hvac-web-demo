export interface ServiceOffering {
  id: string;
  name: string;
  category: string;
  basePriceRange: string;
  description: string;
}

export interface MaintenancePlan {
  id: string;
  planTier: string;
  annualFee: number;
  includedServices: string[];
  partsDiscountPct: number;
  extras: string[];
}

export type QuoteStatus =
  | 'new'
  | 'awaiting-scheduling'
  | 'scheduled'
  | 'inspection-complete'
  | 'awaiting-approval'
  | 'approved'
  | 'declined';

export interface QuoteRequest {
  id: string;
  customerName: string;
  contactPhone: string;
  email: string;
  address: string;
  serviceType: string;
  urgency: 'low' | 'normal' | 'high';
  requestedDate: string;
  unitAgeYears?: number | null;
  symptoms: string[];
  notes?: string | null;
  status: QuoteStatus;
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'canceled';

export interface Appointment {
  id: string;
  quoteRequestId: string;
  scheduledDate: string;
  window: string;
  technician: string;
  status: AppointmentStatus;
}

export interface InspectionFinding {
  code: string;
  description: string;
  severity: 'low' | 'moderate' | 'high';
}

export interface InspectionAdjustment {
  description: string;
  cost: number;
}

export interface Inspection {
  id: string;
  quoteRequestId: string;
  technician: string;
  findings: InspectionFinding[];
  adjustments: InspectionAdjustment[];
  recommendedServices: string[];
}

export interface FinalQuote {
  id: string;
  quoteRequestId: string;
  baseEstimate: number;
  adjustmentsTotal: number;
  finalTotal: number;
  expiresOn: string;
  status: 'draft' | 'awaiting-approval' | 'approved' | 'expired' | 'declined';
}

export interface Invoice {
  id: string;
  finalQuoteId: string;
  amountDue: number;
  createdOn: string;
  dueDate: string;
  paid: boolean;
  paymentRef?: string | null;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paidOn: string;
  method: string;
  reference?: string | null;
  notes?: string | null;
}

export interface PartsOrderItem {
  partId: string;
  description: string;
  qty: number;
  costEach: number;
}

export interface PartsOrder {
  id: string;
  finalQuoteId: string;
  items: PartsOrderItem[];
  totalCost: number;
  status: 'ordered' | 'backordered' | 'fulfilled' | 'canceled';
  etaDate?: string | null;
  notes?: string | null;
}

export interface Customer {
  id: string;
  name: string;
  primaryAddress: string;
  email: string;
  phone: string;
  planTier?: string | null;
}

export interface BusinessSettings {
  cancellationWindowHours: number;
  cancellationFee: number;
  quoteExpiryDays: number;
  serviceFeeRange: string;
  schedulingWindow: string;
}

export interface DataSnapshot {
  services: ServiceOffering[];
  maintenancePlans: MaintenancePlan[];
  quoteRequests: QuoteRequest[];
  appointments: Appointment[];
  inspections: Inspection[];
  finalQuotes: FinalQuote[];
  invoices: Invoice[];
  payments: Payment[];
  partsOrders: PartsOrder[];
  customers: Customer[];
  businessSettings: BusinessSettings;
  [key: string]: unknown;
}

// Types for the equipment management system

export interface IssuanceRecord {
  id: string;
  nomenclature: string;
  type: string;
  model: string;
  serialNumber: string;
  fullName: string;
  department: string;
  request: string;
  requestNumber: string;
  issueDate: string;
  location: string;
  status: string;
  notes: string;
  quantity: number;
}

export interface NeedRecord {
  id: string;
  nomenclature: string;
  type: string;
  quantity: number;
  contactPerson: string;
  position: string;
  department: string;
  mobileNumber: string;
  requestDate: string;
  location: string;
  status: string;
  notes: string;
}

export interface RejectedRecord {
  id: string;
  nomenclature: string;
  type: string;
  quantity: number;
  fullName: string;
  position: string;
  department: string;
  mobileNumber: string;
  status: string;
  notes: string;
}

export type SheetType = 'issuance' | 'needs' | 'rejected' | 'dashboard';
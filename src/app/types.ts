// Types for the equipment management system

/** 
 * Unified record type for the system.
 * Combines fields for Needs, Issuance, and Rejected records.
 */
export interface BaseRecord {
  id: number;
  nomenclature: number;
  type: number;
  quantity: number;
  fullName: string; // Unified: contactPerson = fullName
  rank: number;
  position: string;
  department: number;
  mobileNumber: string;
  location: number;
  status: string;
  notes: string;

  // Financially Responsible Person (FRP) fields
  isFrtCp?: boolean;
  frpFullName?: string;
  frpRank?: number;
  frpPosition?: string;
  frpMobileNumber?: string;

  // Domain specific fields (optional)
  model?: string;
  serialNumber?: string;
  applicationStatus?: string;
  requestNumber?: string;

  // Date fields (stored as dd.MM.yyyy)
  date?: string; // Unified date field
  issueDate?: string;
  requestDate?: string;
  rejectedDate?: string;
  accountsData?: string;
}

export type IssuanceRecord = BaseRecord;
export type NeedRecord = BaseRecord;
export type RejectedRecord = BaseRecord;

export interface DirectoryItem {
  id: number;
  name: string;
  mobileNumber?: string;
  notes?: string;
  position?: string;
  quantity?: number;
}

export interface Directories {
  nomenclatures: DirectoryItem[];
  types: DirectoryItem[];
  departments: DirectoryItem[];
  locations: DirectoryItem[];
  positions: DirectoryItem[];
  ranks: DirectoryItem[];
}

export type SheetType = 'issuance' | 'needs' | 'rejected' | 'dashboard' | 'directories';
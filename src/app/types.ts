// Types for the equipment management system

export interface IssuanceRecord {
  id: number;
  nomenclature: number;
  type: number;
  model: string;
  serialNumber: string;
  fullName: string;
  department: number;
  request: string;
  requestNumber: string;
  /** Date queued/issued — format dd.MM.yyyy */
  issueDate: string;
  location: number;
  /** 'Готується' | 'Готово' | 'На паузі' | 'Повернули' | 'Заміна' | 'Відміна' | 'Чекаєм на поставку' | 'Видано' | 'На видачу' */
  status: string;
  notes: string;
  quantity: number;
}

export interface NeedRecord {
  id: number;
  nomenclature: number;
  type: number;
  quantity: number;
  contactPerson: string;
  position: string;
  department: number;
  mobileNumber: string;
  /** format dd.MM.yyyy */
  requestDate: string;
  location: number;
  status: string;
  notes: string;
}

export interface RejectedRecord {
  id: number;
  nomenclature: number;
  type: number;
  quantity: number;
  fullName: string;
  position: string;
  department: number;
  mobileNumber: string;
  status: string;
  notes: string;
  location: number;
  /** format dd.MM.yyyy */
  rejectedDate: string;
}

export interface DirectoryItem {
  id: number;
  name: string;
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
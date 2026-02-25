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
  /** Date queued/issued — format dd.MM.yyyy */
  issueDate: string;
  location: string;
  /** 'Готується' | 'Готово' | 'На паузі' | 'Повернули' | 'Заміна' | 'Відміна' | 'Чекаєм на поставку' | 'Видано' | 'На видачу' */
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
  /** format dd.MM.yyyy */
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
  /** format dd.MM.yyyy */
  rejectedDate: string;
}

export type SheetType = 'issuance' | 'needs' | 'rejected' | 'dashboard';
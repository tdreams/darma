export type ReturnStatus =
  | "scheduled"
  | "pickup_ready"
  | "processing"
  | "completed"
  | "cancelled"
  | "rejected";

export type ReturnStatusFilter =
  | "all"
  | "scheduled"
  | "pickup_ready"
  | "processing"
  | "completed"
  | "cancelled"
  | "rejected";

export interface ReturnStatusHistoryItem {
  id: number;
  returnId: number;
  status: ReturnStatus;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface ReturnDetails {
  id: number;
  status: ReturnStatus;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  returnStationStreet: string;
  returnStationCity: string;
  returnStationState: string;
  returnStationZipCode: string;
  itemSize: string;
  expressPickup: boolean;
  pickupDate: string;
  timeSlot?: string;
  amount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  currentStatusSince: string;
  statusHistory?: ReturnStatusHistoryItem[];
}

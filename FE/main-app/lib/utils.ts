import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ReceiptItem {
  fileName: string,
  companyName: string,
  amount: string,
  date: string,
  tax: string,
  total: string,
  address: string,
  category: string,
}

export type ReceiptData = ReceiptItem[] | [];


export interface ReceiptDBResponse {
  VENDOR_NAME: string;
  SUBTOTAL: string;
  INVOICE_RECEIPT_DATE: string;
  TAX: string;
  TOTAL: string;
  VENDOR_ADDRESS: string;
  ZIP_CODE: string;
  CATEGORY: string;
  FILE_NAME: string;
  _id: string;
}

export interface UserData {
  _id: string;
  email: string;
  isEmailSynced: boolean;
  receipts: ReceiptDBResponse[];
  __v: number;
}

export interface ChartData {
  vendor: string;
  total: number;
}
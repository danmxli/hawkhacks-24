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
}

export type ReceiptData = ReceiptItem[] | [];

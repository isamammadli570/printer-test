export interface ReceiptItem {
  name: string;
  qty: number;
  price: number;
}

export interface ReceiptStore {
  name: string;
  address: string;
  phone: string;
  voen: string;
  website: string;
}

export interface ReceiptPayment {
  method: string;
  given: number;
}

export interface ReceiptData {
  store: ReceiptStore;
  cashier: string;
  items: ReceiptItem[];
  taxRate: number;
  payment: ReceiptPayment;
  paperWidth?: number;
  sidePadding?: number;
}

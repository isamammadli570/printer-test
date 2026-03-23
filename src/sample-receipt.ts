import type { ReceiptData } from './modules/qz-printer'

export const SAMPLE_RECEIPT: ReceiptData = {
  store: {
    name: 'BAKU COFFEE HOUSE',
    address: 'Nizami kuc. 42, Baku',
    phone: '+994 12 555 44 33',
    voen: '1234567890',
    website: 'www.bakucoffee.az',
  },
  cashier: 'Aysel M.',
  items: [
    { name: 'Americano', qty: 2, price: 5.0 },
    { name: 'Latte', qty: 1, price: 6.5 },
    { name: 'Croissant', qty: 3, price: 3.2 },
    { name: 'Cheesecake', qty: 1, price: 8.9 },
    { name: 'Su 0.5L', qty: 2, price: 1.5 },
  ],
  taxRate: 0.18,
  payment: { method: 'Naqd', given: 50.0 },
  sidePadding: 2,
}

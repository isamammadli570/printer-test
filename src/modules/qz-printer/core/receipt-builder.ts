import { CMD, line, qrCommands, separator } from "./escpos";
import type { ReceiptData } from "./receipt-types";

const LOCALE = "az-AZ";
const DEFAULT_WIDTH = 48;
const DEFAULT_SIDE_PADDING = 2;
const MIN_CONTENT_WIDTH = 16;

const eol = (text = "") => `${text}\r\n`;
const money = (value: number) => `${value.toFixed(2)} AZN`;
const randomReceiptNo = () => `#${Math.floor(100000 + Math.random() * 900000)}`;

export function buildReceipt(data: ReceiptData): string {
  const width = data.paperWidth ?? DEFAULT_WIDTH;
  const sidePadding = Math.max(0, data.sidePadding ?? DEFAULT_SIDE_PADDING);
  const contentWidth = Math.max(MIN_CONTENT_WIDTH, width - sidePadding * 2);
  const sideSpace = " ".repeat(sidePadding);
  const withPadding = (text: string) => sideSpace + text + sideSpace;

  const now = new Date();
  const date = now.toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = now.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const receiptNo = randomReceiptNo();
  const subtotal = data.items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0,
  );
  const tax = +(subtotal * data.taxRate).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  const change = +(data.payment.given - total).toFixed(2);
  const qrData = JSON.stringify({
    receipt: receiptNo,
    date: `${date} ${time}`,
    total: money(total),
    store: data.store.name,
  });

  const lines: string[] = [];
  const push = (text = "") => lines.push(eol(text));
  const pushPadded = (text = "") => push(withPadding(text));

  lines.push(CMD.INIT, CMD.CENTER);
  lines.push(CMD.DOUBLE_SIZE, CMD.BOLD_ON);
  pushPadded(data.store.name);
  lines.push(CMD.BOLD_OFF, CMD.NORMAL_SIZE);
  pushPadded(data.store.address);
  pushPadded(`Tel: ${data.store.phone}`);
  pushPadded(`VOEN: ${data.store.voen}`);
  push();

  lines.push(CMD.LEFT);
  pushPadded(separator("=", contentWidth));
  lines.push(CMD.BOLD_ON);
  pushPadded(line("CEK", receiptNo, contentWidth));
  lines.push(CMD.BOLD_OFF);
  pushPadded(line("Tarix:", `${date}  ${time}`, contentWidth));
  pushPadded(line("Kassir:", data.cashier, contentWidth));
  pushPadded(separator("=", contentWidth));

  lines.push(CMD.BOLD_ON);
  pushPadded(line("Mehsul", "Eded   Qiymet    Cem", contentWidth));
  lines.push(CMD.BOLD_OFF);
  pushPadded(separator("-", contentWidth));
  for (const item of data.items) {
    const lineTotal = (item.qty * item.price).toFixed(2);
    const right = `${item.qty}    ${item.price.toFixed(2)}   ${lineTotal}`;
    pushPadded(line(item.name, right, contentWidth));
  }

  pushPadded(separator("-", contentWidth));
  pushPadded(line("Ara cem:", money(subtotal), contentWidth));
  pushPadded(
    line(
      `EDV (${(data.taxRate * 100).toFixed(0)}%):`,
      money(tax),
      contentWidth,
    ),
  );
  pushPadded(separator("=", contentWidth));

  lines.push(CMD.DOUBLE_SIZE, CMD.BOLD_ON);
  pushPadded(line("YEKUN:", money(total), Math.floor(contentWidth / 2)));
  lines.push(CMD.BOLD_OFF, CMD.NORMAL_SIZE);

  pushPadded(separator("=", contentWidth));
  pushPadded(line("Odenis:", data.payment.method, contentWidth));
  pushPadded(line("Verildi:", money(data.payment.given), contentWidth));
  pushPadded(line("Qaytariq:", money(change), contentWidth));
  pushPadded(separator("-", contentWidth));
  push();

  lines.push(CMD.CENTER, qrCommands(qrData));
  push();
  pushPadded("Alish ucun tesekkurler!");
  pushPadded(data.store.website);
  lines.push(CMD.feed(4), CMD.CUT);

  return lines.join("");
}

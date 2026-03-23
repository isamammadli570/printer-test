const ESC = "\x1B";
const GS = "\x1D";

export const CMD = {
  INIT: ESC + "\x40",
  CENTER: ESC + "\x61\x01",
  LEFT: ESC + "\x61\x00",
  BOLD_ON: ESC + "\x45\x01",
  BOLD_OFF: ESC + "\x45\x00",
  DOUBLE_SIZE: GS + "\x21\x11",
  NORMAL_SIZE: GS + "\x21\x00",
  CUT: GS + "\x56\x00",
  feed: (n: number) => ESC + "\x64" + String.fromCharCode(n),
} as const;

export function qrCommands(text: string): string {
  const len = text.length + 3;
  const pL = len & 0xff;
  const pH = (len >> 8) & 0xff;

  return [
    GS + "\x28\x6B\x04\x00\x31\x41\x32\x00",
    GS + "\x28\x6B\x03\x00\x31\x43\x08",
    GS + "\x28\x6B\x03\x00\x31\x45\x31",
    GS + "\x28\x6B" + String.fromCharCode(pL, pH) + "\x31\x50\x30" + text,
    GS + "\x28\x6B\x03\x00\x31\x51\x30",
  ].join("");
}

export function line(left: string, right: string, width = 48): string {
  const gap = width - left.length - right.length;
  return left + " ".repeat(Math.max(gap, 1)) + right;
}

export function separator(char = "-", width = 48): string {
  return char.repeat(width);
}

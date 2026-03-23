const QZ_NOT_LOADED_ERROR =
  "QZ Tray yuklenmeyib. Proqramin aciq olduguna emin olun.";

function getQz(): NonNullable<Window["qz"]> {
  if (!window.qz) {
    throw new Error(QZ_NOT_LOADED_ERROR);
  }
  return window.qz;
}

export function isQzLoaded(): boolean {
  return typeof window.qz !== "undefined";
}

export function isQzConnected(): boolean {
  return isQzLoaded() && getQz().websocket.isActive();
}

export async function connectQz(): Promise<void> {
  const qz = getQz();
  if (!qz.websocket.isActive()) {
    await qz.websocket.connect();
  }
}

export async function getDefaultPrinter(): Promise<string> {
  const qz = getQz();
  await connectQz();
  return qz.printers.getDefault();
}

export async function printRaw(
  printerName: string,
  rawData: string,
): Promise<void> {
  const qz = getQz();
  await connectQz();
  const config = qz.configs.create(printerName);
  await qz.print(config, [{ type: "raw", format: "plain", data: rawData }]);
}

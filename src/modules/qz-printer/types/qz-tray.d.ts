interface QzConfigFactory {
  create(printerName: string): unknown;
}

interface QzWebSocket {
  isActive(): boolean;
  connect(): Promise<void>;
}

interface QzPrinters {
  getDefault(): Promise<string>;
}

interface QzPrintJob {
  type: "raw";
  format: "plain";
  data: string;
}

interface QzTrayApi {
  websocket: QzWebSocket;
  printers: QzPrinters;
  configs: QzConfigFactory;
  print(config: unknown, data: QzPrintJob[]): Promise<void>;
}

declare global {
  interface Window {
    qz?: QzTrayApi;
  }
}

export {};

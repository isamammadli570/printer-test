import { useCallback, useEffect, useMemo, useState } from "react";
import {
  connectQz,
  getDefaultPrinter,
  isQzConnected,
  isQzLoaded,
  printRaw,
} from "../core/qz-client";

export interface QzMessages {
  checking: string;
  missing: string;
  ready: string;
  promptConnect: string;
  connected: string;
  connectErrorPrefix: string;
  printSuccessPrefix: string;
  printErrorPrefix: string;
}

export interface UseQzPrinterResult {
  status: string;
  isConnected: boolean;
  isPrinting: boolean;
  connect: () => Promise<void>;
  print: (rawData: string, printerName?: string) => Promise<void>;
}

const defaultMessages: QzMessages = {
  checking: "QZ Tray yoxlanilir...",
  missing: "QZ Tray yuklenmeyib. Proqramin aciq olduguna emin olun.",
  ready: "QZ Tray hazirdir.",
  promptConnect: "QZ Tray tapildi. Connect duymesine basin.",
  connected: "QZ Tray ile baglanti ugurludur.",
  connectErrorPrefix: "Baglanti xetasi:",
  printSuccessPrefix: "Cap olundu! Printer:",
  printErrorPrefix: "Cap xetasi:",
};

const formatError = (prefix: string, error: unknown) =>
  `${prefix} ${error instanceof Error ? error.message : String(error)}`;

export function useQzPrinter(
  messages?: Partial<QzMessages>,
): UseQzPrinterResult {
  const m = useMemo(() => ({ ...defaultMessages, ...messages }), [messages]);
  const [status, setStatus] = useState(m.checking);
  const [isConnected, setIsConnected] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (!isQzLoaded()) {
      setStatus(m.missing);
      return;
    }
    if (isQzConnected()) {
      setIsConnected(true);
      setStatus(m.ready);
      return;
    }
    setStatus(m.promptConnect);
  }, [m.missing, m.promptConnect, m.ready]);

  const connect = useCallback(async () => {
    try {
      await connectQz();
      setIsConnected(true);
      setStatus(m.connected);
    } catch (error) {
      setIsConnected(false);
      setStatus(formatError(m.connectErrorPrefix, error));
    }
  }, [m.connected, m.connectErrorPrefix]);

  const print = useCallback(
    async (rawData: string, printerName?: string) => {
      setIsPrinting(true);
      try {
        const targetPrinter = printerName ?? (await getDefaultPrinter());
        await printRaw(targetPrinter, rawData);
        setIsConnected(true);
        setStatus(`${m.printSuccessPrefix} ${targetPrinter}`);
      } catch (error) {
        setStatus(formatError(m.printErrorPrefix, error));
      } finally {
        setIsPrinting(false);
      }
    },
    [m.printErrorPrefix, m.printSuccessPrefix],
  );

  return { status, isConnected, isPrinting, connect, print };
}

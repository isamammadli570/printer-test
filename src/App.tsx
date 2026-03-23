import "./App.css";
import { buildReceipt, useQzPrinter } from "./modules/qz-printer";
import { SAMPLE_RECEIPT } from "./sample-receipt";

function App() {
  const { status, isConnected, isPrinting, connect, print } = useQzPrinter();

  const handlePrint = () => {
    const raw = buildReceipt(SAMPLE_RECEIPT);
    void print(raw);
  };

  return (
    <main className="app">
      <h1>QZ Tray Printer</h1>
      <p className="status">{status}</p>

      <div className="buttons">
        <button type="button" onClick={connect} disabled={isConnected}>
          {isConnected ? "Connected" : "Connect"}
        </button>
        <button type="button" onClick={handlePrint} disabled={isPrinting}>
          {isPrinting ? "Printing..." : "Çek çap et"}
        </button>
      </div>
    </main>
  );
}

export default App;

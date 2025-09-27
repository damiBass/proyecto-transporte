import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Trip submission endpoint (JSON only)
  app.post("/api/trips", async (req, res) => {
    try {
      const { apellido, cliente, localidad, fechaRemitoISO, observaciones, ticketCombustible, remitos, driverEmail, driverApellido } = req.body ?? {};
      if (!apellido || !cliente || !localidad || !fechaRemitoISO || !observaciones) {
        return res.status(400).json({ ok: false, message: "Faltan datos obligatorios" });
      }

      const payload = { apellido, cliente, localidad, fechaRemitoISO, observaciones, ticketCombustible, remitos, driverEmail, driverApellido };

      const sheetsUrl = process.env.SHEETS_WEB_APP_URL;
      let forwarded = false;

      if (sheetsUrl) {
        const resp = await fetch(sheetsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        forwarded = resp.ok;
        if (!resp.ok) {
          const text = await resp.text().catch(() => "");
          console.error("Sheets forward error", resp.status, text);
        }
      }

      return res.json({ ok: true, forwardedToSheets: forwarded, message: forwarded ? "Enviado a Google Sheets" : "Recibido localmente" });
    } catch (err) {
      console.error("/api/trips error", err);
      return res.status(500).json({ ok: false, message: "Error del servidor" });
    }
  });

  app.post("/api/quotes", async (req, res) => {
    try {
      const { nombre, email, empresa, origen, destino, fechaISO, detalle, telefono } = req.body ?? {};
      if (!nombre || !email || !empresa || !origen || !destino || !fechaISO || !detalle) {
        return res.status(400).json({ ok: false, message: "Faltan datos obligatorios" });
      }
      const payload = { nombre, email, empresa, origen, destino, fechaISO, detalle, telefono };
      const sheetsUrl = process.env.SHEETS_QUOTES_WEB_APP_URL ?? process.env.SHEETS_WEB_APP_URL;
      let forwarded = false;
      if (sheetsUrl) {
        const resp = await fetch(sheetsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "quote", ...payload }),
        });
        forwarded = resp.ok;
        if (!resp.ok) {
          const text = await resp.text().catch(() => "");
          console.error("Sheets forward error (quotes)", resp.status, text);
        }
      }
      return res.json({ ok: true, forwardedToSheets: forwarded, message: forwarded ? "Cotización enviada" : "Cotización recibida" });
    } catch (err) {
      console.error("/api/quotes error", err);
      return res.status(500).json({ ok: false, message: "Error del servidor" });
    }
  });

  return app;
}

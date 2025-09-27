/**
 * Shared code between client and server
 */

export interface DemoResponse {
  message: string;
}

// Nueva estructura de viaje
export interface TripPayloadV2 {
  apellido: string; // obligatorio
  cliente: string; // obligatorio
  localidad: string; // obligatorio
  fechaRemitoISO: string; // obligatorio (YYYY-MM-DD)
  observaciones: string; // obligatorio
  ticketCombustible?: string[]; // opcional
  remitos?: string[]; // opcional
  // metadatos para Apps Script (creación/actualización de hoja por chofer)
  driverEmail?: string;
  driverApellido?: string;
}

export interface TripSubmissionResponse {
  ok: boolean;
  forwardedToSheets: boolean;
  message: string;
}

export interface QuotePayload {
  nombre: string;
  email: string;
  empresa: string;
  origen: string;
  destino: string;
  fechaISO: string;
  detalle: string;
  telefono?: string;
}

export interface QuoteSubmissionResponse {
  ok: boolean;
  forwardedToSheets: boolean;
  message: string;
}

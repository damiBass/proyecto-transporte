import { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { TripPayloadV2, TripSubmissionResponse } from "@shared/api";
import { loadLocal, saveLocal, type LocalTrip } from "@/lib/trips/utils";
import { Switch } from "@/components/ui/switch";
import { Send } from "lucide-react";

function todayISODate() {
	const d = new Date();
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

export default function TripForm({ onNew, user, storageKey }: { onNew?: (t: LocalTrip) => void; user: { apellido: string; email: string }; storageKey: string }) {
	const { toast } = useToast();
	const [sending, setSending] = useState(false);
	const [form, setForm] = useState<TripPayloadV2>({
		apellido: user.apellido,
		cliente: "",
		localidad: "",
		fechaRemitoISO: todayISODate(),
		observaciones: "",
		ticketCombustible: [],
		remitos: [],
	});
	const [hasFuel, setHasFuel] = useState(false);

	const ticketRef = useRef<HTMLInputElement | null>(null);
	const remitoRef = useRef<HTMLInputElement | null>(null);

	const errors = useMemo(() => ({
		cliente: !form.cliente.trim() ? "Ingrese el cliente" : "",
		localidad: !form.localidad.trim() ? "Ingrese la localidad" : "",
		fechaRemitoISO: !form.fechaRemitoISO ? "Seleccione la fecha del remito" : "",
		observaciones: !form.observaciones.trim() ? "Escriba observaciones" : "",
	}), [form]);

	const disabled = useMemo(
		() => Boolean(errors.cliente || errors.localidad || errors.fechaRemitoISO || errors.observaciones),
		[errors],
	);

	const handleTicketFiles = (files: FileList | null) => {
		if (!files) return;
		const names: string[] = [];
		Array.from(files).forEach((f) => names.push(f.name));
		setForm((s: TripPayloadV2) => ({ ...s, ticketCombustible: names }));
	};

	const handleRemitoFiles = (files: FileList | null) => {
		if (!files) return;
		const names: string[] = [];
		Array.from(files).forEach((f) => names.push(f.name));
		setForm((s: TripPayloadV2) => ({ ...s, remitos: names }));
	};

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (disabled) return;
		setSending(true);
		try {
			const resp = await fetch("/api/trips", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...form, driverEmail: user.email, driverApellido: user.apellido }),
			});
			const data = (await resp.json()) as TripSubmissionResponse;

			const newItem: LocalTrip = {
				id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
				createdAt: Date.now(),
				driverEmail: user.email,
				...form,
			};
			const list = loadLocal(storageKey);
			list.unshift(newItem);
			saveLocal(storageKey, list);
			onNew?.(newItem);

			toast({
				title: data.ok ? "Carga enviada" : "Carga guardada",
				description: data.forwardedToSheets
					? "Los datos fueron enviados a Google Sheets."
					: "Guardamos el viaje localmente. Se enviará cuando configure la integración.",
			});
			setForm({ ...form, cliente: "", localidad: "", observaciones: "", ticketCombustible: [], remitos: [] });
			if (ticketRef.current) ticketRef.current.value = "";
			if (remitoRef.current) remitoRef.current.value = "";
			setHasFuel(false);
		} catch (err) {
			toast({
				title: "No se pudo enviar",
				description: "Guardamos el viaje localmente. Revise su conexión.",
			});
			const newItem: LocalTrip = {
				id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
				createdAt: Date.now(),
				driverEmail: user.email,
				...form,
			};
			const list = loadLocal(storageKey);
			list.unshift(newItem);
			saveLocal(storageKey, list);
			onNew?.(newItem);
		} finally {
			setSending(false);
		}
	};

	return (
		<form onSubmit={submit} className="space-y-8">
			<div className="grid md:grid-cols-2 gap-6">
				<div className="grid gap-2">
					<Label htmlFor="apellido">Apellido del Chofer</Label>
					<Input id="apellido" value={form.apellido} readOnly className="bg-muted/50" />
				</div>
				<div className="grid gap-2">
					<Label htmlFor="fechaRemito">Fecha del Remito</Label>
					<Input
						id="fechaRemito"
						type="date"
						value={form.fechaRemitoISO}
						onChange={(e) => setForm((s: TripPayloadV2) => ({ ...s, fechaRemitoISO: e.target.value }))}
						aria-invalid={!!errors.fechaRemitoISO}
						required
					/>
					{errors.fechaRemitoISO && <p className="text-sm text-destructive">{errors.fechaRemitoISO}</p>}
				</div>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				<div className="grid gap-2">
					<Label htmlFor="cliente">Cliente</Label>
					<Input
						id="cliente"
						placeholder="Ej: ACME S.A."
						value={form.cliente}
						onChange={(e) => setForm((s: TripPayloadV2) => ({ ...s, cliente: e.target.value }))}
						aria-invalid={!!errors.cliente}
						required
					/>
					{errors.cliente && <p className="text-sm text-destructive">{errors.cliente}</p>}
				</div>
				<div className="grid gap-2">
					<Label htmlFor="localidad">Localidad</Label>
					<Input
						id="localidad"
						placeholder="Ej: Rosario, Santa Fe"
						value={form.localidad}
						onChange={(e) => setForm((s: TripPayloadV2) => ({ ...s, localidad: e.target.value }))}
						aria-invalid={!!errors.localidad}
						required
					/>
					{errors.localidad && <p className="text-sm text-destructive">{errors.localidad}</p>}
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="observaciones">Observaciones</Label>
				<Textarea
					id="observaciones"
					value={form.observaciones}
					onChange={(e) => setForm((s: TripPayloadV2) => ({ ...s, observaciones: e.target.value }))}
					aria-invalid={!!errors.observaciones}
					placeholder="Ej: Entrega en depósito, referirse a portería. Carga/descarga manual."
					required
					rows={4}
				/>
				{errors.observaciones && <p className="text-sm text-destructive">{errors.observaciones}</p>}
			</div>

			<div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
				<div className="grid gap-4">
					<div className="flex items-center space-x-2">
						<Switch id="hasFuel" checked={hasFuel} onCheckedChange={setHasFuel} />
						<Label htmlFor="hasFuel">Cargué Combustible</Label>
					</div>
					<Input
						id="ticket"
						ref={ticketRef}
						type="file"
						accept="image/*"
						multiple
						disabled={!hasFuel}
						onChange={(e) => handleTicketFiles(e.target.files)}
					/>
					{form.ticketCombustible && form.ticketCombustible.length > 0 && (
						<p className="text-sm text-muted-foreground">
							{form.ticketCombustible.length} archivo(s) seleccionado(s).
						</p>
					)}
				</div>
				<div className="grid gap-2">
					<Label htmlFor="remitos">Adjuntar Remitos (fotos)</Label>
					<Input
						id="remitos"
						ref={remitoRef}
						type="file"
						accept="image/*"
						multiple
						onChange={(e) => handleRemitoFiles(e.target.files)}
					/>
					{form.remitos && form.remitos.length > 0 && (
						<p className="text-sm text-muted-foreground">
							{form.remitos.length} archivo(s) seleccionado(s).
						</p>
					)}
				</div>
			</div>

			<div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-border/50">
				<Button type="submit" disabled={disabled || sending} size="lg">
					<Send className="w-4 h-4 mr-2" />
					{sending ? "Enviando..." : "Cargar Viaje"}
				</Button>
				<p className="text-sm text-muted-foreground">
					Los datos se guardarán localmente y se enviarán a la planilla central.
				</p>
			</div>
		</form>
	);
}

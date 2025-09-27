import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LocalTrip } from "@/lib/trips/utils";
import { Download, FileText, Fuel, MapPin, Calendar, User, Building } from "lucide-react";

function toCSV(rows: LocalTrip[]): string {
	const headers = [
		"id",
		"fechaRemitoISO",
		"apellido",
		"cliente",
		"localidad",
		"observaciones",
		"ticketCombustible",
		"remitos",
	];
	const escape = (v: unknown) =>
		`"${String(v ?? "").replace(/"/g, '""').replace(/\n/g, " ")}"`;
	const lines = [headers.join(",")];
	for (const r of rows) {
		lines.push(
			[
				r.id,
				r.fechaRemitoISO,
				r.apellido,
				r.cliente,
				r.localidad,
				r.observaciones ?? "",
				(r.ticketCombustible ?? []).join(" | "),
				(r.remitos ?? []).join(" | "),
			]
				.map(escape)
				.join(","),
		);
	}
	return lines.join("\n");
}

export default function TripList({ items }: { items: LocalTrip[] }) {
	const count = items.length;
	const csv = useMemo(() => toCSV(items), [items]);

	const download = () => {
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `viajes-${new Date().toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h2 className="text-3xl font-bold">Viajes Registrados</h2>
					<p className="text-muted-foreground">
						{count > 0 ? `Mostrando ${count} viaje(s) guardado(s) localmente.` : "Aún no hay viajes registrados."}
					</p>
				</div>
				<Button onClick={download} disabled={count === 0}>
					<Download className="w-4 h-4 mr-2" />
					Exportar CSV
				</Button>
			</div>

			{count === 0 ? (
				<div className="text-center py-12 px-6 bg-muted/20 rounded-lg border border-dashed border-border/50">
					<h3 className="text-xl font-semibold">No hay viajes para mostrar</h3>
					<p className="text-muted-foreground mt-2">
						Complete el formulario de carga para registrar el primer viaje.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{items.map((t) => (
						<Card key={t.id} className="bg-muted/20 border-border/50 overflow-hidden">
							<CardContent className="p-5 grid gap-4 md:grid-cols-3">
								<div className="md:col-span-2 space-y-3">
									<div className="flex items-center gap-3">
										<Calendar className="w-5 h-5 text-primary" />
										<span className="font-semibold text-lg">{t.fechaRemitoISO}</span>
									</div>
									<div className="grid sm:grid-cols-2 gap-3 text-sm">
										<InfoItem icon={<User className="w-4 h-4" />} label="Conductor" value={t.apellido.toUpperCase()} />
										<InfoItem icon={<Building className="w-4 h-4" />} label="Cliente" value={t.cliente} />
										<InfoItem icon={<MapPin className="w-4 h-4" />} label="Localidad" value={t.localidad} />
									</div>
									{t.observaciones && (
										<div>
											<h4 className="font-semibold text-sm mb-1">Observaciones</h4>
											<p className="text-sm text-muted-foreground bg-background/50 p-2 rounded-md">
												{t.observaciones}
											</p>
										</div>
									)}
								</div>
								<div className="space-y-3 text-sm">
									<InfoItem icon={<Fuel className="w-4 h-4" />} label="Tickets de Combustible" value={`${(t.ticketCombustible ?? []).length} adjunto(s)`} />
									<InfoItem icon={<FileText className="w-4 h-4" />} label="Remitos" value={`${(t.remitos ?? []).length} adjunto(s)`} />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
	return (
		<div className="flex items-start gap-2">
			<div className="text-muted-foreground mt-0.5">{icon}</div>
			<div>
				<p className="font-medium text-foreground">{value}</p>
				<p className="text-xs text-muted-foreground">{label}</p>
			</div>
		</div>
	)
}

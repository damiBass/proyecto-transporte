import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";

function todayISODate() {
	const d = new Date();
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

export default function Cotizacion() {
	const { toast } = useToast();
	const [sending, setSending] = useState(false);
	const [form, setForm] = useState({ nombre: "", email: "", empresa: "", origen: "", destino: "", fechaISO: todayISODate(), detalle: "", telefono: "" });
	const errors = useMemo(() => ({
		nombre: !form.nombre.trim() ? "Ingrese su nombre" : "",
		email: !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) ? "Email inválido" : "",
		empresa: !form.empresa.trim() ? "Ingrese su empresa" : "",
		origen: !form.origen.trim() ? "Ingrese el origen" : "",
		destino: !form.destino.trim() ? "Ingrese el destino" : "",
		fechaISO: !form.fechaISO ? "Seleccione la fecha" : "",
		detalle: !form.detalle.trim() ? "Describe la carga y requisitos" : "",
	}), [form]);
	const disabled = Object.values(errors).some(Boolean) || sending;

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (disabled) return;
		setSending(true);
		try {
			const resp = await fetch("/api/quotes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
			const data = await resp.json();
			toast({ title: data.ok ? "Enviada" : "Recibida", description: data.message });
			setForm({ nombre: "", email: "", empresa: "", origen: "", destino: "", fechaISO: todayISODate(), detalle: "", telefono: "" });
		} catch (err) {
			toast({ title: "No se pudo enviar", description: "Intente nuevamente más tarde" });
		} finally {
			setSending(false);
		}
	};

	return (
		<Layout>
			<div className="container mx-auto px-4 py-20 md:py-28">
				<div className="max-w-3xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
							Solicitud de Cotización
						</h1>
						<p className="mt-4 text-lg text-muted-foreground">
							Completa el formulario y nuestro equipo comercial se pondrá en
							contacto a la brevedad.
						</p>
					</div>

					<Card className="bg-muted/20 border-border/50">
						<CardHeader>
							<CardTitle className="text-2xl font-semibold">
								Detalles del Envío
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={submit} className="grid gap-6">
								<div className="grid md:grid-cols-2 gap-6">
									<div className="grid gap-2">
										<Label htmlFor="nombre">Nombre Completo</Label>
										<Input id="nombre" value={form.nombre} onChange={(e) => setForm((s) => ({ ...s, nombre: e.target.value }))} required aria-invalid={!!errors.nombre} />
										{errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
									</div>
									<div className="grid gap-2">
										<Label htmlFor="email">Email de Contacto</Label>
										<Input id="email" type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required aria-invalid={!!errors.email} />
										{errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
									</div>
								</div>

								<div className="grid md:grid-cols-2 gap-6">
									<div className="grid gap-2">
										<Label htmlFor="empresa">Empresa</Label>
										<Input id="empresa" value={form.empresa} onChange={(e) => setForm((s) => ({ ...s, empresa: e.target.value }))} required aria-invalid={!!errors.empresa} />
										{errors.empresa && <p className="text-sm text-destructive">{errors.empresa}</p>}
									</div>
									<div className="grid gap-2">
										<Label htmlFor="telefono">Teléfono (opcional)</Label>
										<Input id="telefono" value={form.telefono} onChange={(e) => setForm((s) => ({ ...s, telefono: e.target.value }))} />
									</div>
								</div>

								<hr className="border-border/50" />

								<div className="grid md:grid-cols-2 gap-6">
									<div className="grid gap-2">
										<Label htmlFor="origen">Ciudad de Origen</Label>
										<Input id="origen" value={form.origen} onChange={(e) => setForm((s) => ({ ...s, origen: e.target.value }))} required aria-invalid={!!errors.origen} />
										{errors.origen && <p className="text-sm text-destructive">{errors.origen}</p>}
									</div>
									<div className="grid gap-2">
										<Label htmlFor="destino">Ciudad de Destino</Label>
										<Input id="destino" value={form.destino} onChange={(e) => setForm((s) => ({ ...s, destino: e.target.value }))} required aria-invalid={!!errors.destino} />
										{errors.destino && <p className="text-sm text-destructive">{errors.destino}</p>}
									</div>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="fechaISO">Fecha Estimada de Carga</Label>
									<Input id="fechaISO" type="date" value={form.fechaISO} onChange={(e) => setForm((s) => ({ ...s, fechaISO: e.target.value }))} required aria-invalid={!!errors.fechaISO} />
									{errors.fechaISO && <p className="text-sm text-destructive">{errors.fechaISO}</p>}
								</div>

								<div className="grid gap-2">
									<Label htmlFor="detalle">
										Detalles de la Carga y Requerimientos
									</Label>
									<Textarea id="detalle" value={form.detalle} onChange={(e) => setForm((s) => ({ ...s, detalle: e.target.value }))} required rows={5} placeholder="Ej: Tipo de mercadería, peso, volumen, si requiere frío, etc." />
									{errors.detalle && <p className="text-sm text-destructive">{errors.detalle}</p>}
								</div>

								<Button type="submit" disabled={disabled} size="lg">
									{sending ? "Enviando..." : "Enviar Solicitud"}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</Layout>
	);
}

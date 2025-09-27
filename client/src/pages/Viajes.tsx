import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import TripForm from "@/components/trips/TripForm";
import TripList from "@/components/trips/TripList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import { loadLocal, type LocalTrip } from "@/lib/trips/utils";

export default function Viajes() {
	const nav = useNavigate();
	const user = useMemo(() => getUser(), []);
	const [items, setItems] = useState<LocalTrip[]>([]);

	useEffect(() => {
		if (!user) {
			nav("/login", { replace: true });
			return;
		}
		setItems(loadLocal(user.email || user.apellido));
	}, [nav, user]);

	if (!user) return null;

	const storageKey = `${user.email || user.apellido}`;

	return (
		<Layout>
			<div className="container mx-auto px-4 py-20 md:py-28">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
							Gestión de Viajes
						</h1>
						<p className="mt-4 text-lg text-muted-foreground">
							Registra y administra los viajes de tu flota de manera
							eficiente.
						</p>
					</div>

					<Card className="bg-muted/20 border-border/50">
						<CardHeader>
							<CardTitle className="text-2xl font-semibold">
								Cargar un Nuevo Viaje
							</CardTitle>
						</CardHeader>
						<CardContent>
							<TripForm
								onNew={(t) => setItems((s) => [t, ...s])}
								user={user}
								storageKey={storageKey}
							/>
						</CardContent>
					</Card>

					<div className="mt-12">
						<h2 className="text-3xl font-bold mb-6">Viajes Registrados</h2>
						<TripList items={items} />
					</div>

					<Card className="mt-12 bg-muted/20 border-border/50">
						<CardHeader>
							<CardTitle className="text-xl font-semibold">
								Integración con Google Sheets y Drive
							</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground space-y-2">
							<p>
								Al integrar con Google, cada chofer tendrá su propia planilla
								que se actualiza automáticamente y puede compartirse con su
								email.
							</p>
							<p>
								Esto centraliza la información, facilita el seguimiento y mejora
								la colaboración entre el personal administrativo y los
								conductores.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</Layout>
	);
}

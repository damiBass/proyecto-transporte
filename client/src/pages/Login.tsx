import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUser, USER_KEY } from "@/lib/auth";

export default function Login() {
	const nav = useNavigate();
	const [apellido, setApellido] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {
		const u = getUser();
		if (u) nav("/viajes");
	}, [nav]);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!apellido.trim() || !email.trim()) return;
		localStorage.setItem(USER_KEY, JSON.stringify({ apellido: apellido.trim(), email: email.trim() }));
		nav("/viajes");
	};

	return (
		<Layout>
			<div className="container mx-auto px-4 py-20 md:py-28">
				<div className="max-w-md mx-auto">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold tracking-tight">
							Acceso para Conductores
						</h1>
						<p className="mt-3 text-muted-foreground">
							Ingresa para registrar y gestionar tus viajes.
						</p>
					</div>
					<Card className="bg-muted/20 border-border/50">
						<CardHeader>
							<CardTitle className="text-2xl font-semibold">
								Iniciar Sesión
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={submit} className="grid gap-6">
								<div className="grid gap-2">
									<Label htmlFor="apellido">Apellido</Label>
									<Input id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required placeholder="Ej: Ferreyra" />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="email">Email (Gmail)</Label>
									<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu-email@gmail.com" />
								</div>
								<Button type="submit" size="lg" className="w-full">
									Ingresar
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</Layout>
	);
}

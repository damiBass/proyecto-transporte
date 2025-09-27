import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Warehouse, Package, Wrench } from "lucide-react";

const CLIENT_LOGOS = [
	"https://dummyimage.com/160x64/0b132b/e5e7eb&text=Cliente+1",
	"https://dummyimage.com/160x64/1c2541/e5e7eb&text=Cliente+2",
	"https://dummyimage.com/160x64/3a506b/e5e7eb&text=Cliente+3",
	"https://dummyimage.com/160x64/5bc0be/0f172a&text=Cliente+4",
	"https://dummyimage.com/160x64/0f172a/e5e7eb&text=Cliente+5",
	"https://dummyimage.com/160x64/1f2937/e5e7eb&text=Cliente+6",
];

export default function Landing() {
	return (
		<Layout>
			{/* Hero Section */}
			<section className="bg-background text-foreground py-20 md:py-32">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="max-w-3xl text-center mx-auto"
					>
						<h1 className="text-4xl md:text-6xl font-bold tracking-tight">
							Soluciones Logísticas a la Medida de tu Empresa
						</h1>
						<p className="mt-6 text-lg md:text-xl text-muted-foreground">
							Optimizamos tus operaciones de transporte con tecnología de vanguardia,
							garantizando eficiencia, seguridad y puntualidad en cada entrega.
						</p>
						<div className="mt-8 flex justify-center gap-4">
							<Button size="lg" asChild>
								<a href="#servicios">Nuestros Servicios</a>
							</Button>
							<Button size="lg" variant="outline" asChild>
								<a href="/cotizacion">Contacto</a>
							</Button>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Services Section */}
			<section id="servicios" className="py-20 md:py-28 bg-muted/40">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-2xl mx-auto">
						<h2 className="text-3xl md:text-4xl font-bold">
							Soluciones Integrales para tu Cadena de Suministro
						</h2>
						<p className="mt-4 text-muted-foreground text-lg">
							Desde el transporte de cargas generales hasta la logística de
							proyectos complejos.
						</p>
					</div>
					<div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
						<ServiceCard
							icon={<Truck className="w-8 h-8 text-primary" />}
							title="Transporte de Carga"
							description="Servicio de carga completa (FTL) y consolidada (LTL) a nivel nacional, con seguimiento en tiempo real."
						/>
						<ServiceCard
							icon={<Warehouse className="w-8 h-8 text-primary" />}
							title="Almacenamiento"
							description="Soluciones de warehousing flexible y gestión de inventario para optimizar tu stock."
						/>
						<ServiceCard
							icon={<Package className="w-8 h-8 text-primary" />}
							title="Distribución"
							description="Entregas de última milla y distribución capilar en centros urbanos y zonas industriales."
						/>
						<ServiceCard
							icon={<Wrench className="w-8 h-8 text-primary" />}
							title="Logística de Proyectos"
							description="Gestión integral para cargas sobredimensionadas, peligrosas o con requerimientos especiales."
						/>
					</div>
				</div>
			</section>

			{/* Why Us Section */}
			<section className="py-20 md:py-28">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div className="max-w-lg">
							<h2 className="text-3xl md:text-4xl font-bold">
								¿Por qué Transportes Ferreyra?
							</h2>
							<p className="mt-4 text-lg text-muted-foreground">
								Combinamos décadas de experiencia en el sector con un enfoque
								moderno, centrado en la tecnología y la satisfacción del cliente.
							</p>
							<ul className="mt-8 space-y-6">
								<FeatureItem title="Tecnología y Visibilidad">
									Nuestra plataforma digital te permite gestionar y monitorear tus
									envíos 24/7, con acceso a documentación y reportes en línea.
								</FeatureItem>
								<FeatureItem title="Seguridad y Confianza">
									Protocolos estrictos, personal capacitado y seguros de carga
									para garantizar la integridad de tu mercadería.
								</FeatureItem>
								<FeatureItem title="Experiencia y Soporte Dedicado">
									Un equipo de expertos a tu disposición para brindarte
									asesoramiento y soluciones rápidas ante cualquier imprevisto.
								</FeatureItem>
							</ul>
						</div>
						<div>
							{/* Placeholder for an image or illustration */}
							<div className="bg-muted rounded-lg aspect-square w-full max-w-md mx-auto flex items-center justify-center">
								<img
									src="/placeholder.svg"
									alt="Ilustración de logística"
									className="w-2/3 h-2/3 object-contain opacity-50"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Clients Section */}
			<section className="py-20 bg-muted/40">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-10">
						Confían en Nosotros
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center">
						{CLIENT_LOGOS.map((src, i) => (
							<div
								key={i}
								className="h-20 rounded-lg bg-background flex items-center justify-center p-4 transition hover:shadow-lg"
							>
								<img
									src={src}
									alt={`Cliente ${i + 1}`}
									className="max-h-full max-w-full object-contain opacity-70"
								/>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 md:py-28">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl md:text-4xl font-bold">
						¿Listo para optimizar tu logística?
					</h2>
					<p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
						Hablemos de tus necesidades. Nuestro equipo está listo para diseñar un
						plan logístico que impulse el crecimiento de tu negocio.
					</p>
					<div className="mt-8">
						<Button size="lg" asChild>
							<a href="/cotizacion">
								Solicitar Cotización{" "}
								<ArrowRight className="w-4 h-4 ml-2" />
							</a>
						</Button>
					</div>
				</div>
			</section>
		</Layout>
	);
}

function ServiceCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="bg-background p-6 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300">
			<div className="mb-4">{icon}</div>
			<h3 className="text-xl font-bold mb-2">{title}</h3>
			<p className="text-muted-foreground">{description}</p>
		</div>
	);
}

function FeatureItem({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<li className="flex">
			<div className="flex-shrink-0">
				<div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
					<CheckIcon className="h-6 w-6" />
				</div>
			</div>
			<div className="ml-4">
				<h4 className="text-lg font-medium leading-6">{title}</h4>
				<p className="mt-1 text-muted-foreground">{children}</p>
			</div>
		</li>
	);
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="20 6 9 17 4 12" />
		</svg>
	);
}

import { Link, NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { useMemo } from "react";
import { getUser } from "@/lib/auth";
import { motion } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useMemo(() => getUser(), []);
  return (
    <div className="flex flex-col min-h-screen bg-siner-blue text-siner-white">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-siner-blue/80 backdrop-blur-sm shadow-lg sticky top-0 z-50"
      >
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link to="/" className="text-3xl font-extrabold text-white">
            Transportes Ferreyra
          </Link>
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <NavLink
                  to="/viajes"
                  className={({ isActive }) =>
                    `text-lg font-semibold transition-colors ${
                      isActive ? "text-siner-orange" : "text-white/70 hover:text-white"
                    }`
                  }
                >
                  Mis Viajes
                </NavLink>
                <Button
                  variant="default"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                >
                  Salir
                </Button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-lg font-semibold transition-colors ${
                    isActive ? "text-siner-orange" : "text-white/70 hover:text-white"
                  }`
                }
              >
                Ingresar
              </NavLink>
            )}
          </nav>
        </div>
      </motion.header>
      <main className="flex-grow container mx-auto p-4 pt-8">{children}</main>
      <footer className="bg-siner-blue border-t border-siner-orange/20 text-siner-gray py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Transportes Ferreyra</h3>
            <p>Soluciones de logística y transporte para tu negocio.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-siner-orange">Inicio</Link></li>
              <li><Link to="/viajes" className="hover:text-siner-orange">Viajes</Link></li>
              <li><Link to="/login" className="hover:text-siner-orange">Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contacto</h3>
            <p>Email: contacto@transportesferreyra.com</p>
            <p>Teléfono: +54 11 1234-5678</p>
          </div>
        </div>
        <div className="text-center mt-8 border-t border-siner-blue/50 pt-4">
          <p>&copy; {new Date().getFullYear()} Transportes Ferreyra. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

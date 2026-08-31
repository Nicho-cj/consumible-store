import { useState } from 'react';
import { Mail, Lock, Wrench, ArrowRight, Printer } from 'lucide-react';
import Button from '../components/common/Button';

const LoginPage = ({ onLoginAdmin, onAccessTechnician }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmitAdmin = (e) => {
        e.preventDefault();
        if (onLoginAdmin) {
            onLoginAdmin({ email, password });
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0F172A] flex flex-col justify-between items-center p-4">
            {/* Espaciador superior */}
            <div className="w-full max-w-md pt-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Sistema de Gestión de Servicio Técnico
                </span>
            </div>

            {/* Tarjeta de Login Centrada */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 space-y-6">
                {/* Logo e Identidad de Marca */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#55720C]/10 text-[#55720C] mb-1">
                        <Printer size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Consumibles Store
                    </h1>
                    <p className="text-xs text-slate-500">
                        Ingresa tus credenciales de administrador para continuar
                    </p>
                </div>

                {/* Formulario de Administrador */}
                <form onSubmit={handleSubmitAdmin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-slate-700">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Mail size={16} />
                            </div>
                            <input
                                type="text"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Administrador 1"
                                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#55720C] focus:ring-1 focus:ring-[#55720C] text-slate-800 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="block text-xs font-medium text-slate-700">
                                Contraseña
                            </label>
                            <a
                                href="#forgot"
                                onClick={(e) => e.preventDefault()}
                                className="text-[11px] font-medium text-[#55720C] hover:underline"
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock size={16} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#55720C] focus:ring-1 focus:ring-[#55720C] text-slate-800 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full justify-center py-2.5 text-xs font-semibold shadow-md"
                    >
                        <span>Iniciar Sesión</span>
                        <ArrowRight size={15} className="ml-1" />
                    </Button>
                </form>

                {/* Separador */}
                <div className="relative flex items-center justify-center my-4">
                    <div className="border-t border-[#E2E8F0] w-full"></div>
                    <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute">
                        O
                    </span>
                </div>

                {/* Acceso Directo Técnico */}
                <div>
                    <button
                        type="button"
                        onClick={onAccessTechnician}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-all active:scale-[0.99]"
                    >
                        <Wrench size={15} className="text-[#55720C]" />
                        <span>Acceso Interfaz Técnica Comunitaria</span>
                    </button>
                    <p className="text-[10px] text-slate-400 text-center mt-2">
                        Acceso directo sin contraseña para el personal de taller
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="py-4 text-center">
                <p className="text-[11px] text-slate-500">
                    © 2026 Consumibles Store. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
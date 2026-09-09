import { useState } from 'react';
import { User, Lock, Wrench, ArrowRight, Printer, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';

// @REVISAR: Login actualizado - el admin ingresa NOMBRE DE USUARIO + contrasena (sin email).
// El tecnico accede por el boton comunitario sin credenciales.
const LoginPage = ({ onLoginAdmin, onAccessTechnician }) => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmitAdmin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await onLoginAdmin({ usuario, password });
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0F172A] flex flex-col justify-between items-center p-4">
            <div className="w-full max-w-md pt-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Sistema de Gestión de Servicio Técnico
                </span>
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 space-y-6">
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

                {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                        <AlertCircle size={15} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmitAdmin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-slate-700">
                            Usuario
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <User size={16} />
                            </div>
                            <input
                                type="text"
                                required
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                placeholder="jesus"
                                autoComplete="username"
                                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#55720C] focus:ring-1 focus:ring-[#55720C] text-slate-800 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-slate-700">
                            Contraseña
                        </label>
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
                                autoComplete="current-password"
                                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#55720C] focus:ring-1 focus:ring-[#55720C] text-slate-800 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full justify-center py-2.5 text-xs font-semibold shadow-md"
                        disabled={loading}
                    >
                        <span>{loading ? 'Verificando...' : 'Iniciar Sesión'}</span>
                        <ArrowRight size={15} className="ml-1" />
                    </Button>
                </form>

                <div className="relative flex items-center justify-center my-4">
                    <div className="border-t border-[#E2E8F0] w-full"></div>
                    <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute">
                        O
                    </span>
                </div>

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
                        Acceso directo sin contrasena para el personal de taller
                    </p>
                </div>
            </div>

            <div className="py-4 text-center">
                <p className="text-[11px] text-slate-500">
                    © 2026 Consumibles Store. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

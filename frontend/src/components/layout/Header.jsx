import { useState } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';

// @REVISAR: Header actualizado - muestra el usuario logueado y boton de cerrar sesion
const Header = ({ currentUser, onLogout }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <header className="flex justify-between items-center h-16 px-6 w-full bg-white border-b border-[#E2E8F0] sticky top-0 z-10 shadow-sm">
            {/* Lado Izquierdo: Título de la app */}
            <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">
                    Consumibles <span className="text-[#97C719]">Servicio</span>
                </p>
            </div>

            {/* Lado Derecho: Acciones Globales */}
            <div className="flex items-center space-x-3">
                {/* Menú de usuario con cerrar sesión */}
                {currentUser && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-lg hover:bg-slate-100 transition-all focus:outline-none"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#55720C] text-white flex items-center justify-center text-xs font-bold uppercase">
                                {currentUser.nombre?.charAt(0) || 'A'}
                            </div>
                            <span className="text-xs font-semibold text-slate-700">{currentUser.nombre}</span>
                            <ChevronDown size={14} className="text-slate-400" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-30">
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <p className="text-xs font-bold text-slate-800">{currentUser.nombre}</p>
                                    <p className="text-[10px] text-slate-400">{currentUser.rol === 'ADMIN_RECEPCION' ? 'Administrador / Recepción' : 'Técnico'}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMenu(false);
                                        onLogout && onLogout();
                                        window.location.href = '/login';
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-all"
                                >
                                    <LogOut size={14} />
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

import { useState } from 'react';
import { Search, Bell, Settings, LogOut, ChevronDown } from 'lucide-react';

// @REVISAR: Header actualizado - muestra el usuario logueado y boton de cerrar sesion
const Header = ({ onSearch, hasUnreadNotifications = true, currentUser, onLogout }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <header className="flex justify-between items-center h-16 px-6 w-full bg-white border-b border-[#E2E8F0] sticky top-0 z-10 shadow-sm">
            {/* Lado Izquierdo: Campo de Busqueda */}
            <div className="flex-1 max-w-md">
                <div className="relative flex items-center w-full h-10 rounded-md border border-[#E2E8F0] bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#97C719] focus-within:border-transparent transition-all">
                    <div className="grid place-items-center h-full w-10 text-slate-400 shrink-0">
                        <Search size={18} />
                    </div>
                    <input
                        id="search"
                        type="text"
                        placeholder="Buscar técnicos, órdenes o equipos..."
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                        className="h-full w-full outline-none text-xs text-slate-800 bg-transparent pr-3 placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Lado Derecho: Acciones Globales */}
            <div className="flex items-center space-x-3">
                {/* Botón Notificaciones */}
                <button
                    type="button"
                    aria-label="Notificaciones"
                    className="p-2 text-slate-500 hover:bg-slate-100 transition-all rounded-full relative focus:outline-none focus:ring-2 focus:ring-[#97C719] cursor-pointer"
                >
                    <Bell size={20} />
                    {hasUnreadNotifications && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full border border-white" />
                    )}
                </button>

                {/* Botón Configuración */}
                <button
                    type="button"
                    aria-label="Configuración"
                    className="p-2 text-slate-500 hover:bg-slate-100 transition-all rounded-full focus:outline-none focus:ring-2 focus:ring-[#97C719] cursor-pointer"
                >
                    <Settings size={20} />
                </button>

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

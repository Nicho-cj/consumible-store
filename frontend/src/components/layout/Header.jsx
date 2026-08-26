import { Search, Bell, Settings } from 'lucide-react';

const Header = ({ onSearch, hasUnreadNotifications = true }) => {
    return (
        <header className="flex justify-between items-center h-16 px-6 w-full bg-white border-b border-[#E2E8F0] sticky top-0 z-10 shadow-sm">
            {/* Lado Izquierdo: Campo de Búsqueda */}
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
            </div>
        </header>
    );
};

export default Header;
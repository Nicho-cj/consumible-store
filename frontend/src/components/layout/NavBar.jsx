import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    Wrench,
    FileSpreadsheet,
    Plus,
    Printer,
    Wrench as BuildIcon
} from 'lucide-react';
import Button from '../common/Button';

const NavBar = ({ currentRole, onOpenNewOrderModal }) => {
    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN_RECEPCION'] },
        { path: '/ordenes', label: 'Órdenes de Servicio', icon: ClipboardList, roles: ['ADMIN_RECEPCION', 'TECNICO'] },
        { path: '/clientes', label: 'Clientes', icon: Users, roles: ['ADMIN_RECEPCION'] },
        { path: '/equipos', label: 'Equipos', icon: Printer, roles: ['ADMIN_RECEPCION'] },
        { path: '/tecnicos', label: 'Técnicos', icon: Wrench, roles: ['ADMIN_RECEPCION'] },
        { path: '/reportes', label: 'Log / Reportes', icon: FileSpreadsheet, roles: ['ADMIN_RECEPCION'] },
    ];

    const filteredItems = menuItems.filter((item) => item.roles.includes(currentRole));

    return (
        <aside className="fixed h-screen w-[260px] left-0 top-0 bg-[#0F172A] flex flex-col py-6 shadow-sm z-20">
            {/* Branding Header */}
            <div className="px-6 mb-8 flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-[#97C719] flex items-center justify-center shrink-0">
                    <BuildIcon className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="font-bold text-base text-white leading-tight tracking-wide">
                        CONSUMIBLE STORE
                    </h1>
                    <p className="text-[11px] text-slate-400">Control de Servicio Técnico</p>
                </div>
            </div>

            {/* BOTON Crear Orden */}
            {currentRole === 'ADMIN_RECEPCION' && (
                <div className="px-4 mb-6">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={onOpenNewOrderModal}
                    >
                        <Plus size={16} />
                        <span>Nueva Orden</span>
                    </Button>
                </div>
            )}

            {/* Nav principal */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {filteredItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-3 py-2 rounded-md text-xs transition-colors scale-95 duration-150 ${isActive
                                    ? 'text-[#97C719] font-bold border-r-4 border-[#97C719] bg-white/5'
                                    : 'text-slate-400 font-normal hover:bg-white/10 hover:text-white'
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};

export default NavBar;
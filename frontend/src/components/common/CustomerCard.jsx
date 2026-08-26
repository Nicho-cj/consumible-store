import { Phone, FileText, CreditCard } from 'lucide-react';
import Card from './Card';

const CustomerCard = ({ customer = {}, onClick }) => {
    const {
        nombre = 'Sin Nombre',
        cedulaRif,
        documento,
        telefono,
        estado = 'ACTIVE',
        totalOrdenes,
        ordenesActivas = [],
        historialOrdenes = [],
    } = customer;

    // Acepta cedulaRif o documento según entregue la data
    const docIdentidad = cedulaRif || documento;

    // Calcula el total si no viene explícito en las props
    const cantidadOrdenes =
        typeof totalOrdenes === 'number'
            ? totalOrdenes
            : ordenesActivas.length + historialOrdenes.length;

    // Soporta 'ACTIVE', 'activo', 'IDLE', 'inactivo'
    const normalizedEstado = String(estado).toUpperCase();
    const isActive = normalizedEstado === 'ACTIVE' || normalizedEstado === 'ACTIVO';

    return (
        <Card
            onClick={onClick}
            className={`relative overflow-hidden p-5 transition-all duration-200 hover:shadow-md cursor-pointer border-l-4 ${isActive ? 'border-l-[#97C719]' : 'border-l-slate-300'
                }`}
        >
            <div className="space-y-4">
                {/* Nombre del Cliente / Empresa */}
                <div>
                    <h3 className="font-bold text-slate-800 text-base leading-snug truncate">
                        {nombre}
                    </h3>
                </div>

                {/* Datos de Contacto */}
                <div className="space-y-2 text-xs text-slate-600">
                    {docIdentidad && (
                        <div className="flex items-center gap-2.5">
                            <CreditCard size={14} className="text-slate-400 shrink-0" />
                            <span className="font-mono">{docIdentidad}</span>
                        </div>
                    )}

                    {telefono && (
                        <div className="flex items-center gap-2.5">
                            <Phone size={14} className="text-slate-400 shrink-0" />
                            <span className="font-mono">{telefono}</span>
                        </div>
                    )}
                </div>

                {/* Footer de Tarjeta */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold tracking-wider text-[11px]">
                        <span
                            className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#97C719]' : 'bg-slate-300'
                                }`}
                        />
                        <span className={isActive ? 'text-slate-700' : 'text-slate-400'}>
                            {isActive ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                    </div>

                    <div className="bg-[#F3F7E9] text-[#55720C] font-semibold px-2.5 py-1 rounded flex items-center gap-1.5 text-xs">
                        <FileText size={13} className="opacity-70" />
                        <span>
                            {cantidadOrdenes} {cantidadOrdenes === 1 ? 'Orden' : 'Órdenes'}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CustomerCard;
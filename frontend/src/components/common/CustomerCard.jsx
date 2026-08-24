import React from 'react';
import { Phone, FileText, CreditCard } from 'lucide-react';
import Card from './Card';

const CustomerCard = ({ customer, onClick }) => {
    const {
        nombre,         // Persona Natural o Razón Social
        documento,      // V-12345678, J-12345678-0, etc.
        telefono,
        estado = 'ACTIVE',
        totalOrdenes = 0,
    } = customer;

    const isActive = estado === 'ACTIVE';

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

                {/* Datos de Contacto Generalizados (Sin Email) */}
                <div className="space-y-2 text-xs text-slate-600">
                    {documento && (
                        <div className="flex items-center gap-2.5">
                            <CreditCard size={14} className="text-slate-400 shrink-0" />
                            <span className="font-mono">{documento}</span>
                        </div>
                    )}

                    {telefono && (
                        <div className="flex items-center gap-2.5">
                            <Phone size={14} className="text-slate-400 shrink-0" />
                            <span className="font-mono">{telefono}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
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
                            {totalOrdenes} {totalOrdenes === 1 ? 'Órden' : 'Órdenes'}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CustomerCard;
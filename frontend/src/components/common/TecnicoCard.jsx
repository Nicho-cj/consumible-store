import { BarChart2 } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const TecnicoCard = ({ technician, onViewOrders, onViewReport }) => {
    const {
        nombre,
        cargo,
        estado = 'ACTIVE', // 'ACTIVE' | 'ON_BREAK' | 'OFF_DUTY'
        ordenesActuales = [],
    } = technician;

    // Mapeo de estados del técnico
    const statusConfig = {
        ACTIVE: { label: 'Activo', bg: 'bg-[#97C719]', text: 'text-slate-800' },
        ON_BREAK: { label: 'En Pausa', bg: 'bg-amber-400', text: 'text-slate-800' },
        OFF_DUTY: { label: 'Inactivo', bg: 'bg-slate-300', text: 'text-slate-500' },
    };

    const currentStatus = statusConfig[estado] || statusConfig.ACTIVE;

    return (
        <Card className="p-5 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
            <div className="space-y-4">

                {/* Cabecera: Nombre y Estatus (Sin Imagen) */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                        <h3 className="font-bold text-slate-800 text-base leading-snug">
                            {nombre}
                        </h3>
                        {cargo && (
                            <p className="text-xs text-slate-500 mt-0.5">{cargo}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 font-semibold text-[11px] shrink-0">
                        <span className={`w-2 h-2 rounded-full ${currentStatus.bg}`} />
                        <span className={currentStatus.text}>{currentStatus.label}</span>
                    </div>
                </div>

                {/* Sección Central: Órdenes Asignadas */}
                <div className="text-xs">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                            Órdenes Actuales ({ordenesActuales.length})
                        </span>

                        {ordenesActuales.length > 0 ? (
                            <div className="space-y-1.5">
                                {ordenesActuales.map((ord) => (
                                    <div
                                        key={ord.codigo}
                                        className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200/60 font-mono text-[11px]"
                                    >
                                        <span className="font-semibold text-slate-700">{ord.codigo}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                                            {ord.estatus}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-[11px]">Sin órdenes activas</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer: Acciones del Técnico */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                    onClick={onViewOrders}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                    Ver todas las órdenes
                </button>

                <Button
                    size="sm"
                    variant="secondary"
                    icon={BarChart2}
                    onClick={onViewReport}
                    className="text-xs"
                >
                    Reporte
                </Button>
            </div>
        </Card>
    );
};

export default TecnicoCard;
import { Wrench, User, Laptop, Calendar, AlertCircle, Clock, CheckCircle2, FileText } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const OrdenDetalleModal = ({ isOpen, onClose, order }) => {
    if (!order) return null;

    // Configuración visual según el estatus de la orden
    const statusConfig = {
        'En Espera': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
        'En Diagnóstico': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Wrench },
        'Reparado': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
        'Entregado': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', icon: CheckCircle2 },
    };

    const currentStatus = statusConfig[order.estatus] || statusConfig['En Espera'];
    const StatusIcon = currentStatus.icon;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Orden de Servicio #${order.numeroOrden || order.codigo || order.id}`}
        >
            <div className="space-y-5">
                {/* Cabecera de Estatus y Fecha */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Estatus:</span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}>
                            <StatusIcon size={13} />
                            {order.estatus || 'En Espera'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar size={13} />
                        <span>Ingreso: <strong className="text-slate-700">{order.fechaIngreso || order.fecha || 'N/A'}</strong></span>
                    </div>
                </div>

                {/* Sección 1: Información del Cliente */}
                <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 border-b border-[#E2E8F0] pb-1">
                        <User size={14} className="text-[#55720C]" />
                        <span>DATOS DEL CLIENTE</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                        <div>
                            <span className="text-slate-400 block font-medium">Nombre / Razon Social</span>
                            <span className="font-semibold text-slate-800">{order.cliente?.nombre || order.clienteNombre || 'Cliente No Registrado'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Cédula / RIF</span>
                            <span className="font-mono text-slate-700">{order.cliente?.cedulaRif || order.clienteDocumento || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Teléfono Contacto</span>
                            <span className="font-mono text-slate-700">{order.cliente?.telefono || order.clienteTelefono || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Correo Electrónico</span>
                            <span className="text-slate-700">{order.cliente?.email || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Sección 2: Información del Equipo */}
                <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 border-b border-[#E2E8F0] pb-1">
                        <Laptop size={14} className="text-[#55720C]" />
                        <span>DATOS DEL EQUIPO</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                        <div>
                            <span className="text-slate-400 block font-medium">Equipo / Tipo</span>
                            <span className="font-semibold text-slate-800">{order.equipo?.tipo || order.tipoEquipo || 'Impresora / Fotocopiadora'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Marca y Modelo</span>
                            <span className="font-semibold text-slate-800">{order.equipo?.modelo || order.equipoModelo || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Número de Serie</span>
                            <span className="font-mono text-slate-700">{order.equipo?.serie || order.equipoSerie || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Sección 3: Falla Reportada y Accesorios */}
                <div className="space-y-3 text-xs">
                    <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-800">
                            <AlertCircle size={14} />
                            <span>Falla Reportada por el Cliente</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                            {order.fallaReportada || order.descripcionFalla || 'No se especificó detalle de la falla al ingresar.'}
                        </p>
                    </div>

                    {order.accesorios && (
                        <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg">
                            <span className="text-slate-400 font-medium block mb-0.5">Accesorios / Observaciones de Recepción:</span>
                            <p className="text-slate-700">{order.accesorios}</p>
                        </div>
                    )}
                </div>

                {/* Sección 4: Técnico Asignado */}
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                        <Wrench size={14} className="text-slate-400" />
                        <span className="text-slate-500">Técnico Asignado:</span>
                        <span className="font-semibold text-slate-800">{order.tecnicoAsignado || 'Sin Asignar'}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end pt-3 border-t border-[#E2E8F0]">
                    <Button variant="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default OrdenDetalleModal;
import { useState } from 'react';
import { Wrench, User, Laptop, Calendar, AlertCircle, CheckCircle2, XCircle, PackageCheck, Hash } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { ORDER_STATUS, STATUS_FLOW, STATUS_CONFIG } from '../../utils/status';
import { responderCotizacion, patchOrden } from '../../api/ordenes';

const FlowProgress = ({ currentStatus }) => {
    const currentIdx = STATUS_FLOW.indexOf(currentStatus);
    const isCancelled = currentStatus === ORDER_STATUS.CANCELADO;

    return (
        <div className="flex items-center gap-1 w-full py-3">
            {STATUS_FLOW.map((status, idx) => {
                const isCompleted = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                const config = STATUS_CONFIG[status];

                return (
                    <div key={status} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                                    isCompleted
                                        ? 'bg-[#55720C] border-[#55720C] text-white'
                                        : isCurrent
                                            ? 'bg-white border-[#55720C] text-[#55720C] shadow-md'
                                            : 'bg-slate-100 border-slate-300 text-slate-400'
                                }`}
                            >
                                {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                            </div>
                            <span className={`text-[9px] font-semibold mt-1 text-center leading-tight ${
                                isCurrent ? 'text-[#55720C]' : isCompleted ? 'text-slate-600' : 'text-slate-400'
                            }`}>
                                {config?.label || status}
                            </span>
                        </div>
                        {idx < STATUS_FLOW.length - 1 && (
                            <div className={`h-0.5 w-full mx-1 rounded ${
                                idx < currentIdx ? 'bg-[#55720C]' : 'bg-slate-200'
                            }`} />
                        )}
                    </div>
                );
            })}
            {isCancelled && (
                <>
                    <div className="h-0.5 w-full mx-1 rounded bg-red-300" />
                    <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 bg-red-500 border-red-500 text-white">
                            <XCircle size={14} />
                        </div>
                        <span className="text-[9px] font-semibold mt-1 text-red-500">Cancelado</span>
                    </div>
                </>
            )}
        </div>
    );
};

const OrdenDetalleModal = ({ isOpen, onClose, order, onUpdateOrder, onNotify }) => {
    const [showCloseForm, setShowCloseForm] = useState(false);
    const [contadorFinal, setContadorFinal] = useState('');
    const [montoCobro, setMontoCobro] = useState('');
    const [numeroFactura, setNumeroFactura] = useState('');
    const [closeError, setCloseError] = useState('');
    const [saving, setSaving] = useState(false);

    if (!order) return null;

    const currentStatus = order.estado || ORDER_STATUS.REGISTRADO;

    // FASE 5-1: respuestas de cotizacion reales via PATCH /ordenes/:id/cotizacion (RF-07)
    const handleApprove = async () => {
        if (!order.id || saving) return;
        setSaving(true);
        try {
            const updated = await responderCotizacion(order.id, true);
            onUpdateOrder?.(updated);
            onNotify?.('Cotización aprobada. La orden volvió a la vista del técnico.');
            onClose();
        } catch (err) {
            alert(`Error al aprobar la cotización: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleReject = async () => {
        if (!order.id || saving) return;
        setSaving(true);
        try {
            const updated = await responderCotizacion(order.id, false);
            onUpdateOrder?.(updated);
            onNotify?.('Cotización rechazada. La orden fue cancelada.');
            onClose();
        } catch (err) {
            alert(`Error al rechazar la cotización: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleOpenCloseForm = () => {
        setShowCloseForm(true);
        setContadorFinal(order.contadorInicial || '');
        setMontoCobro('');
        setNumeroFactura('');
        setCloseError('');
    };

    const handleDeliver = async () => {
        const cnt = parseInt(contadorFinal, 10);
        const monto = parseFloat(montoCobro);

        if (isNaN(cnt) || cnt < 0) {
            setCloseError('El contador final debe ser un número válido.');
            return;
        }
        if (order.contadorInicial && cnt < order.contadorInicial) {
            setCloseError(`El contador final (${cnt}) no puede ser menor al inicial (${order.contadorInicial}).`);
            return;
        }
        if (isNaN(monto) || monto < 0) {
            setCloseError('El monto de cobro debe ser un número válido.');
            return;
        }
        if (!order.id || saving) return;

        setSaving(true);
        try {
            // PATCH /ordenes/:id -> estado ENTREGADO + contador_final + monto_cobro + numero_factura (RF-08/RF-09)
            const payload = {
                estado: 'ENTREGADO',
                contador_final: cnt,
                monto_cobro: monto,
            };
            const factura = numeroFactura.trim();
            const numFactura = parseInt(factura.replace(/[^\d]/g, ''), 10);
            if (factura && !Number.isNaN(numFactura)) payload.numero_factura = numFactura;

            const updated = await patchOrden(order.id, payload);
            onUpdateOrder?.(updated);
            setShowCloseForm(false);
            onNotify?.(factura ? `Entrega registrada. Factura N° ${numFactura}.` : 'Entrega registrada con éxito.');
            onClose();
        } catch (err) {
            setCloseError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Orden de Servicio #${order.codigo || order.id}`}
            maxWidth="max-w-3xl"
        >
            <div className="space-y-5">
                <FlowProgress currentStatus={currentStatus} />

                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Estatus:</span>
                        <StatusBadge status={currentStatus} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                            <Calendar size={13} />
                            <span>Ingreso: <strong className="text-slate-700">{order.fechaIngreso || 'N/A'}</strong></span>
                        </div>
                        {order.fechaEntregado && (
                            <div className="flex items-center gap-1">
                                <Calendar size={13} />
                                <span>Entregado: <strong className="text-slate-700">{order.fechaEntregado}</strong></span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 border-b border-slate-200 pb-1">
                        <User size={14} className="text-[#55720C]" />
                        <span>DATOS DEL CLIENTE</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div>
                            <span className="text-slate-400 block font-medium">Nombre / Razón Social</span>
                            <span className="font-semibold text-slate-800">{order.clienteNombre || 'Cliente No Registrado'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Cédula / RIF</span>
                            <span className="font-mono text-slate-700">{order.clienteCedulaRif || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Teléfono Contacto</span>
                            <span className="font-mono text-slate-700">{order.clienteTelefono || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Correo Electrónico</span>
                            <span className="text-slate-700">{order.clienteEmail || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 border-b border-slate-200 pb-1">
                        <Laptop size={14} className="text-[#55720C]" />
                        <span>DATOS DEL EQUIPO</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div>
                            <span className="text-slate-400 block font-medium">Equipo / Tipo</span>
                            <span className="font-semibold text-slate-800">{order.tipoEquipo || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Marca y Modelo</span>
                            <span className="font-semibold text-slate-800">{order.equipoModelo || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Número de Serie</span>
                            <span className="font-mono text-slate-700">{order.equipoSerie || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 text-xs">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-800">
                            <AlertCircle size={14} />
                            <span>Falla Reportada por el Cliente</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                            {order.fallaReportada || 'No se especificó detalle de la falla al ingresar.'}
                        </p>
                    </div>

                    {order.diagnostico && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-blue-800">
                                <Wrench size={14} />
                                <span>Diagnóstico Técnico</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">{order.diagnostico}</p>
                        </div>
                    )}

                    {order.repuestosUsados && order.repuestosUsados.length > 0 && (
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <span className="text-purple-700 font-bold block mb-1">Repuestos Utilizados:</span>
                            <ul className="list-disc list-inside text-slate-700">
                                {order.repuestosUsados.map((r, i) => (
                                    <li key={i}>{r.nombre} {r.cantidad > 1 ? `(x${r.cantidad})` : ''}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {order.accesorios && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <span className="text-slate-400 font-medium block mb-0.5">Accesorios / Observaciones de Recepción:</span>
                            <p className="text-slate-700">{order.accesorios}</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                        <Wrench size={14} className="text-slate-400" />
                        <span className="text-slate-500">Técnico Asignado:</span>
                        <span className="font-semibold text-slate-800">{order.tecnicoAsignado || 'Sin Asignar'}</span>
                    </div>
                    {order.contadorInicial > 0 && (
                        <div className="flex items-center gap-2">
                            <Hash size={14} className="text-slate-400" />
                            <span className="text-slate-500">Contador Inicial:</span>
                            <span className="font-mono font-semibold text-slate-800">{order.contadorInicial.toLocaleString()}</span>
                        </div>
                    )}
                    {order.numeroFactura && (
                        <div className="flex items-center gap-2">
                            <Hash size={14} className="text-emerald-500" />
                            <span className="text-slate-500">N° Factura:</span>
                            <span className="font-mono font-bold text-slate-800">{order.numeroFactura}</span>
                        </div>
                    )}
                </div>

                {currentStatus === ORDER_STATUS.SOLUCION_COTIZACION && (
                    <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg space-y-3">
                        <p className="text-xs font-bold text-amber-800">
                            El técnico ha enviado esta orden con diagnóstico. Contacte al cliente para confirmar si aprueba el trabajo.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="primary" size="sm" icon={CheckCircle2} onClick={handleApprove} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
                                {saving ? 'Procesando...' : 'Cliente Aprobó'}
                            </Button>
                            <Button variant="danger" size="sm" icon={XCircle} onClick={handleReject} disabled={saving}>
                                Cliente Rechazó
                            </Button>
                        </div>
                    </div>
                )}

                {currentStatus === ORDER_STATUS.LISTO_ENTREGA && !showCloseForm && (
                    <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-lg space-y-3">
                        <p className="text-xs font-bold text-emerald-800">
                            El technician ha finalizado el trabajo. El equipo está listo para entregar al cliente.
                        </p>
                        <Button variant="primary" size="sm" icon={PackageCheck} onClick={handleOpenCloseForm}>
                            Entregar Equipo al Cliente
                        </Button>
                    </div>
                )}

                {showCloseForm && (
                    <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-lg space-y-3">
                        <p className="text-xs font-bold text-emerald-800">Registrar Entrega del Equipo</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1">Contador Final de Impresiones</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={contadorFinal}
                                    onChange={(e) => { setContadorFinal(e.target.value); setCloseError(''); }}
                                    className="w-full text-xs p-2.5 border border-slate-300 rounded-md font-mono focus:ring-2 focus:ring-[#97C719] focus:outline-none"
                                />
                                {order.contadorInicial > 0 && (
                                    <span className="text-[10px] text-slate-400 mt-1 block">
                                        Inicial: {order.contadorInicial.toLocaleString()} | Impresiones: {Math.max(0, (parseInt(contadorFinal, 10) || 0) - order.contadorInicial)}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1">Monto de Cobro ($)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={montoCobro}
                                    onChange={(e) => { setMontoCobro(e.target.value); setCloseError(''); }}
                                    className="w-full text-xs p-2.5 border border-slate-300 rounded-md font-mono focus:ring-2 focus:ring-[#97C719] focus:outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1">N° Factura (opcional)</label>
                                <input
                                    type="text"
                                    value={numeroFactura}
                                    onChange={(e) => { setNumeroFactura(e.target.value); setCloseError(''); }}
                                    className="w-full text-xs p-2.5 border border-slate-300 rounded-md font-mono focus:ring-2 focus:ring-[#97C719] focus:outline-none"
                                    placeholder="Ej. 0001-234567"
                                />
                                <span className="text-[10px] text-slate-400 mt-1 block">Si se registra, se muestra en el comprobante.</span>
                            </div>
                        </div>
                        {closeError && (
                            <p className="text-xs text-red-600 font-medium bg-red-50 border border-red-200 rounded px-3 py-2">{closeError}</p>
                        )}
                        <div className="flex gap-2 justify-end">
                            <Button variant="secondary" size="sm" onClick={() => setShowCloseForm(false)}>Cancelar</Button>
                            <Button variant="primary" size="sm" icon={CheckCircle2} onClick={handleDeliver} disabled={saving}>
                                {saving ? 'Entregando...' : 'Confirmar Entrega'}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-3 border-t border-slate-200">
                    <Button variant="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default OrdenDetalleModal;

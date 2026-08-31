// src/components/modals/TecnicoDiagnosticoModal.jsx
import { useState, useEffect } from 'react';
import { Wrench, CheckCircle, Plus, Trash2, X, Lock, PackageCheck, PlayCircle, WrenchIcon } from 'lucide-react';
import Button from '../common/Button';
import { ORDER_STATUS } from '../../data/ordenesData';

const TecnicoDiagnosticoModal = ({ isOpen, onClose, order, onSaveStatus }) => {
    const [diagnostico, setDiagnostico] = useState('');
    const [repuestosUtilizados, setRepuestosUtilizados] = useState([]);

    // Inputs para agregar repuestos/insumos usados
    const [nuevoRepuestoNombre, setNuevoRepuestoNombre] = useState('');
    const [nuevoRepuestoCantidad, setNuevoRepuestoCantidad] = useState(1);

    useEffect(() => {
        if (order) {
            setDiagnostico(order.diagnostico || order.detallesDiagnostico || '');
            setRepuestosUtilizados(order.repuestos || order.repuestosUsados || []);
        }
    }, [order]);

    if (!isOpen || !order) return null;

    const estadoActual = order.estado || order.status;

    // Estados de solo lectura para el modal
    const isReadOnly = [
        ORDER_STATUS.ESPERANDO_APROBACION,
        ORDER_STATUS.LISTO,
        ORDER_STATUS.ENTREGADO,
        ORDER_STATUS.CANCELADO
    ].includes(estadoActual);

    // Banderas de estado específico
    const esOrdenSinIniciar = estadoActual === ORDER_STATUS.PENDIENTE || estadoActual === ORDER_STATUS.RECIBIDO;
    const esEnDiagnostico = estadoActual === ORDER_STATUS.EN_DIAGNOSTICO;
    const esEnReparacion = estadoActual === ORDER_STATUS.EN_REPARACION;
    const esOrdenEnProceso = esEnDiagnostico || esEnReparacion;

    const handleAddRepuesto = (e) => {
        e.preventDefault();
        if (isReadOnly || !nuevoRepuestoNombre.trim()) return;

        const cantNum = parseInt(nuevoRepuestoCantidad, 10) || 1;
        const nuevoItem = {
            id: Date.now(),
            nombre: nuevoRepuestoNombre.trim(),
            cantidad: cantNum
        };

        setRepuestosUtilizados([...repuestosUtilizados, nuevoItem]);
        setNuevoRepuestoNombre('');
        setNuevoRepuestoCantidad(1);
    };

    const handleRemoveRepuesto = (id) => {
        if (isReadOnly) return;
        setRepuestosUtilizados(repuestosUtilizados.filter((item) => item.id !== id));
    };

    // ACCIÓN 1: Aceptar la orden (Pasa a EN_DIAGNOSTICO)
    const handleAceptarOrden = () => {
        const ordenActualizada = {
            ...order,
            estado: ORDER_STATUS.EN_DIAGNOSTICO,
            status: ORDER_STATUS.EN_DIAGNOSTICO
        };
        if (onSaveStatus) onSaveStatus(ordenActualizada);
        onClose();
    };

    // ACCIÓN 2: Pasar a / Mantener en Reparación (Guardar Avance)
    const handlePasarAReparacion = () => {
        const ordenActualizada = {
            ...order,
            diagnostico,
            estado: ORDER_STATUS.EN_REPARACION,
            status: ORDER_STATUS.EN_REPARACION,
            repuestosUsados: repuestosUtilizados,
            repuestos: repuestosUtilizados
        };
        if (onSaveStatus) onSaveStatus(ordenActualizada);
        onClose();
    };

    // ACCIÓN 3: Finalizar Trabajo (Pasa a LISTO)
    const handleFinalizarTrabajo = () => {
        const ordenActualizada = {
            ...order,
            diagnostico,
            estado: ORDER_STATUS.LISTO,
            status: ORDER_STATUS.LISTO,
            repuestosUsados: repuestosUtilizados,
            repuestos: repuestosUtilizados
        };
        if (onSaveStatus) onSaveStatus(ordenActualizada);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 bg-slate-800 text-white">
                    <div className="flex items-center gap-2">
                        <Wrench className="text-[#84A927]" size={20} />
                        <h3 className="font-bold text-lg">Diagnóstico y Trabajo Técnico</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

                    {/* Alerta de Estado Bloqueado */}
                    {isReadOnly && (
                        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-medium">
                            <Lock size={16} className="shrink-0 text-amber-500" />
                            <span>
                                Esta orden está en estado <strong>{estadoActual}</strong> y ha sido bloqueada para edición técnica.
                            </span>
                        </div>
                    )}

                    {/* Resumen de Entrada */}
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-slate-500 dark:text-slate-400 block font-medium">Orden:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{order.codigo || `#${order.id}`}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 dark:text-slate-400 block font-medium">Cliente:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{order.clienteNombre || order.cliente}</span>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
                            <span className="text-slate-500 dark:text-slate-400 block font-medium mb-1">Motivo / Falla Reportada por Recepción:</span>
                            <p className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-slate-700 dark:text-slate-300 rounded">
                                {order.fallaReportada || order.diagnosticoInicial || 'Sin detalle de entrada registrado.'}
                            </p>
                        </div>
                    </div>

                    {/* Paso 1: Si la orden aún no ha sido aceptada */}
                    {esOrdenSinIniciar && !isReadOnly && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg flex items-center justify-between">
                            <div className="text-xs text-blue-800 dark:text-blue-300">
                                <p className="font-bold">Orden Pendiente por Iniciar</p>
                                <p className="text-[11px] text-blue-600 dark:text-blue-400">Haz clic en aceptar para iniciar el diagnóstico técnico.</p>
                            </div>
                            <Button size="sm" variant="primary" icon={PlayCircle} onClick={handleAceptarOrden}>
                                Aceptar Orden
                            </Button>
                        </div>
                    )}

                    {/* Diagnóstico Técnico */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Informe Técnico / Observaciones
                        </label>
                        <textarea
                            rows={3}
                            disabled={isReadOnly || esOrdenSinIniciar}
                            value={diagnostico}
                            onChange={(e) => setDiagnostico(e.target.value)}
                            placeholder={esOrdenSinIniciar ? "Debes aceptar la orden para escribir el diagnóstico..." : "Escribe los hallazgos y trabajos realizados..."}
                            className={`w-full text-xs p-3 border rounded-lg focus:ring-2 focus:ring-[#84A927] focus:outline-none dark:bg-slate-700 dark:text-slate-100 ${isReadOnly || esOrdenSinIniciar
                                    ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700'
                                    : 'border-slate-300 dark:border-slate-600'
                                }`}
                        />
                    </div>

                    {/* Registro de Repuestos: Se oculta completamente si está EN_DIAGNOSTICO */}
                    {!esEnDiagnostico && (
                        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2">
                                <PackageCheck className="text-[#84A927]" size={18} />
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Repuestos e Insumos Utilizados
                                </label>
                            </div>

                            {/* Agregar Repuestos: Solo editable cuando está EN_REPARACION */}
                            {esEnReparacion && !isReadOnly && (
                                <form onSubmit={handleAddRepuesto} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Repuesto o pieza utilizada"
                                        value={nuevoRepuestoNombre}
                                        onChange={(e) => setNuevoRepuestoNombre(e.target.value)}
                                        className="flex-1 text-xs p-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-slate-100"
                                    />
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Cant."
                                        value={nuevoRepuestoCantidad}
                                        onChange={(e) => setNuevoRepuestoCantidad(e.target.value)}
                                        className="w-20 text-xs p-2 text-center border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-slate-100"
                                    />
                                    <Button type="submit" size="sm" variant="secondary" icon={Plus}>
                                        Agregar
                                    </Button>
                                </form>
                            )}

                            {/* Lista de Repuestos Utilizados */}
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                {repuestosUtilizados.length === 0 ? (
                                    <p className="text-center text-xs text-slate-400 py-3">
                                        No se registraron repuestos (sólo revisión/mano de obra).
                                    </p>
                                ) : (
                                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {repuestosUtilizados.map((item, index) => {
                                            const cantidadValor = item.cantidad || 1;
                                            return (
                                                <li key={item.id || index} className="flex justify-between items-center px-3 py-2 text-xs">
                                                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                                                        {item.nombre || item.descripcion}
                                                    </span>
                                                    <div className="flex items-center gap-4">
                                                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded font-semibold text-[11px]">
                                                            Cant: {cantidadValor}
                                                        </span>
                                                        {esEnReparacion && !isReadOnly && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveRepuesto(item.id)}
                                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer con Acciones */}
                <div className="flex justify-between items-center px-6 py-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="secondary" size="sm" onClick={onClose}>
                        {isReadOnly ? 'Cerrar' : 'Cancelar'}
                    </Button>

                    {!isReadOnly && esOrdenEnProceso && (
                        <div className="flex gap-2">
                            {/* En diagnóstico o en reparación muestra la opción de avanzar o guardar progreso en reparación */}
                            <Button variant="secondary" size="sm" icon={WrenchIcon} onClick={handlePasarAReparacion}>
                                {esEnReparacion ? 'Guardar Avance' : 'Pasar a Reparación'}
                            </Button>

                            {/* Solo se puede marcar como Listo si la orden ya está EN_REPARACION */}
                            {esEnReparacion && (
                                <Button variant="primary" size="sm" icon={CheckCircle} onClick={handleFinalizarTrabajo}>
                                    Finalizar y Marcar como Listo
                                </Button>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default TecnicoDiagnosticoModal;
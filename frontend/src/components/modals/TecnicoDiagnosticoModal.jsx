import { useState, useEffect } from 'react';
import { Wrench, CheckCircle, Plus, Trash2, X, Lock, PackageCheck, PlayCircle } from 'lucide-react';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { ORDER_STATUS, STATUS_CONFIG } from '../../utils/status';
import { listRepuestos, listRepuestosCatalogo, patchOrden, saveNota, syncRepuestos } from '../../api/ordenes';

const TecnicoDiagnosticoModal = ({ isOpen, onClose, order, onSaveStatus }) => {
    // La pagina monta este modal con key={order.id}: al cambiar de orden se remonta
    // y estos estados se inicializan (sin setState en effects)
    const [diagnostico, setDiagnostico] = useState(() => order?.diagnostico || '');
    const [repuestosUtilizados, setRepuestosUtilizados] = useState(() => order?.repuestosUsados || []);
    const [repuestosPrevios, setRepuestosPrevios] = useState(() => order?.repuestosUsados || []);
    const [catalogo, setCatalogo] = useState([]);
    const [nuevoRepuestoId, setNuevoRepuestoId] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // FASE 5-1: cargar los repuestos REALES persistidos de esta orden (setState solo en callback)
    useEffect(() => {
        if (!order?.id) return;
        let cancel = false;
        listRepuestos(order.id)
            .then((repuestos) => {
                if (cancel) return;
                const mapeados = repuestos.map((r) => ({ id: r.id, id_repuesto: r.id_repuesto, nombre: r.nombre }));
                setRepuestosPrevios(mapeados);
                setRepuestosUtilizados(mapeados);
            })
            .catch((err) => console.error('Error cargando repuestos:', err));
        return () => { cancel = true; };
    }, [order?.id]);

    // FASE 12: catalogo de repuestos (solo nombres, seleccion desde el catalogo)
    useEffect(() => {
        let cancel = false;
        listRepuestosCatalogo()
            .then((items) => { if (!cancel) setCatalogo(items); })
            .catch((err) => console.error('Error cargando catalogo de repuestos:', err));
        return () => { cancel = true; };
    }, []);

    if (!isOpen || !order) return null;

    const estadoActual = order.estado;

    const esEditable = [ORDER_STATUS.EN_DIAGNOSTICO, ORDER_STATUS.PROCESO_TECNICO].includes(estadoActual);
    const esSoloLectura = [
        ORDER_STATUS.SOLUCION_COTIZACION,
        ORDER_STATUS.LISTO_ENTREGA,
        ORDER_STATUS.ENTREGADO,
        ORDER_STATUS.CANCELADO,
    ].includes(estadoActual);

    const esSinIniciar = estadoActual === ORDER_STATUS.REGISTRADO;
    const esEnDiagnostico = estadoActual === ORDER_STATUS.EN_DIAGNOSTICO;
    const esEnReparacion = estadoActual === ORDER_STATUS.PROCESO_TECNICO;

    const handleAddRepuesto = (e) => {
        e.preventDefault();
        if (!esEditable || !nuevoRepuestoId) return;
        const item = catalogo.find((c) => String(c.id) === String(nuevoRepuestoId));
        if (!item) return;
        setRepuestosUtilizados([
            ...repuestosUtilizados,
            // id temporal string -> se crea en BD al guardar (los id numericos ya estan persistidos)
            { id: `temp-${Date.now()}`, id_repuesto: item.id, nombre: item.nombre },
        ]);
        setNuevoRepuestoId('');
    };

    const handleRemoveRepuesto = (id) => {
        if (!esEditable) return;
        setRepuestosUtilizados(repuestosUtilizados.filter((item) => item.id !== id));
    };

    // FASE 5-1: persistir nota (si no existe la crea) + sincronizar repuestos en BD
    const guardarAvanceEnBackend = async () => {
        await saveNota(order.id, { diagnostico: diagnostico.trim() });
        await syncRepuestos(order.id, repuestosPrevios, repuestosUtilizados);
    };

    const handleAceptarOrden = async () => {
        if (saving) return;
        setSaving(true);
        try {
            const updated = await patchOrden(order.id, { estado: 'EN_DIAGNOSTICO' });
            onSaveStatus?.(updated);
        } catch (err) {
            alert(`Error al aceptar la orden: ${err.message}`);
        } finally {
            setSaving(false);
            // onSaveStatus cierra el modal en la pagina
        }
    };

    const handleEnviarACotizacion = async () => {
        if (!diagnostico.trim()) {
            setError('Debes ingresar el diagnóstico antes de enviar a cotización.');
            return;
        }
        if (saving) return;
        setError('');
        setSaving(true);
        try {
            await guardarAvanceEnBackend();
            const updated = await patchOrden(order.id, { estado: 'SOLUCION_COTIZACION' });
            onSaveStatus?.(updated);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleGuardarAvance = async () => {
        if (saving) return;
        setSaving(true);
        try {
            // solo persiste la nota + repuestos; el estado no cambia
            await guardarAvanceEnBackend();
            onSaveStatus?.();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleFinalizarTrabajo = async () => {
        if (!diagnostico.trim()) {
            setError('Debes ingresar el informe técnico antes de finalizar.');
            return;
        }
        if (saving) return;
        setError('');
        setSaving(true);
        try {
            await guardarAvanceEnBackend();
            const updated = await patchOrden(order.id, { estado: 'LISTO_ENTREGA' });
            onSaveStatus?.(updated);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
                <div className="flex justify-between items-center px-6 py-4 bg-slate-800 text-white">
                    <div className="flex items-center gap-2">
                        <Wrench className="text-[#84A927]" size={20} />
                        <h3 className="font-bold text-lg">Ficha Técnica</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={estadoActual} />
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                    {esSoloLectura && (
                        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-700 rounded-lg text-xs font-medium">
                            <Lock size={16} className="shrink-0 text-amber-500" />
                            <span>
                                Orden en estado <strong>{STATUS_CONFIG[estadoActual]?.label || estadoActual}</strong>. Edición bloqueada.
                            </span>
                        </div>
                    )}

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-slate-500 block font-medium">Orden:</span>
                                <span className="font-bold text-slate-800">{order.codigo || `#${order.id}`}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block font-medium">Cliente:</span>
                                <span className="font-semibold text-slate-800">{order.clienteNombre || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block font-medium">Equipo:</span>
                                <span className="font-semibold text-slate-800">{order.equipoModelo || 'N/A'} ({order.equipoMarca || ''})</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block font-medium">Serial:</span>
                                <span className="font-mono text-slate-800">{order.equipoSerie || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                            <span className="text-slate-500 block font-medium mb-1">Falla Reportada por Recepción:</span>
                            <p className="p-2.5 bg-amber-50 border border-amber-200 text-slate-700 rounded">
                                {order.fallaReportada || 'Sin detalle de entrada registrado.'}
                            </p>
                        </div>
                        {order.observacionesFisicas && (
                            <div className="pt-2 border-t border-slate-200">
                                <span className="text-slate-500 block font-medium mb-1">Observaciones Físicas:</span>
                                <p className="text-slate-700">{order.observacionesFisicas}</p>
                            </div>
                        )}
                    </div>

                    {esSinIniciar && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                            <div className="text-xs text-blue-800">
                                <p className="font-bold">Orden Pendiente por Iniciar</p>
                                <p className="text-[11px] text-blue-600">Haz clic en aceptar para tomar esta orden y comenzar el diagnóstico.</p>
                            </div>
                            <Button size="sm" variant="primary" icon={PlayCircle} onClick={handleAceptarOrden} disabled={saving}>
                                {saving ? 'Aceptando...' : 'Aceptar Orden'}
                            </Button>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Diagnóstico / Informe Técnico
                        </label>
                        <textarea
                            rows={4}
                            disabled={!esEditable}
                            value={diagnostico}
                            onChange={(e) => { setDiagnostico(e.target.value); setError(''); }}
                            placeholder={
                                esSinIniciar
                                    ? 'Acepta la orden para escribir el diagnóstico...'
                                    : esEditable
                                        ? 'Describe los hallazgos técnicos, causa raíz de la falla y trabajo a realizar...'
                                        : 'Diagnóstico registrado por el técnico.'
                            }
                            className={`w-full text-xs p-3 border rounded-lg focus:ring-2 focus:ring-[#84A927] focus:outline-none ${!esEditable
                                    ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                                    : 'border-slate-300'
                                }`}
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    {esEnReparacion && (
                        <div className="space-y-3 pt-2 border-t border-slate-200">
                            <div className="flex items-center gap-2">
                                <PackageCheck className="text-[#84A927]" size={18} />
                                <label className="block text-xs font-bold text-slate-700">
                                    Repuestos e Insumos Utilizados
                                </label>
                            </div>

                            <form onSubmit={handleAddRepuesto} className="flex gap-2">
                                <select
                                    value={nuevoRepuestoId}
                                    onChange={(e) => setNuevoRepuestoId(e.target.value)}
                                    className="flex-1 text-xs p-2 border border-slate-300 rounded-md"
                                >
                                    <option value="">Selecciona un repuesto del catálogo...</option>
                                    {catalogo
                                        .filter((c) => !repuestosUtilizados.some((r) => String(r.id_repuesto) === String(c.id)))
                                        .map((c) => (
                                            <option key={c.id} value={c.id}>{c.nombre}</option>
                                        ))}
                                </select>
                                <Button type="submit" size="sm" variant="secondary" icon={Plus} disabled={!nuevoRepuestoId}>
                                    Agregar
                                </Button>
                            </form>

                            <div className="border border-slate-200 rounded-lg overflow-hidden">
                                {repuestosUtilizados.length === 0 ? (
                                    <p className="text-center text-xs text-slate-400 py-3">
                                        No se registraron repuestos (sólo revisión/mano de obra).
                                    </p>
                                ) : (
                                    <ul className="divide-y divide-slate-200">
                                        {repuestosUtilizados.map((item, index) => (
                                            <li key={item.id || index} className="flex justify-between items-center px-3 py-2 text-xs">
                                                <span className="text-slate-700 font-medium">
                                                    {item.nombre}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveRepuesto(item.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}

                    {esEnDiagnostico && repuestosUtilizados.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                            <div className="flex items-center gap-2">
                                <PackageCheck className="text-slate-400" size={16} />
                                <span className="text-xs font-bold text-slate-600">Repuestos registrados:</span>
                            </div>
                            <ul className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                                {repuestosUtilizados.map((item, index) => (
                                    <li key={item.id || index} className="flex justify-between items-center px-3 py-2 text-xs">
                                        <span className="text-slate-700 font-medium">{item.nombre}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <Button variant="secondary" size="sm" onClick={onClose}>
                        {esEditable ? 'Cancelar' : 'Cerrar'}
                    </Button>

                    {esEnDiagnostico && (
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" icon={Wrench} onClick={handleGuardarAvance} disabled={saving}>
                                {saving ? 'Guardando...' : 'Guardar Avance'}
                            </Button>
                            <Button variant="primary" size="sm" icon={CheckCircle} onClick={handleEnviarACotizacion} disabled={saving}>
                                {saving ? 'Enviando...' : 'Enviar a Cotización'}
                            </Button>
                        </div>
                    )}

                    {esEnReparacion && (
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" icon={Wrench} onClick={handleGuardarAvance} disabled={saving}>
                                {saving ? 'Guardando...' : 'Guardar Avance'}
                            </Button>
                            <Button variant="primary" size="sm" icon={CheckCircle} onClick={handleFinalizarTrabajo} disabled={saving}>
                                {saving ? 'Finalizando...' : 'Finalizar y Listo para Entregar'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TecnicoDiagnosticoModal;

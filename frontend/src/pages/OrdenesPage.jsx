import { useState, useMemo, useEffect } from 'react';
import { Eye, Plus, Wrench, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import FilterBar from '../components/common/FilterBar';
import Toast from '../components/common/Toast';
import OrdenDetalleModal from '../components/modals/OrdenDetalleModal';
import { normalizeText } from '../utils/text';
import { ORDER_STATUS } from '../utils/status';
import { listOrdenes } from '../api/ordenes';
import { useOrdenesRealtime } from '../api/realtime';

const TAB_STATUS_MAP = {
    EN_PROCESO: [
        ORDER_STATUS.REGISTRADO,
        ORDER_STATUS.EN_DIAGNOSTICO,
        ORDER_STATUS.SOLUCION_COTIZACION,
        ORDER_STATUS.PROCESO_TECNICO,
    ],
    LISTAS: [ORDER_STATUS.LISTO_ENTREGA],
    CANCELADAS: [ORDER_STATUS.CANCELADO],
    ENTREGADAS: [ORDER_STATUS.ENTREGADO],
};

const OrdenesPage = ({ onOpenNewOrderModal }) => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrden, setSelectedOrden] = useState(null);
    const [activeTab, setActiveTab] = useState('EN_PROCESO');

    // Aviso flotante (toast) para cotizacion/entrega
    const [toast, setToast] = useState(null);
    const showToast = (message) => {
        setToast(message);
        window.setTimeout(() => setToast(null), 4000);
    };

    // recarga silenciosa: no toca loading para no perturbar filtros/tabs abiertos
    const refreshSilencioso = () => {
        listOrdenes()
            .then((data) => {
                setOrdenes(data);
                setError('');
            })
            .catch((err) => console.error('Error refrescando órdenes en tiempo real:', err));
    };
    useOrdenesRealtime(refreshSilencioso, []);

    useEffect(() => {
        let cancel = false;
        listOrdenes()
            .then((data) => {
                if (!cancel) {
                    setOrdenes(data);
                    setError('');
                }
            })
            .catch((err) => {
                if (!cancel) {
                    console.error('Error cargando órdenes:', err);
                    setError(err.message);
                }
            })
            .finally(() => {
                if (!cancel) setLoading(false);
            });
        return () => { cancel = true; };
    }, []);

    // recarga explicita (usuario): muestra el indicador de carga
    const reloadOrdenes = () => {
        setLoading(true);
        listOrdenes()
            .then((data) => {
                setOrdenes(data);
                setError('');
            })
            .catch((err) => {
                console.error('Error cargando órdenes:', err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // @REVISAR FASE 6: refrescar las ordenes al cambiar de solapa mantiene la lista al dia
        reloadOrdenes();
    };

    const handleUpdateOrder = () => {
        setSelectedOrden(null);
        reloadOrdenes();
    };

    const [searchSerial, setSearchSerial] = useState('');
    const [searchClient, setSearchClient] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filterFields = [
        { id: 'serial', label: 'Serial', type: 'text', placeholder: 'Ej. X3K891234...', value: searchSerial, onChange: setSearchSerial },
        { id: 'cliente', label: 'Cliente', type: 'text', placeholder: 'Ej. Carlos Rodríguez...', value: searchClient, onChange: setSearchClient },
        { id: 'startDate', label: 'Desde', type: 'date', value: startDate, onChange: setStartDate },
        { id: 'endDate', label: 'Hasta', type: 'date', value: endDate, onChange: setEndDate },
    ];

    const handleResetFilters = () => {
        setSearchSerial('');
        setSearchClient('');
        setStartDate('');
        setEndDate('');
    };

    const filteredOrders = useMemo(() => {
        return ordenes.filter((orden) => {
            const allowedStatuses = TAB_STATUS_MAP[activeTab] || [];
            if (!allowedStatuses.includes(orden.estado)) return false;

            const ordenDate = new Date(orden.fechaIngreso);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const matchesStart = !start || ordenDate >= start;
            const matchesEnd = !end || ordenDate <= end;
            const matchesSerial = normalizeText(orden.equipoSerie || '').includes(normalizeText(searchSerial));
            const matchesClient = normalizeText(orden.clienteNombre || '').includes(normalizeText(searchClient));

            return matchesSerial && matchesClient && matchesStart && matchesEnd;
        });
    }, [ordenes, activeTab, searchSerial, searchClient, startDate, endDate]);

    const columns = [
        { key: 'codigo', label: 'N° Orden', className: 'font-semibold text-slate-800' },
        { key: 'equipoSerie', label: 'N° Serial', className: 'font-mono text-xs text-slate-600' },
        { key: 'clienteNombre', label: 'Cliente' },
        { key: 'equipoModelo', label: 'Equipo' },
        { key: 'tecnicoAsignado', label: 'Técnico Asignado' },
        { key: 'estado', label: 'Estatus', render: (row) => <StatusBadge status={row.estado} /> },
        {
            key: 'acciones',
            label: 'Acciones',
            className: 'text-right',
            render: (row) => (
                <Button size="sm" variant="ghost" icon={Eye} onClick={() => setSelectedOrden(row)}>
                    Gestionar
                </Button>
            )
        }
    ];

    const tabs = [
        { id: 'EN_PROCESO', label: 'En Taller', icon: Clock },
        { id: 'LISTAS', label: 'Listas p/ Entregar', icon: CheckCircle2 },
        { id: 'CANCELADAS', label: 'Canceladas', icon: XCircle },
        { id: 'ENTREGADAS', label: 'Histórico Entregadas', icon: Wrench },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Control de Órdenes de Servicio</h2>
                    <p className="text-xs text-slate-500 mt-1">Gestión administrativa, aprobación de presupuestos y entregas</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" icon={RefreshCw} onClick={reloadOrdenes} disabled={loading}>
                        Actualizar
                    </Button>
                    <Button variant="primary" icon={Plus} onClick={onOpenNewOrderModal}>
                        Nueva Orden
                    </Button>
                </div>
            </div>

            <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 font-medium text-xs border-b-2 transition-colors whitespace-nowrap ${isActive
                                    ? 'border-[#55720C] text-[#55720C] bg-slate-50/50'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <FilterBar fields={filterFields} onReset={handleResetFilters} />

            <Card>
                {loading && !error && <p className="p-4 text-sm text-slate-500">Cargando órdenes...</p>}
                {error && <p className="p-4 text-sm text-red-500">Error al cargar: {error}</p>}
                {!loading && !error && (
                    <Table columns={columns} data={filteredOrders} emptyMessage="No hay órdenes en esta categoría." />
                )}
            </Card>

            <OrdenDetalleModal
                key={selectedOrden?.id ?? 'sin-orden'}
                isOpen={!!selectedOrden}
                onClose={() => setSelectedOrden(null)}
                order={selectedOrden}
                onUpdateOrder={handleUpdateOrder}
                onNotify={showToast}
                currentRole="ADMIN_RECEPCION"
            />

            <Toast message={toast} onDismiss={() => setToast(null)} />
        </div>
    );
};

export default OrdenesPage;

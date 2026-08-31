// src/pages/OrdenesPage.jsx
import { useState, useMemo } from 'react';
import { Eye, Plus, Wrench, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import FilterBar from '../components/common/FilterBar';
import OrdenDetalleModal from '../components/modals/OrdenDetalleModal';
import { normalizeText } from '../utils/text';
import { mockOrdenes, ORDER_STATUS } from '../data/ordenesData';

// Mapeo declarativo entre cada pestaña y sus estados permitidos
const TAB_STATUS_MAP = {
    EN_PROCESO: [
        ORDER_STATUS.RECIBIDO,
        ORDER_STATUS.EN_DIAGNOSTICO,
        ORDER_STATUS.ESPERANDO_APROBACION,
        ORDER_STATUS.EN_REPARACION
    ],
    LISTAS: [ORDER_STATUS.LISTO],
    CANCELADAS: [ORDER_STATUS.CANCELADO],
    ENTREGADAS: [ORDER_STATUS.ENTREGADO]
};

const OrdenesPage = ({ onOpenNewOrderModal }) => {
    const [ordenes, setOrdenes] = useState(mockOrdenes);
    const [selectedOrden, setSelectedOrden] = useState(null);
    const [activeTab, setActiveTab] = useState('EN_PROCESO');

    // Estados de Filtros
    const [searchSerial, setSearchSerial] = useState('');
    const [searchClient, setSearchClient] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filterFields = [
        { id: 'serial', label: 'Serial', type: 'text', placeholder: 'Ej. SER-990011...', value: searchSerial, onChange: setSearchSerial },
        { id: 'cliente', label: 'Cliente', type: 'text', placeholder: 'Ej. Inversiones C.A.', value: searchClient, onChange: setSearchClient },
        { id: 'startDate', label: 'Desde', type: 'date', value: startDate, onChange: setStartDate },
        { id: 'endDate', label: 'Hasta', type: 'date', value: endDate, onChange: setEndDate },
    ];

    const handleResetFilters = () => {
        setSearchSerial('');
        setSearchClient('');
        setStartDate('');
        setEndDate('');
    };

    const handleUpdateOrder = (updatedOrder) => {
        setOrdenes((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
        setSelectedOrden(null);
    };

    const filteredOrders = useMemo(() => {
        return ordenes.filter((orden) => {
            // 1. Filtrado por Pestaña Activa usando el Diccionario
            const allowedStatuses = TAB_STATUS_MAP[activeTab] || [];
            if (!allowedStatuses.includes(orden.estado)) return false;

            // 2. Filtros de Búsqueda y Rango de Fechas
            const ordenDate = new Date(orden.fechaIngreso || orden.fecha);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const matchesStart = !start || ordenDate >= start;
            const matchesEnd = !end || ordenDate <= end;
            const matchesSerial = normalizeText(orden.equipoSerie || orden.serial || '').includes(normalizeText(searchSerial));
            const matchesClient = normalizeText(orden.clienteNombre || orden.cliente || '').includes(normalizeText(searchClient));

            return matchesSerial && matchesClient && matchesStart && matchesEnd;
        });
    }, [ordenes, activeTab, searchSerial, searchClient, startDate, endDate]);

    const columns = [
        { key: 'codigo', label: 'N° Orden', className: 'font-semibold text-slate-800' },
        { key: 'serial', label: 'N° Serial', className: 'font-mono text-xs text-slate-600', render: (row) => row.equipoSerie || row.serial || 'N/A' },
        { key: 'cliente', label: 'Cliente', render: (row) => row.clienteNombre || row.cliente },
        { key: 'equipo', label: 'Equipo', render: (row) => row.equipoModelo || row.equipo },
        { key: 'tecnico', label: 'Técnico Asignado', render: (row) => row.tecnicoNombre || row.tecnico || 'Sin Asignar' },
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
                <Button variant="primary" icon={Plus} onClick={onOpenNewOrderModal}>
                    Nueva Orden
                </Button>
            </div>

            {/* Navegación por Tabs */}
            <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
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
                <Table columns={columns} data={filteredOrders} emptyMessage="No hay órdenes en esta categoría." />
            </Card>

            <OrdenDetalleModal
                isOpen={!!selectedOrden}
                onClose={() => setSelectedOrden(null)}
                order={selectedOrden}
                onUpdateOrder={handleUpdateOrder}
            />
        </div>
    );
};

export default OrdenesPage;
// src/pages/OrdenesPage.jsx
import { useState, useMemo } from 'react';
import { Eye, Plus } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import FilterBar from '../components/common/FilterBar';
import OrdenDetalleModal from '../components/modals/OrdenDetalleModal';
import { normalizeText } from '../utils/text';
import { mockOrdenes, ORDER_STATUS } from '../data/ordenesData';

const OrdenesPage = ({ onOpenNewOrderModal }) => {
    const [ordenes, setOrdenes] = useState(mockOrdenes);

    // Estado para gestionar la orden seleccionada y la visibilidad del modal
    const [selectedOrden, setSelectedOrden] = useState(null);

    // Estados de Filtros
    const [searchSerial, setSearchSerial] = useState('');
    const [searchClient, setSearchClient] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Configuración de campos para el FilterBar
    const filterFields = [
        {
            id: 'serial',
            label: 'Serial del Equipo',
            type: 'text',
            placeholder: 'Ej. SER-990011...',
            value: searchSerial,
            onChange: setSearchSerial,
        },
        {
            id: 'cliente',
            label: 'Cliente',
            type: 'text',
            placeholder: 'Ej. Inversiones C.A.',
            value: searchClient,
            onChange: setSearchClient,
        },
        {
            id: 'startDate',
            label: 'Fecha Desde',
            type: 'date',
            value: startDate,
            onChange: setStartDate,
        },
        {
            id: 'endDate',
            label: 'Fecha Hasta',
            type: 'date',
            value: endDate,
            onChange: setEndDate,
        },
    ];

    const handleResetFilters = () => {
        setSearchSerial('');
        setSearchClient('');
        setStartDate('');
        setEndDate('');
    };

    // Excluir órdenes entregadas y aplicar filtros
    const filteredOrders = useMemo(() => {
        return ordenes.filter((orden) => {
            // Regla de Negocio
            if (orden.estado === ORDER_STATUS.ENTREGADO) return false;

            // Filtro por Fechas
            const ordenDate = new Date(orden.fechaIngreso || orden.fecha);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const matchesStart = !start || ordenDate >= start;
            const matchesEnd = !end || ordenDate <= end;

            // Filtro por Serial y Cliente
            const serialValue = orden.equipoSerie || orden.serial || '';
            const clientValue = orden.clienteNombre || orden.cliente || '';

            const matchesSerial = normalizeText(serialValue).includes(normalizeText(searchSerial));
            const matchesClient = normalizeText(clientValue).includes(normalizeText(searchClient));

            return matchesSerial && matchesClient && matchesStart && matchesEnd;
        });
    }, [ordenes, searchSerial, searchClient, startDate, endDate]);

    const columns = [
        { key: 'codigo', label: 'N° Orden', className: 'font-semibold text-slate-800' },
        {
            key: 'serial',
            label: 'N° Serial',
            className: 'font-mono text-xs text-slate-600',
            render: (row) => row.equipoSerie || row.serial || 'N/A'
        },
        {
            key: 'cliente',
            label: 'Cliente',
            render: (row) => row.clienteNombre || row.cliente
        },
        {
            key: 'equipo',
            label: 'Equipo / Modelo',
            render: (row) => row.equipoModelo || row.equipo
        },
        {
            key: 'fecha',
            label: 'Fecha Ingreso',
            render: (row) => row.fechaIngreso || row.fecha
        },
        {
            key: 'estado',
            label: 'Estatus Activo',
            render: (row) => <StatusBadge status={row.estado} />
        },
        {
            key: 'acciones',
            label: 'Acciones',
            className: 'text-right',
            render: (row) => (
                <Button
                    size="sm"
                    variant="ghost"
                    icon={Eye}
                    onClick={() => setSelectedOrden(row)}
                >
                    Ver Detalle
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Órdenes de Servicio en Proceso</h2>
                    <p className="text-xs text-slate-500 mt-1">Gestión y seguimiento de equipos activos en taller</p>
                </div>

                <Button
                    variant="primary"
                    icon={Plus}
                    onClick={onOpenNewOrderModal || (() => alert('Abrir modal de nueva orden'))}
                >
                    Nueva Orden
                </Button>
            </div>


            <FilterBar fields={filterFields} onReset={handleResetFilters} />

            <Card>
                <Table
                    columns={columns}
                    data={filteredOrders}
                    emptyMessage="No hay órdenes activas que coincidan con la búsqueda."
                />
            </Card>

            <OrdenDetalleModal
                isOpen={!!selectedOrden}
                onClose={() => setSelectedOrden(null)}
                order={selectedOrden}
            />
        </div>
    );
};

export default OrdenesPage;
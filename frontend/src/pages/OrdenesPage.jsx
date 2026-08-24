import { useState, useMemo } from 'react';
import { Eye, Plus } from 'lucide-react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import FilterBar from '../components/common/FilterBar';
import { ORDER_STATUS } from '../utils/status';
import { normalizeText } from '../utils/text';

const OrdenesPage = ({ onOpenNewOrderModal }) => {
    // Estados de Filtros
    const [searchSerial, setSearchSerial] = useState('');
    const [searchClient, setSearchClient] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Configuración de los campos para el FilterBar en ESTA vista
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

    // Datos MOCK
    const ordenesData = [
        { id: 1, codigo: 'ORD-2026-001', serial: 'SER-11029', cliente: 'Carlos Rodríguez', equipo: 'Epson L3110', fecha: '2026-08-20', estado: ORDER_STATUS.EN_DIAGNOSTICO },
        { id: 2, codigo: 'ORD-2026-002', serial: 'SER-990011', cliente: 'María Gómez', equipo: 'HP LaserJet M404dn', fecha: '2026-08-21', estado: ORDER_STATUS.RECIBIDO },
        { id: 3, codigo: 'ORD-2026-003', serial: 'SER-443322', cliente: 'Inversiones C.A.', equipo: 'Canon G3110', fecha: '2026-08-22', estado: ORDER_STATUS.ESPERANDO_APROBACION },
        { id: 4, codigo: 'ORD-2026-004', serial: 'SER-887711', cliente: 'Andrés López', equipo: 'POS-80 Printer', fecha: '2026-08-23', estado: ORDER_STATUS.EN_REPARACION },
        { id: 5, codigo: 'ORD-2026-000', serial: 'SER-000000', cliente: 'Pedro Perez', equipo: 'Epson L805', fecha: '2026-08-10', estado: ORDER_STATUS.ENTREGADO }, // Queda fuera
    ];

    // Excluir órdenes culminadas y aplicar filtros de inputs
    const filteredOrders = useMemo(() => {
        return ordenesData.filter((orden) => {
            // Regla de Negocio: Excluir automáticamente las órdenes entregadas/cerradas
            if (orden.estado === ORDER_STATUS.ENTREGADO) return false;

            // Filtro por Fechas
            const ordenDate = new Date(orden.fecha);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const matchesStart = !start || ordenDate >= start;
            const matchesEnd = !end || ordenDate <= end;

            // Filtro por Serial
            const matchesSerial = normalizeText(orden.serial).includes(normalizeText(searchSerial));

            // Filtro por Cliente
            const matchesClient = normalizeText(orden.cliente).includes(normalizeText(searchClient));

            return matchesSerial && matchesClient && matchesStart && matchesEnd;
        });
    }, [ordenesData, searchSerial, searchClient, startDate, endDate]);

    const columns = [
        { key: 'codigo', label: 'N° Orden', className: 'font-semibold text-slate-800' },
        { key: 'serial', label: 'N° Serial', className: 'font-mono text-xs text-slate-600' },
        { key: 'cliente', label: 'Cliente' },
        { key: 'equipo', label: 'Equipo / Modelo' },
        { key: 'fecha', label: 'Fecha Ingreso' },
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
                    onClick={() => alert(`Abrir detalle de ${row.codigo}`)}
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

            </div>

            {/* Componente Genérico de Filtros */}
            <FilterBar fields={filterFields} onReset={handleResetFilters} />

            {/* Tabla */}
            <Card>
                <Table columns={columns} data={filteredOrders} emptyMessage="No hay órdenes activas que coincidan con la búsqueda." />
            </Card>
        </div>
    );
};

export default OrdenesPage;
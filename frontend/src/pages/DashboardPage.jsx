import { useState, useMemo } from 'react';
import {
    ClipboardList,
    Stethoscope,
    Clock,
    Wrench,
    CheckCircle2,
    PackageCheck,
    Plus,
    Eye
} from 'lucide-react';

import { MetricCard, Card } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import OrdenDetalleModal from '../components/modals/OrdenDetalleModal';
import { mockOrdenes, ORDER_STATUS } from '../data/ordenesData';

const DashboardPage = ({ onOpenNewOrderModal }) => {
    const [selectedOrden, setSelectedOrden] = useState(null);

    const kpis = useMemo(() => {
        const counts = {
            [ORDER_STATUS.REGISTRADO]: 0,
            [ORDER_STATUS.EN_DIAGNOSTICO]: 0,
            [ORDER_STATUS.SOLUCION_COTIZACION]: 0,
            [ORDER_STATUS.PROCESO_TECNICO]: 0,
            [ORDER_STATUS.LISTO_ENTREGA]: 0,
            [ORDER_STATUS.ENTREGADO]: 0,
        };
        mockOrdenes.forEach((o) => {
            if (counts[o.estado] !== undefined) counts[o.estado]++;
        });
        return [
            { title: 'Recibidos', value: counts[ORDER_STATUS.REGISTRADO], icon: ClipboardList, color: 'blue' },
            { title: 'En Diagnóstico', value: counts[ORDER_STATUS.EN_DIAGNOSTICO], icon: Stethoscope, color: 'blue' },
            { title: 'Por Aprobación', value: counts[ORDER_STATUS.SOLUCION_COTIZACION], icon: Clock, color: 'amber' },
            { title: 'En Reparación', value: counts[ORDER_STATUS.PROCESO_TECNICO], icon: Wrench, color: 'amber' },
            { title: 'Listos p/ Entrega', value: counts[ORDER_STATUS.LISTO_ENTREGA], icon: CheckCircle2, color: 'primary' },
            { title: 'Entregados (Mes)', value: counts[ORDER_STATUS.ENTREGADO], icon: PackageCheck, color: 'emerald' },
        ];
    }, []);

    const columns = [
        { key: 'codigo', label: 'N° Orden', className: 'font-semibold text-slate-800' },
        { key: 'clienteNombre', label: 'Cliente' },
        { key: 'equipoModelo', label: 'Equipo / Modelo' },
        { key: 'tecnicoAsignado', label: 'Técnico Asignado' },
        {
            key: 'estado',
            label: 'Estado',
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
                    Ver
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Panel de Control</h2>
                    <p className="text-xs text-slate-500 mt-1">Monitoreo en tiempo real del flujo de servicio técnico</p>
                </div>
                <Button variant="primary" icon={Plus} onClick={onOpenNewOrderModal}>
                    Nueva Orden
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                {kpis.map((kpi, index) => (
                    <MetricCard key={index} {...kpi} />
                ))}
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">Órdenes en Flujo</h3>
                        <p className="text-[11px] text-slate-400">Últimos movimientos registrados en el sistema</p>
                    </div>
                </div>
                <Table columns={columns} data={mockOrdenes} />
            </Card>

            <OrdenDetalleModal
                isOpen={!!selectedOrden}
                onClose={() => setSelectedOrden(null)}
                order={selectedOrden}
            />
        </div>
    );
};

export default DashboardPage;

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
import { ORDER_STATUS } from '../utils/status';

const DashboardPage = ({ onOpenNewOrderModal }) => {
    // Resumen del ciclo de vida en el Dashboard
    const kpis = [
        { title: 'Recibidos', value: '5', icon: ClipboardList, color: 'blue' },
        { title: 'En Diagnóstico', value: '4', icon: Stethoscope, color: 'blue' },
        { title: 'Por Aprobación', value: '3', icon: Clock, color: 'amber' },
        { title: 'En Reparación', value: '6', icon: Wrench, color: 'amber' },
        { title: 'Listos p/ Entrega', value: '8', icon: CheckCircle2, color: 'primary' },
        { title: 'Entregados (Mes)', value: '42', icon: PackageCheck, color: 'emerald' },
    ];

    const columns = [
        { key: 'codigo', label: 'N° Orden', className: 'font-semibold text-slate-800' },
        { key: 'cliente', label: 'Cliente' },
        { key: 'equipo', label: 'Equipo / Modelo' },
        { key: 'tecnico', label: 'Técnico Asignado' },
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
                    onClick={() => alert(`Ver detalle de ${row.codigo}`)}
                >
                    Ver
                </Button>
            )
        }
    ];

    const ordenesRecientes = [
        { id: 1, codigo: 'ORD-2026-001', cliente: 'Carlos Rodríguez', equipo: 'Epson L3110', tecnico: 'Jesús Saavedra', estado: ORDER_STATUS.EN_DIAGNOSTICO },
        { id: 2, codigo: 'ORD-2026-002', cliente: 'María Gómez', equipo: 'HP LaserJet M404dn', tecnico: 'Sin Asignar', estado: ORDER_STATUS.RECIBIDO },
        { id: 3, codigo: 'ORD-2026-003', cliente: 'Inversiones C.A.', equipo: 'Canon G3110', tecnico: 'Jesús Saavedra', estado: ORDER_STATUS.ESPERANDO_APROBACION },
        { id: 4, codigo: 'ORD-2026-004', cliente: 'Andrés López', equipo: 'Thermal Printer POS-80', tecnico: 'Jesús Saavedra', estado: ORDER_STATUS.EN_REPARACION },
        { id: 5, codigo: 'ORD-2026-005', cliente: 'Lucía Fernández', equipo: 'Laptop Dell Inspiron', tecnico: 'Jesús Saavedra', estado: ORDER_STATUS.LISTO_ENTREGA },
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

            {/* Grid de 6 KPIs con los estados clave */}
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

                <Table columns={columns} data={ordenesRecientes} />
            </Card>
        </div>
    );
};

export default DashboardPage;
import { useState, useMemo, useEffect } from 'react';
import {
    ClipboardList,
    Stethoscope,
    Clock,
    Wrench,
    CheckCircle2,
    PackageCheck,
    Plus,
    Eye,
    RefreshCw
} from 'lucide-react';

import { MetricCard, Card } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import Toast from '../components/common/Toast';
import OrdenDetalleModal from '../components/modals/OrdenDetalleModal';
import { listOrdenes } from '../api/ordenes';
import { useOrdenesRealtime } from '../api/realtime';

const DashboardPage = ({ onOpenNewOrderModal }) => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrden, setSelectedOrden] = useState(null);

    // Aviso flotante (toast) para cotizacion/entrega
    const [toast, setToast] = useState(null);
    const showToast = (message) => {
        setToast(message);
        window.setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        let cancel = false;
        listOrdenes()
            .then((data) => {
                if (!cancel) setOrdenes(data);
            })
            .catch((err) => {
                if (!cancel) {
                    console.error('Error cargando dashboard:', err);
                    setError(err.message);
                }
            })
            .finally(() => {
                if (!cancel) setLoading(false);
            });
        return () => { cancel = true; };
    }, []);

    const reload = () => {
        setLoading(true);
        listOrdenes()
            .then((data) => {
                setOrdenes(data);
                setError('');
            })
            .catch((err) => {
                console.error('Error cargando dashboard:', err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    };

    // recarga silenciosa en tiempo real (WebSocket): no toca loading ni cierra la vista
    useOrdenesRealtime(() => {
        listOrdenes()
            .then((data) => setOrdenes(data))
            .catch((err) => console.error('Error refrescando dashboard en tiempo real:', err));
    }, []);

    const kpis = useMemo(() => {
        const counts = {
            REGISTRADO: 0,
            EN_DIAGNOSTICO: 0,
            SOLUCION_COTIZACION: 0,
            PROCESO_TECNICO: 0,
            LISTO_ENTREGA: 0,
            ENTREGADO: 0,
        };
        ordenes.forEach((o) => {
            if (counts[o.estado] !== undefined) counts[o.estado]++;
        });
        return [
            { title: 'Recibidos', value: counts.REGISTRADO, icon: ClipboardList, color: 'blue' },
            { title: 'En Diagnóstico', value: counts.EN_DIAGNOSTICO, icon: Stethoscope, color: 'blue' },
            { title: 'Por Aprobación', value: counts.SOLUCION_COTIZACION, icon: Clock, color: 'amber' },
            { title: 'En Reparación', value: counts.PROCESO_TECNICO, icon: Wrench, color: 'amber' },
            { title: 'Listos p/ Entrega', value: counts.LISTO_ENTREGA, icon: CheckCircle2, color: 'primary' },
            { title: 'Entregados', value: counts.ENTREGADO, icon: PackageCheck, color: 'emerald' },
        ];
    }, [ordenes]);

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
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={reload}
                        disabled={loading}
                        className="inline-flex items-center justify-center p-2 rounded font-semibold transition-all duration-150 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-[#E2E8F0] text-[#1E293B] hover:bg-slate-100 bg-white"
                    >
                        <RefreshCw size={14} />
                    </button>
                    <Button variant="primary" icon={Plus} onClick={onOpenNewOrderModal}>
                        Nueva Orden
                    </Button>
                </div>
            </div>

            {loading && <p className="text-sm text-slate-500">Cargando panel...</p>}
            {error && <p className="text-sm text-red-500">Error al cargar: {error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    {kpis.map((kpi, index) => (
                        <MetricCard key={index} {...kpi} />
                    ))}
                </div>
            )}

            {!loading && !error && (
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">Órdenes en Flujo</h3>
                            <p className="text-[11px] text-slate-400">Últimos movimientos registrados en el sistema</p>
                        </div>
                    </div>
                    <Table columns={columns} data={ordenes} />
                </Card>
            )}

            <OrdenDetalleModal
                isOpen={!!selectedOrden}
                onClose={() => setSelectedOrden(null)}
                order={selectedOrden}
                onUpdateOrder={reload}
                onNotify={showToast}
            />

            <Toast message={toast} onDismiss={() => setToast(null)} />
        </div>
    );
};

export default DashboardPage;
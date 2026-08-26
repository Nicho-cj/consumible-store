import React, { useState, useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
    DollarSign,
    CheckCircle2,
    Printer,
    Download,
    Activity,
    Users,
    TrendingUp,
    Database,
    HardDriveDownload,
    Calendar,
    Search,
    FileText,
    Eye,
    Wrench,
    FileSpreadsheet
} from 'lucide-react';
import Card, { MetricCard } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FilterBar from '../components/common/FilterBar';
import { ORDER_STATUS } from '../utils/status';
import { normalizeText } from '../utils/text';

// Función para formatear fechas a formato DD/MM/YYYY
const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
};

const ReportesPage = () => {
    // Referencia para react-to-print
    const contentRef = useRef(null);

    // Integración de react-to-print
    const handlePrintReport = useReactToPrint({
        contentRef: contentRef,
        documentTitle: `Reporte_Liquidacion_Consumible_Store_${new Date().toISOString().slice(0, 10)}`,
    });

    // Pestaña activa: 'LIQUIDACION' | 'LOGS' | 'BACKUP'
    const [activeTab, setActiveTab] = useState('LIQUIDACION');

    // Filtros de Liquidación por Fecha de Ingreso y Técnico
    const [selectedTechnician, setSelectedTechnician] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Estado del modal de Vista Previa del Reporte PDF
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Filtros de Logs
    const [logSearch, setLogSearch] = useState('');
    const [logModuleFilter, setLogModuleFilter] = useState('ALL');

    // Mock Data de Servicios Finalizados para Liquidación
    const liquidacionesData = [
        {
            id: 1,
            codigo: 'ORD-2026-001',
            fechaIngreso: '2026-08-10',
            fechaCierre: '2026-08-14',
            tecnico: 'Hector Luis Rodriguez',
            cliente: 'Carlos Rodríguez',
            equipo: 'Epson L3110',
            serial: 'SER-11029',
            tipoServicio: 'Mantenimiento Correctivo',
            trabajoRealizado: 'Limpieza de cabezal y cambio de almohadillas',
            repuestosUsados: 'Almohadillas Epson L3110',
            montoTotal: 35.0,
            estado: ORDER_STATUS.ENTREGADO
        },
        {
            id: 2,
            codigo: 'ORD-2026-002',
            fechaIngreso: '2026-08-12',
            fechaCierre: '2026-08-15',
            tecnico: 'Dario Jose Jimenez',
            cliente: 'María Gómez',
            equipo: 'HP LaserJet M404dn',
            serial: 'SER-990011',
            tipoServicio: 'Revisión y Reparación',
            trabajoRealizado: 'Reemplazo de rodillo de arrastre (Pick-up roller)',
            repuestosUsados: 'Pick-up roller HP M404',
            montoTotal: 45.0,
            estado: ORDER_STATUS.ENTREGADO
        },
        {
            id: 3,
            codigo: 'ORD-2026-003',
            fechaIngreso: '2026-08-13',
            fechaCierre: '2026-08-16',
            tecnico: 'Hector Luis Rodriguez',
            cliente: 'Inversiones C.A.',
            equipo: 'Canon G3110',
            serial: 'SER-443322',
            tipoServicio: 'Mantenimiento Preventivo',
            trabajoRealizado: 'Mantenimiento general de sistema continuo y purga de tintas',
            repuestosUsados: 'Ninguno',
            montoTotal: 25.0,
            estado: ORDER_STATUS.ENTREGADO
        },
        {
            id: 4,
            codigo: 'ORD-2026-005',
            fechaIngreso: '2026-08-15',
            fechaCierre: '2026-08-18',
            tecnico: 'Domingo',
            cliente: 'Pedro Perez',
            equipo: 'Epson L805',
            serial: 'SER-000000',
            tipoServicio: 'Mantenimiento Correctivo',
            trabajoRealizado: 'Destape por ultrasonido de inyectores y calibración',
            repuestosUsados: 'Líquido destapador especializado',
            montoTotal: 50.0,
            estado: ORDER_STATUS.ENTREGADO
        },
        {
            id: 5,
            codigo: 'ORD-2026-008',
            fechaIngreso: '2026-08-18',
            fechaCierre: '2026-08-21',
            tecnico: 'Dario Jose Jimenez',
            cliente: 'DellAcuatica CA',
            equipo: 'Kyocera ECOSYS M2040dn',
            serial: 'SER-882211',
            tipoServicio: 'Mantenimiento Correctivo',
            trabajoRealizado: 'Cambio de engranaje de fusor y limpieza de escáner',
            repuestosUsados: 'Engranaje de tracción de fusor',
            montoTotal: 65.0,
            estado: ORDER_STATUS.ENTREGADO
        },
        {
            id: 6,
            codigo: 'ORD-2026-010',
            fechaIngreso: '2026-08-20',
            fechaCierre: '2026-08-23',
            tecnico: 'Eloy',
            cliente: 'Distribuidora del Sur',
            equipo: 'Brother DCP-T510W',
            serial: 'SER-554433',
            tipoServicio: 'Revisión y Reparación',
            trabajoRealizado: 'Reemplazo de sensor de paso de papel y mantenimiento del mecanismo',
            repuestosUsados: 'Sensor óptico de papel Brother',
            montoTotal: 40.0,
            estado: ORDER_STATUS.ENTREGADO
        },
        {
            id: 7,
            codigo: 'ORD-2026-012',
            fechaIngreso: '2026-08-22',
            fechaCierre: '2026-08-25',
            tecnico: 'Jesús Saavedra',
            cliente: 'Clínica Guayana',
            equipo: 'Zebra ZD220',
            serial: 'SER-776655',
            tipoServicio: 'Mantenimiento Preventivo',
            trabajoRealizado: 'Limpieza de cabezal térmico y calibración de sensor de etiquetas',
            repuestosUsados: 'Ninguno',
            montoTotal: 30.0,
            estado: ORDER_STATUS.ENTREGADO
        }
    ];

    // Mock Data del Log de Auditoría / Registros del Sistema (RNF-05 / RNF-06)
    const auditLogsData = [
        {
            id: 'LOG-109',
            fecha: '2026-08-25 10:45 AM',
            usuario: 'Administrador (Recepción)',
            modulo: 'Órdenes',
            accion: 'Creación de Orden',
            detalles: 'Se registró la orden ORD-2026-015 para el cliente Jesús Saavedra (Serial: SER-990011).'
        },
        {
            id: 'LOG-108',
            fecha: '2026-08-25 09:30 AM',
            usuario: 'Dario Jose Jimenez',
            modulo: 'Taller',
            accion: 'Diagnóstico Técnico',
            detalles: 'Se ingresó diagnóstico y presupuesto de $45.00 en la orden ORD-2026-002.'
        },
        {
            id: 'LOG-107',
            fecha: '2026-08-24 04:15 PM',
            usuario: 'Administrador (Recepción)',
            modulo: 'Liquidación',
            accion: 'Cierre y Cobro de Servicio',
            detalles: 'Orden ORD-2026-008 cambiada a "Entregado / Finalizado". Cobrado $65.00 en punto de venta.'
        },
        {
            id: 'LOG-106',
            fecha: '2026-08-24 02:00 PM',
            usuario: 'Hector Luis Rodriguez',
            modulo: 'Taller',
            accion: 'Cambio de Estatus',
            detalles: 'Orden ORD-2026-003 pasó de "En Reparación" a "Listo para Entrega".'
        },
        {
            id: 'LOG-105',
            fecha: '2026-08-23 11:10 AM',
            usuario: 'Administrador (Recepción)',
            modulo: 'Clientes',
            accion: 'Registro de Cliente',
            detalles: 'Se dio de alta el cliente Inversiones C.A. (RIF: J-12345678-0).'
        },
        {
            id: 'LOG-104',
            fecha: '2026-08-22 05:00 PM',
            usuario: 'Sistema (Automático)',
            modulo: 'Seguridad',
            accion: 'Copia de Seguridad LAN',
            detalles: 'Respaldo automático de base de datos completado exitosamente (backup_20260822.sql).'
        },
    ];

    // Configuración de Filtros para Detalle de Servicios / Liquidación
    const filterFields = [
        {
            id: 'tecnico',
            label: 'Técnico Responsable',
            type: 'select',
            value: selectedTechnician,
            onChange: setSelectedTechnician,
            options: [
                { label: 'Todos los Técnicos', value: 'ALL' },
                { label: 'Hector Luis Rodriguez', value: 'Hector Luis Rodriguez' },
                { label: 'Dario Jose Jimenez', value: 'Dario Jose Jimenez' },
                { label: 'Domingo', value: 'Domingo' },
                { label: 'Eloy', value: 'Eloy' },
                { label: 'Jesús Saavedra', value: 'Jesús Saavedra' },
            ],
        },
        {
            id: 'startDate',
            label: 'Fecha Ingreso Desde',
            type: 'date',
            value: startDate,
            onChange: setStartDate,
        },
        {
            id: 'endDate',
            label: 'Fecha Ingreso Hasta',
            type: 'date',
            value: endDate,
            onChange: setEndDate,
        },
        {
            id: 'search',
            label: 'Búsqueda Rápida',
            type: 'text',
            placeholder: 'Buscar por orden, cliente, equipo...',
            value: searchQuery,
            onChange: setSearchQuery,
        },
    ];

    const handleResetFilters = () => {
        setSelectedTechnician('ALL');
        setStartDate('');
        setEndDate('');
        setSearchQuery('');
    };

    // Filtros rápidos de fecha preestablecidos
    const handleQuickDatePreset = (preset) => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        if (preset === 'TODAY') {
            setStartDate(todayStr);
            setEndDate(todayStr);
        } else if (preset === 'THIS_MONTH') {
            setStartDate(`${yyyy}-${mm}-01`);
            setEndDate(todayStr);
        } else if (preset === 'LAST_30_DAYS') {
            const past30 = new Date(today);
            past30.setDate(today.getDate() - 30);
            const pY = past30.getFullYear();
            const pM = String(past30.getMonth() + 1).padStart(2, '0');
            const pD = String(past30.getDate()).padStart(2, '0');
            setStartDate(`${pY}-${pM}-${pD}`);
            setEndDate(todayStr);
        } else if (preset === 'ALL') {
            setStartDate('');
            setEndDate('');
        }
    };

    // Filtrado de Liquidaciones por Fecha de Ingreso, Técnico y Búsqueda
    const filteredLiquidaciones = useMemo(() => {
        return liquidacionesData.filter((item) => {
            const matchesTecnico = selectedTechnician === 'ALL' || item.tecnico === selectedTechnician;

            // Filtro por Fecha de Ingreso
            const itemDate = new Date(item.fechaIngreso);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const matchesStart = !start || itemDate >= start;
            const matchesEnd = !end || itemDate <= end;

            // Búsqueda por texto (orden, cliente, equipo, serial, trabajo)
            const query = normalizeText(searchQuery);
            const matchesSearch = !query ||
                normalizeText(item.codigo).includes(query) ||
                normalizeText(item.cliente).includes(query) ||
                normalizeText(item.equipo).includes(query) ||
                normalizeText(item.serial).includes(query) ||
                normalizeText(item.trabajoRealizado).includes(query);

            return matchesTecnico && matchesStart && matchesEnd && matchesSearch;
        });
    }, [liquidacionesData, selectedTechnician, startDate, endDate, searchQuery]);

    // Filtrado de Logs
    const filteredLogs = useMemo(() => {
        return auditLogsData.filter((log) => {
            const term = normalizeText(logSearch);
            const matchesSearch =
                normalizeText(log.detalles).includes(term) ||
                normalizeText(log.usuario).includes(term) ||
                normalizeText(log.accion).includes(term) ||
                normalizeText(log.id).includes(term);

            const matchesModule = logModuleFilter === 'ALL' || log.modulo === logModuleFilter;

            return matchesSearch && matchesModule;
        });
    }, [auditLogsData, logSearch, logModuleFilter]);

    // Totales Calculados
    const totalFacturado = useMemo(() => {
        return filteredLiquidaciones.reduce((acc, curr) => acc + curr.montoTotal, 0);
    }, [filteredLiquidaciones]);

    const ticketPromedio = useMemo(() => {
        return filteredLiquidaciones.length > 0
            ? (totalFacturado / filteredLiquidaciones.length).toFixed(2)
            : '0.00';
    }, [filteredLiquidaciones, totalFacturado]);

    // Resumen por Técnico Individual
    const resumenPorTecnico = useMemo(() => {
        const map = {};
        filteredLiquidaciones.forEach((item) => {
            if (!map[item.tecnico]) {
                map[item.tecnico] = {
                    nombre: item.tecnico,
                    servicios: 0,
                    totalCobrado: 0,
                };
            }
            map[item.tecnico].servicios += 1;
            map[item.tecnico].totalCobrado += item.montoTotal;
        });
        return Object.values(map);
    }, [filteredLiquidaciones]);

    // Columnas de la Tabla de Liquidación
    const liquidacionColumns = [
        {
            key: 'codigo',
            label: 'N° Orden',
            className: 'font-semibold text-slate-800 font-mono text-xs'
        },
        {
            key: 'tecnico',
            label: 'Técnico Responsable',
            className: 'font-medium text-slate-700 text-xs'
        },
        {
            key: 'cliente',
            label: 'Cliente',
            className: 'text-slate-700 text-xs font-medium'
        },
        {
            key: 'equipo',
            label: 'Equipo y Serial',
            render: (row) => (
                <div>
                    <span className="font-semibold text-slate-800 block text-xs">{row.equipo}</span>
                    <span className="text-[10px] text-slate-500 font-mono">S/N: {row.serial}</span>
                </div>
            )
        },
        {
            key: 'trabajoRealizado',
            label: 'Trabajo Realizado',
            className: 'max-w-xs text-xs text-slate-600',
            render: (row) => (
                <div title={row.trabajoRealizado} className="max-w-[240px]">
                    <span className="block text-xs leading-tight">{row.trabajoRealizado}</span>
                    {row.repuestosUsados && row.repuestosUsados !== 'Ninguno' && (
                        <span className="block text-[10px] text-amber-700 font-medium mt-0.5">
                            Repuesto: {row.repuestosUsados}
                        </span>
                    )}
                </div>
            )
        },
        {
            key: 'fechaIngreso',
            label: 'Fecha Ingreso',
            className: 'text-slate-600 font-mono text-xs whitespace-nowrap',
            render: (row) => formatDate(row.fechaIngreso)
        },
        {
            key: 'montoTotal',
            label: 'Monto Cobrado',
            className: 'font-bold text-slate-900 text-xs text-right',
            render: (row) => (
                <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200 font-mono">
                    ${row.montoTotal.toFixed(2)}
                </span>
            )
        },
    ];

    // Columnas de Logs de Auditoría
    const logColumns = [
        {
            key: 'id',
            label: 'ID Evento',
            className: 'font-mono text-xs text-slate-500 font-semibold'
        },
        {
            key: 'fecha',
            label: 'Fecha y Hora',
            className: 'font-mono text-xs text-slate-600'
        },
        {
            key: 'usuario',
            label: 'Usuario / Rol',
            className: 'font-semibold text-slate-800'
        },
        {
            key: 'modulo',
            label: 'Módulo',
            render: (row) => (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {row.modulo}
                </span>
            )
        },
        {
            key: 'accion',
            label: 'Acción Ejecutada',
            className: 'font-medium text-slate-800'
        },
        {
            key: 'detalles',
            label: 'Detalles / Descripción',
            className: 'text-slate-600 text-xs'
        }
    ];

    // Descargar backup JSON
    const handleDownloadBackup = () => {
        const backupData = {
            fechaGeneracion: new Date().toISOString(),
            sistema: 'Consumible Store - Control de Servicio Técnico',
            version: '1.0.0',
            liquidaciones: liquidacionesData,
            auditLogs: auditLogsData
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `consumible_store_backup_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    // Componente reutilizable con la estructura formal del Reporte Imprimible
    const ReportContent = ({ isModalView = false }) => (
        <div className={`printable-report bg-white text-black ${isModalView ? 'p-4' : 'p-8'}`}>
            {/* Encabezado Membretado */}
            <div className="border-b-2 border-slate-900 pb-4 mb-4">
                <div className="flex flex-row justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-[#97C719] rounded flex items-center justify-center text-white font-bold text-xs border border-black">
                                CS
                            </div>
                            <h1 className="text-base font-black tracking-tight text-slate-900">
                                CONSUMIBLE STORE, C.A.
                            </h1>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                            RIF: J-40891234-5 | Soporte y Servicio Técnico Especializado
                        </p>
                        <p className="text-[10px] text-slate-500">
                            C.C. Bolívar, Nivel PB, Local 12, Puerto Ordaz, Edo. Bolívar
                        </p>
                    </div>

                    <div className="text-right text-[10px] text-slate-600 space-y-0.5 border-l border-slate-300 pl-3">
                        <p><strong className="text-slate-800">Fecha Emisión:</strong> {new Date().toLocaleDateString('es-VE')} {new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p><strong className="text-slate-800">Generado por:</strong> Administración / Recepción</p>
                        <p><strong className="text-slate-800">Estatus:</strong> Servicios Finalizados / Cobrados</p>
                    </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 text-center">
                    <h2 className="text-sm font-black uppercase tracking-wide text-slate-900">
                        Reporte de Detalles de Servicios para Liquidación
                    </h2>
                </div>
            </div>

            {/* Parámetros de Filtro y Resumen del Reporte */}
            <div className="mb-4 text-[11px] grid grid-cols-2 sm:grid-cols-4 gap-2 border border-slate-300 bg-slate-50 p-2.5 rounded">
                <div>
                    <span className="text-slate-500 block text-[10px]">Técnico:</span>
                    <strong className="text-slate-900">{selectedTechnician === 'ALL' ? 'Todos los Técnicos' : selectedTechnician}</strong>
                </div>
                <div>
                    <span className="text-slate-500 block text-[10px]">Rango de Fecha Ingreso:</span>
                    <strong className="text-slate-900">
                        {startDate ? formatDate(startDate) : 'Inicio'} al {endDate ? formatDate(endDate) : 'Presente'}
                    </strong>
                </div>
                <div>
                    <span className="text-slate-500 block text-[10px]">Total Servicios:</span>
                    <strong className="text-slate-900">{filteredLiquidaciones.length} Registros</strong>
                </div>
                <div>
                    <span className="text-slate-500 block text-[10px]">Monto Total Cobrado:</span>
                    <strong className="text-emerald-700 text-xs">${totalFacturado.toFixed(2)}</strong>
                </div>
            </div>

            {/* Tabla Principal del Reporte */}
            <table className="w-full text-left text-[11px] border-collapse border border-slate-800 mb-4">
                <thead>
                    <tr className="bg-slate-200 border-b border-slate-800 text-slate-900 font-bold uppercase text-[10px]">
                        <th className="p-1.5 border border-slate-800 text-center w-24">N° Orden</th>
                        <th className="p-1.5 border border-slate-800">Técnico</th>
                        <th className="p-1.5 border border-slate-800">Cliente</th>
                        <th className="p-1.5 border border-slate-800">Equipo y Serial</th>
                        <th className="p-1.5 border border-slate-800">Trabajo Realizado</th>
                        <th className="p-1.5 border border-slate-800 text-center w-24">Fecha Ingreso</th>
                        <th className="p-1.5 border border-slate-800 text-right w-24">Monto Cobrado</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLiquidaciones.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="p-4 text-center text-slate-500 italic border border-slate-800">
                                No se encontraron servicios en el rango de fechas seleccionado.
                            </td>
                        </tr>
                    ) : (
                        filteredLiquidaciones.map((row, idx) => (
                            <tr key={row.id} className={`border-b border-slate-400 ${idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}`}>
                                <td className="p-1.5 border border-slate-800 font-mono font-bold text-center text-slate-900">
                                    {row.codigo}
                                </td>
                                <td className="p-1.5 border border-slate-800 font-medium text-slate-800">
                                    {row.tecnico}
                                </td>
                                <td className="p-1.5 border border-slate-800 text-slate-800">
                                    {row.cliente}
                                </td>
                                <td className="p-1.5 border border-slate-800 text-slate-800">
                                    <div className="font-semibold">{row.equipo}</div>
                                    <div className="text-[9px] text-slate-600 font-mono">S/N: {row.serial}</div>
                                </td>
                                <td className="p-1.5 border border-slate-800 text-slate-700 leading-tight">
                                    <span>{row.trabajoRealizado}</span>
                                    {row.repuestosUsados && row.repuestosUsados !== 'Ninguno' && (
                                        <div className="text-[9px] text-amber-800 font-medium">
                                            Repuesto: {row.repuestosUsados}
                                        </div>
                                    )}
                                </td>
                                <td className="p-1.5 border border-slate-800 text-center font-mono text-slate-700">
                                    {formatDate(row.fechaIngreso)}
                                </td>
                                <td className="p-1.5 border border-slate-800 text-right font-bold font-mono text-slate-900">
                                    ${row.montoTotal.toFixed(2)}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
                <tfoot>
                    <tr className="bg-slate-200 border-t-2 border-slate-900 font-bold">
                        <td colSpan="6" className="p-2 border border-slate-800 text-right uppercase text-[10px]">
                            Total General Cobrado ({filteredLiquidaciones.length} Servicios):
                        </td>
                        <td className="p-2 border border-slate-800 text-right font-mono text-xs text-slate-900">
                            ${totalFacturado.toFixed(2)}
                        </td>
                    </tr>
                </tfoot>
            </table>

            {/* Resumen por Técnico */}
            {resumenPorTecnico.length > 0 && selectedTechnician === 'ALL' && (
                <div className="mb-6 pt-2">
                    <h3 className="text-[10px] font-bold uppercase text-slate-700 mb-1">
                        Consolidado por Técnico en el Período
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                        {resumenPorTecnico.map((t) => (
                            <div key={t.nombre} className="border border-slate-300 p-1.5 rounded bg-slate-50">
                                <span className="font-bold block text-slate-800 truncate">{t.nombre}</span>
                                <div className="flex justify-between text-slate-600 mt-0.5">
                                    <span>{t.servicios} serv.</span>
                                    <strong className="text-slate-900">${t.totalCobrado.toFixed(2)}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Firmas de Conformidad */}
            <div className="grid grid-cols-2 gap-12 mt-10 pt-4 text-xs text-center border-t border-slate-300">
                <div className="pt-2">
                    <div className="w-48 border-t border-slate-800 mx-auto mb-1"></div>
                    <p className="font-bold text-slate-900">Administración / Recepción</p>
                    <p className="text-[10px] text-slate-500">Consumible Store, C.A.</p>
                </div>
                <div className="pt-2">
                    <div className="w-48 border-t border-slate-800 mx-auto mb-1"></div>
                    <p className="font-bold text-slate-900">
                        {selectedTechnician === 'ALL' ? 'Técnico Responsable' : selectedTechnician}
                    </p>
                    <p className="text-[10px] text-slate-500">Conformidad de Servicios</p>
                </div>
            </div>

            <div className="text-center text-[9px] text-slate-400 mt-6">
                Documento administrativo para control de liquidación y servicios de taller. Consumible Store, C.A.
            </div>
        </div>
    );

    return (
        <div className="space-y-6">

            {/* Encabezado Principal */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <FileSpreadsheet className="text-[#97C719]" size={24} />
                        Liquidación y Reportes de Servicios
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Reporte de servicios finalizados por fecha de ingreso para liquidación y respaldo operativo
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Botón de Vista Previa Modal */}
                    <Button
                        variant="secondary"
                        icon={Eye}
                        onClick={() => setIsPreviewOpen(true)}
                    >
                        Vista Previa
                    </Button>

                    {/* Botón de Impresión Directa vía react-to-print */}
                    <Button
                        variant="primary"
                        icon={Printer}
                        onClick={handlePrintReport}
                    >
                        Imprimir / Guardar PDF
                    </Button>

                    {/* Descargar Respaldo JSON */}
                    <Button
                        variant="secondary"
                        icon={HardDriveDownload}
                        onClick={handleDownloadBackup}
                    >
                        Respaldo
                    </Button>
                </div>
            </div>

            {/* Navegación por Pestañas */}
            <div className="flex border-b border-slate-200 gap-6">
                <button
                    onClick={() => setActiveTab('LIQUIDACION')}
                    className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${activeTab === 'LIQUIDACION'
                        ? 'border-[#97C719] text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <DollarSign size={16} className={activeTab === 'LIQUIDACION' ? 'text-[#97C719]' : 'text-slate-400'} />
                    <span>Detalle de Servicios para Liquidación</span>
                </button>

                <button
                    onClick={() => setActiveTab('LOGS')}
                    className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${activeTab === 'LOGS'
                        ? 'border-[#97C719] text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Activity size={16} className={activeTab === 'LOGS' ? 'text-[#97C719]' : 'text-slate-400'} />
                    <span>Registro de Actividad y Auditoría</span>
                </button>

                <button
                    onClick={() => setActiveTab('BACKUP')}
                    className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${activeTab === 'BACKUP'
                        ? 'border-[#97C719] text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Database size={16} className={activeTab === 'BACKUP' ? 'text-[#97C719]' : 'text-slate-400'} />
                    <span>Respaldos de Información (RNF-06)</span>
                </button>
            </div>

            {/* ======================================================== */}
            {/* PESTAÑA 1: DETALLE DE SERVICIOS PARA LIQUIDACIÓN */}
            {/* ======================================================== */}
            {activeTab === 'LIQUIDACION' && (
                <div className="space-y-6">

                    {/* Tarjetas Métricas Clave */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard
                            title="Total Monto Cobrado"
                            value={`$${totalFacturado.toFixed(2)}`}
                            icon={DollarSign}
                            color="emerald"
                        />

                        <MetricCard
                            title="Servicios en el Reporte"
                            value={filteredLiquidaciones.length.toString()}
                            icon={CheckCircle2}
                            color="blue"
                        />

                        <MetricCard
                            title="Ticket Promedio"
                            value={`$${ticketPromedio}`}
                            icon={TrendingUp}
                            color="amber"
                        />

                        <MetricCard
                            title="Técnicos Involucrados"
                            value={resumenPorTecnico.length.toString()}
                            icon={Users}
                            color="primary"
                        />
                    </div>

                    {/* Barra de Filtros */}
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                <Calendar size={14} className="text-[#97C719]" />
                                <span>Filtros rápidos por fecha:</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                    onClick={() => handleQuickDatePreset('ALL')}
                                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${!startDate && !endDate ? 'bg-[#97C719] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                >
                                    Todos
                                </button>
                                <button
                                    onClick={() => handleQuickDatePreset('TODAY')}
                                    className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors"
                                >
                                    Hoy
                                </button>
                                <button
                                    onClick={() => handleQuickDatePreset('LAST_30_DAYS')}
                                    className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors"
                                >
                                    Últimos 30 días
                                </button>
                                <button
                                    onClick={() => handleQuickDatePreset('THIS_MONTH')}
                                    className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors"
                                >
                                    Este Mes
                                </button>
                            </div>
                        </div>

                        <FilterBar fields={filterFields} onReset={handleResetFilters} />
                    </div>

                    {/* Resumen Individual por Técnico */}
                    {resumenPorTecnico.length > 0 && selectedTechnician === 'ALL' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {resumenPorTecnico.map((tec) => (
                                <Card key={tec.nombre} className="p-3 border-l-4 border-l-[#97C719]">
                                    <div className="flex justify-between items-start">
                                        <div className="overflow-hidden">
                                            <h4 className="font-bold text-slate-800 text-xs truncate" title={tec.nombre}>
                                                {tec.nombre}
                                            </h4>
                                            <p className="text-[10px] text-slate-500">{tec.servicios} servicio(s)</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                                        <span className="text-slate-400 text-[10px]">Cobrado:</span>
                                        <span className="font-bold text-slate-800">${tec.totalCobrado.toFixed(2)}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Tabla Principal de Detalle de Servicios */}
                    <Card>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <FileText size={16} className="text-[#97C719]" />
                                    Detalle de Servicios para Liquidación
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    {startDate || endDate ? (
                                        <span>Filtrando por fecha de ingreso: <strong>{startDate ? formatDate(startDate) : 'Inicio'}</strong> hasta <strong>{endDate ? formatDate(endDate) : 'Fin'}</strong></span>
                                    ) : (
                                        'Mostrando todos los servicios finalizados registrados'
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                                    {filteredLiquidaciones.length} Registros
                                </span>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    icon={Printer}
                                    onClick={handlePrintReport}
                                >
                                    Imprimir Reporte
                                </Button>
                            </div>
                        </div>

                        <Table columns={liquidacionColumns} data={filteredLiquidaciones} />
                    </Card>

                </div>
            )}

            {/* ======================================================== */}
            {/* PESTAÑA 2: AUDITORÍA Y LOGS DE ACTIVIDAD */}
            {/* ======================================================== */}
            {activeTab === 'LOGS' && (
                <div className="space-y-6">

                    {/* Filtros de Logs */}
                    <Card className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-slate-700 block mb-1">
                                    Buscar en el Registro
                                </label>
                                <input
                                    type="text"
                                    placeholder="Buscar por usuario, acción, número de orden o detalle..."
                                    value={logSearch}
                                    onChange={(e) => setLogSearch(e.target.value)}
                                    className="w-full bg-white border border-[#E2E8F0] text-xs text-slate-800 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#97C719] focus:border-transparent transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1">
                                    Módulo
                                </label>
                                <select
                                    value={logModuleFilter}
                                    onChange={(e) => setLogModuleFilter(e.target.value)}
                                    className="w-full bg-white border border-[#E2E8F0] text-xs text-slate-800 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#97C719] focus:border-transparent transition-all"
                                >
                                    <option value="ALL">Todos los Módulos</option>
                                    <option value="Órdenes">Órdenes</option>
                                    <option value="Taller">Taller / Diagnósticos</option>
                                    <option value="Clientes">Clientes</option>
                                    <option value="Liquidación">Liquidación</option>
                                    <option value="Seguridad">Seguridad / Sistema</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* Tabla de Logs */}
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">
                                    Historial Cronológico de Movimientos
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    Trazabilidad de cambios de estatus, diagnósticos, creaciones y cierres
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                                {filteredLogs.length} Eventos Registrados
                            </span>
                        </div>

                        <Table columns={logColumns} data={filteredLogs} />
                    </Card>

                </div>
            )}

            {/* ======================================================== */}
            {/* PESTAÑA 3: RESPALDOS DE INFORMACIÓN (RNF-06) */}
            {/* ======================================================== */}
            {activeTab === 'BACKUP' && (
                <div className="space-y-6">

                    <Card className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-[#F3F7E9] text-[#55720C] rounded-lg shrink-0">
                                <Database size={28} />
                            </div>
                            <div className="space-y-2 flex-1">
                                <h3 className="text-base font-bold text-slate-800">
                                    Copia de Seguridad y Respaldo de Datos (RNF-06)
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Para garantizar la integridad y prevenir la pérdida de registros históricos en la red local (LAN),
                                    el sistema permite descargar una copia completa de seguridad de las órdenes, clientes, equipos y liquidaciones.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                            Último Respaldo Local
                                        </span>
                                        <p className="text-xs font-semibold text-slate-800">Hoy, {new Date().toLocaleDateString('es-VE')} (Automático)</p>
                                        <p className="text-[11px] text-emerald-600 font-medium">Estado: Operativo e Íntegro</p>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                            Base de Datos
                                        </span>
                                        <p className="text-xs font-semibold text-slate-800">PostgreSQL (Red LAN Local)</p>
                                        <p className="text-[11px] text-slate-500 font-medium">Ubicación: C.C. Bolívar, Puerto Ordaz</p>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center gap-3">
                                    <Button
                                        variant="primary"
                                        icon={Download}
                                        onClick={handleDownloadBackup}
                                    >
                                        Descargar Copia de Seguridad (.JSON)
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                </div>
            )}

            {/* ======================================================== */}
            {/* MODAL DE VISTA PREVIA DEL REPORTE ANTES DE IMPRIMIR */}
            {/* ======================================================== */}
            <Modal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                title="Vista Previa de Reporte de Liquidación (PDF)"
                maxWidth="max-w-4xl"
            >
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-100 p-3 rounded-lg">
                        <span className="text-xs text-slate-600">
                            Verifique los datos antes de imprimir o guardar como PDF en su navegador.
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                icon={Printer}
                                size="sm"
                                onClick={handlePrintReport}
                            >
                                Imprimir / Guardar PDF
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setIsPreviewOpen(false)}
                            >
                                Cerrar
                            </Button>
                        </div>
                    </div>

                    <div className="border border-slate-300 rounded-lg shadow-sm overflow-hidden bg-white">
                        <ReportContent isModalView={true} />
                    </div>
                </div>
            </Modal>

            {/* ======================================================== */}
            {/* NODO OCULTO EN UI QUE REACT-TO-PRINT UTILIZA PARA IMPRIMIR */}
            {/* ======================================================== */}
            <div className="hidden">
                <div ref={contentRef}>
                    <ReportContent isModalView={false} />
                </div>
            </div>

        </div>
    );
};

export default ReportesPage;

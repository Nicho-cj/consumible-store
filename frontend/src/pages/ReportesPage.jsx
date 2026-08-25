import React, { useState, useMemo } from 'react';
import {
    DollarSign,
    CheckCircle2,
    Printer,
    Download,
    Activity,
    UserCheck,
    TrendingUp,
    Database,
    HardDriveDownload
} from 'lucide-react';
import Card, { MetricCard } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import FilterBar from '../components/common/FilterBar';
import { ORDER_STATUS } from '../utils/status';
import { normalizeText } from '../utils/text';

const ReportesPage = () => {
    // Pestaña activa: 'LIQUIDACION' | 'LOGS' | 'BACKUP'
    const [activeTab, setActiveTab] = useState('LIQUIDACION');

    // Filtros de Liquidación
    const [selectedTechnician, setSelectedTechnician] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [serviceTypeFilter, setServiceTypeFilter] = useState('ALL');

    // Filtros de Logs
    const [logSearch, setLogSearch] = useState('');
    const [logModuleFilter, setLogModuleFilter] = useState('ALL');

    // Mock Data de Servicios Finalizados y Liquidados (RF-12)
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
            porcentajeComision: 40,
            comision: 14.0,
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
            porcentajeComision: 40,
            comision: 18.0,
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
            porcentajeComision: 40,
            comision: 10.0,
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
            porcentajeComision: 40,
            comision: 20.0,
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
            porcentajeComision: 40,
            comision: 26.0,
            estado: ORDER_STATUS.ENTREGADO
        },
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

    // Configuración de Filtros para Liquidación
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
            ],
        },
        {
            id: 'startDate',
            label: 'Fecha Cierre Desde',
            type: 'date',
            value: startDate,
            onChange: setStartDate,
        },
        {
            id: 'endDate',
            label: 'Fecha Cierre Hasta',
            type: 'date',
            value: endDate,
            onChange: setEndDate,
        },
        {
            id: 'servicio',
            label: 'Tipo de Servicio',
            type: 'select',
            value: serviceTypeFilter,
            onChange: setServiceTypeFilter,
            options: [
                { label: 'Todos los Servicios', value: 'ALL' },
                { label: 'Mantenimiento Correctivo', value: 'Mantenimiento Correctivo' },
                { label: 'Mantenimiento Preventivo', value: 'Mantenimiento Preventivo' },
                { label: 'Revisión y Reparación', value: 'Revisión y Reparación' },
            ],
        },
    ];

    const handleResetFilters = () => {
        setSelectedTechnician('ALL');
        setStartDate('');
        setEndDate('');
        setServiceTypeFilter('ALL');
    };

    // Filtrado de Liquidaciones
    const filteredLiquidaciones = useMemo(() => {
        return liquidacionesData.filter((item) => {
            const matchesTecnico = selectedTechnician === 'ALL' || item.tecnico === selectedTechnician;
            const matchesServicio = serviceTypeFilter === 'ALL' || item.tipoServicio === serviceTypeFilter;

            const itemDate = new Date(item.fechaCierre);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const matchesStart = !start || itemDate >= start;
            const matchesEnd = !end || itemDate <= end;

            return matchesTecnico && matchesServicio && matchesStart && matchesEnd;
        });
    }, [liquidacionesData, selectedTechnician, serviceTypeFilter, startDate, endDate]);

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

    // Totales Calculados de Liquidación
    const totalFacturado = useMemo(() => {
        return filteredLiquidaciones.reduce((acc, curr) => acc + curr.montoTotal, 0);
    }, [filteredLiquidaciones]);

    const totalComisiones = useMemo(() => {
        return filteredLiquidaciones.reduce((acc, curr) => acc + curr.comision, 0);
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
                    totalComision: 0,
                };
            }
            map[item.tecnico].servicios += 1;
            map[item.tecnico].totalCobrado += item.montoTotal;
            map[item.tecnico].totalComision += item.comision;
        });
        return Object.values(map);
    }, [filteredLiquidaciones]);

    // Columnas de la Tabla de Liquidación
    const liquidacionColumns = [
        {
            key: 'codigo',
            label: 'N° Orden',
            className: 'font-semibold text-slate-800 font-mono'
        },
        {
            key: 'tecnico',
            label: 'Técnico Responsable',
            className: 'font-medium text-slate-700'
        },
        {
            key: 'cliente',
            label: 'Cliente',
            className: 'text-slate-600'
        },
        {
            key: 'equipo',
            label: 'Equipo / Serial',
            render: (row) => (
                <div>
                    <span className="font-semibold text-slate-800 block">{row.equipo}</span>
                    <span className="text-[10px] text-slate-500 font-mono">S/N: {row.serial}</span>
                </div>
            )
        },
        {
            key: 'trabajoRealizado',
            label: 'Trabajo Realizado',
            className: 'max-w-xs truncate text-[11px] text-slate-600',
            render: (row) => (
                <div title={row.trabajoRealizado} className="max-w-[220px] truncate">
                    <span>{row.trabajoRealizado}</span>
                    {row.repuestosUsados !== 'Ninguno' && (
                        <span className="block text-[10px] text-amber-600 font-semibold truncate">
                            Repuesto: {row.repuestosUsados}
                        </span>
                    )}
                </div>
            )
        },
        {
            key: 'fechaCierre',
            label: 'Fecha Cierre',
            className: 'text-slate-500 font-mono text-[11px]'
        },
        {
            key: 'montoTotal',
            label: 'Monto Cobrado',
            className: 'font-semibold text-slate-800',
            render: (row) => `$${row.montoTotal.toFixed(2)}`
        },
        {
            key: 'comision',
            label: 'Comisión Técnico',
            className: 'font-bold text-emerald-600',
            render: (row) => (
                <div>
                    <span>${row.comision.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 font-normal ml-1">({row.porcentajeComision}%)</span>
                </div>
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

    // Función para descargar backup JSON
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

    const handlePrintReport = () => {
        window.print();
    };

    return (
        <div className="space-y-6">

            {/* Encabezado Principal */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Liquidación y Reportes Operativos
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Consolidación de servicios por técnico para efectos de pago, auditoría y respaldos
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        icon={Printer}
                        onClick={handlePrintReport}
                    >
                        Imprimir Reporte
                    </Button>

                    <Button
                        variant="primary"
                        icon={HardDriveDownload}
                        onClick={handleDownloadBackup}
                    >
                        Descargar Respaldo
                    </Button>
                </div>
            </div>

            {/* Navegación por Pestañas */}
            <div className="flex border-b border-slate-200 gap-6 no-print">
                <button
                    onClick={() => setActiveTab('LIQUIDACION')}
                    className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${activeTab === 'LIQUIDACION'
                        ? 'border-[#97C719] text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <DollarSign size={16} className={activeTab === 'LIQUIDACION' ? 'text-[#97C719]' : 'text-slate-400'} />
                    <span>Liquidación por Técnico (RF-12)</span>
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
            {/* PESTAÑA 1: LIQUIDACIÓN Y SERVICIOS POR TÉCNICO (RF-12) */}
            {/* ======================================================== */}
            {activeTab === 'LIQUIDACION' && (
                <div className="space-y-6">

                    {/* Tarjetas Métricas Clave */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
                        <MetricCard
                            title="Total Facturado"
                            value={`$${totalFacturado.toFixed(2)}`}
                            icon={DollarSign}
                            color="emerald"
                        />

                        <MetricCard
                            title="Servicios Finalizados"
                            value={filteredLiquidaciones.length.toString()}
                            icon={CheckCircle2}
                            color="blue"
                        />

                        <MetricCard
                            title="Comisiones por Liquidar"
                            value={`$${totalComisiones.toFixed(2)}`}
                            icon={UserCheck}
                            color="primary"
                        />

                        <MetricCard
                            title="Ticket Promedio"
                            value={`$${ticketPromedio}`}
                            icon={TrendingUp}
                            color="amber"
                        />
                    </div>

                    {/* Barra de Filtros */}
                    <div className="no-print">
                        <FilterBar fields={filterFields} onReset={handleResetFilters} />
                    </div>

                    {/* Resumen Individual por Técnico (Mini Cards) */}
                    {resumenPorTecnico.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
                            {resumenPorTecnico.map((tec) => (
                                <Card key={tec.nombre} className="p-4 border-l-4 border-l-[#97C719]">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{tec.nombre}</h4>
                                            <p className="text-[11px] text-slate-500">{tec.servicios} servicios finalizados</p>
                                        </div>
                                        <span className="text-[10px] font-bold bg-[#F3F7E9] text-[#55720C] px-2 py-0.5 rounded border border-[#E2EED0]">
                                            40% Comisión
                                        </span>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                                        <div>
                                            <span className="text-slate-400 block text-[10px]">Facturado</span>
                                            <span className="font-semibold text-slate-700">${tec.totalCobrado.toFixed(2)}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-slate-400 block text-[10px]">A Liquidar</span>
                                            <span className="font-bold text-emerald-600">${tec.totalComision.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Tabla Principal de Detalle de Liquidación */}
                    <Card>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">
                                    Detalle de Servicios para Liquidación
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    Consolidado de órdenes finalizadas con cálculo de montos y comisiones
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                                {filteredLiquidaciones.length} Registros
                            </span>
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
                    <Card className="p-4 no-print">
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
                                        <p className="text-xs font-semibold text-slate-800">Hoy, 2026-08-25 (Automático)</p>
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
            {/* HOJA DE IMPRESIÓN FORMAL DE LIQUIDACIÓN PARA TÉCNICOS */}
            {/* ======================================================== */}
            <div className="hidden print:block printable-report bg-white text-black p-6">
                <div className="border-b-2 border-black pb-3 mb-4 flex justify-between items-start">
                    <div>
                        <h1 className="text-lg font-bold">CONSUMIBLE STORE, C.A.</h1>
                        <p className="text-xs">Sistema de Control de Servicio Técnico - C.C. Bolívar, Puerto Ordaz</p>
                        <h2 className="text-sm font-bold mt-2 uppercase">Reporte de Correlación y Liquidación de Servicios por Técnico (RF-12)</h2>
                    </div>
                    <div className="text-right text-xs">
                        <p><strong>Fecha Emisión:</strong> {new Date().toLocaleDateString('es-VE')}</p>
                        <p><strong>Filtro Técnico:</strong> {selectedTechnician === 'ALL' ? 'Todos los Técnicos' : selectedTechnician}</p>
                    </div>
                </div>

                <div className="mb-4 text-xs grid grid-cols-3 gap-2 border p-2 bg-slate-50">
                    <div><strong>Total Servicios:</strong> {filteredLiquidaciones.length}</div>
                    <div><strong>Monto Bruto Facturado:</strong> ${totalFacturado.toFixed(2)}</div>
                    <div><strong>Total Comisión a Liquidar:</strong> ${totalComisiones.toFixed(2)}</div>
                </div>

                <table className="w-full text-left text-xs border-collapse border border-black mb-6">
                    <thead>
                        <tr className="bg-slate-200 border-b border-black">
                            <th className="p-1 border border-black">N° Orden</th>
                            <th className="p-1 border border-black">Técnico</th>
                            <th className="p-1 border border-black">Cliente</th>
                            <th className="p-1 border border-black">Equipo / Serial</th>
                            <th className="p-1 border border-black">Fecha Cierre</th>
                            <th className="p-1 border border-black">Monto Total</th>
                            <th className="p-1 border border-black">Comisión (40%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLiquidaciones.map((row) => (
                            <tr key={row.id} className="border-b border-black">
                                <td className="p-1 border border-black font-mono">{row.codigo}</td>
                                <td className="p-1 border border-black">{row.tecnico}</td>
                                <td className="p-1 border border-black">{row.cliente}</td>
                                <td className="p-1 border border-black">{row.equipo} ({row.serial})</td>
                                <td className="p-1 border border-black">{row.fechaCierre}</td>
                                <td className="p-1 border border-black">${row.montoTotal.toFixed(2)}</td>
                                <td className="p-1 border border-black font-bold">${row.comision.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Firmas de Conformidad de Pago */}
                <div className="grid grid-cols-2 gap-12 mt-12 pt-6 text-xs text-center">
                    <div className="border-t border-black pt-2">
                        <p className="font-bold">Firma del Administrador / Recepción</p>
                        <p className="text-[10px] text-slate-600">Consumible Store, C.A.</p>
                    </div>
                    <div className="border-t border-black pt-2">
                        <p className="font-bold">Firma del Técnico (Conforme)</p>
                        <p className="text-[10px] text-slate-600">Recepción de Pago de Comisión</p>
                    </div>
                </div>
            </div>

            {/* Estilos CSS para Impresión de Reporte */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    .printable-report {
                        display: block !important;
                    }
                }
            `}} />

        </div>
    );
};

export default ReportesPage;

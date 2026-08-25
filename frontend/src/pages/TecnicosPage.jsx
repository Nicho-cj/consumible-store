import React, { useState, useMemo } from 'react';
import { UserPlus, Users, Wrench, AlertTriangle, Clock } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FilterBar from '../components/common/FilterBar';
import TecnicoCard from '../components/common/TecnicoCard';
import { normalizeText } from '../utils/text';

const TecnicosPage = ({ onOpenNewTechnicianModal }) => {
    // Estado de Filtros
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Configuración de Filtros para FilterBar
    const filterFields = [
        {
            id: 'search',
            label: 'Buscar Técnico',
            type: 'text',
            placeholder: 'Nombre o Apellido...',
            value: searchQuery,
            onChange: setSearchQuery,
        },
        {
            id: 'status',
            label: 'Estatus del Técnico',
            type: 'select',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
                { label: 'Todos los estatus', value: 'ALL' },
                { label: 'Activo', value: 'ACTIVE' },
                { label: 'En Pausa', value: 'ON_BREAK' },
                { label: 'Inactivo', value: 'OFF_DUTY' },
            ],
        },
    ];

    const handleResetFilters = () => {
        setSearchQuery('');
        setStatusFilter('ALL');
    };

    // Mock Data
    const tecnicosData = [
        {
            id: 1,
            nombre: 'Hector Luis Rodriguez',
            cargo: 'Técnico',
            estado: 'ACTIVE',
            ordenesActuales: [
                { codigo: 'ORD-2026-001', estatus: 'En Proceso' },
                { codigo: 'ORD-2026-004', estatus: 'Diagnóstico' },
            ],
        },
        {
            id: 2,
            nombre: 'Dario Jose Jimenez',
            cargo: 'Técnico',
            estado: 'ACTIVE',
            ordenesActuales: [
                { codigo: 'ORD-2026-002', estatus: 'En Proceso' },
            ],
        },
        {
            id: 3,
            nombre: 'Domingo',
            cargo: 'Técnico',
            estado: 'ON_BREAK',
            ordenesActuales: [
                { codigo: 'ORD-2026-009', estatus: 'En Espera' },
            ],
        },
        {
            id: 4,
            nombre: 'Eloy',
            cargo: 'Técnico',
            estado: 'OFF_DUTY',
            ordenesActuales: [],
        },
    ];

    // Filtrado ignorando acentos y mayúsculas
    const filteredTechnicians = useMemo(() => {
        return tecnicosData.filter((tec) => {
            const term = normalizeText(searchQuery);
            const matchesName = normalizeText(tec.nombre).includes(term);
            const matchesRole = normalizeText(tec.cargo).includes(term);

            const matchesSearch = matchesName || matchesRole;
            const matchesStatus =
                statusFilter === 'ALL' || tec.estado === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [tecnicosData, searchQuery, statusFilter]);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Gestión de Técnicos
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Administración de personal técnico, asignación y carga de trabajo en taller
                    </p>
                </div>

                <Button
                    variant="primary"
                    icon={UserPlus}
                    onClick={onOpenNewTechnicianModal}
                >
                    Agregar Técnico
                </Button>
            </div>

            {/* Tarjetas de Métricas Rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Técnicos Activos</p>
                        <h3 className="text-xl font-bold text-slate-800 mt-1">2</h3>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#F3F7E9] text-[#55720C]">
                        <Users size={20} />
                    </div>
                </Card>

                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Órdenes en Taller</p>
                        <h3 className="text-xl font-bold text-slate-800 mt-1">4</h3>
                    </div>
                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                        <Wrench size={20} />
                    </div>
                </Card>

                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Pendientes por Piezas</p>
                        <h3 className="text-xl font-bold text-slate-800 mt-1">1</h3>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                        <AlertTriangle size={20} />
                    </div>
                </Card>

                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Tiempo Prom. Reparación</p>
                        <h3 className="text-xl font-bold text-slate-800 mt-1">1.5 días</h3>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                        <Clock size={20} />
                    </div>
                </Card>
            </div>

            {/* Barra de Filtros Genérica */}
            <FilterBar fields={filterFields} onReset={handleResetFilters} />

            {/* Grid de Tarjetas de Técnicos */}
            {filteredTechnicians.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                    {filteredTechnicians.map((tec) => (
                        <TecnicoCard
                            key={tec.id}
                            technician={tec}
                            onViewOrders={() => alert(`Filtrar órdenes de: ${tec.nombre}`)}
                            onViewReport={() => alert(`Generar reporte de: ${tec.nombre}`)}
                        />
                    ))}
                </div>
            ) : (
                <Card className="p-8 text-center text-slate-500 text-xs">
                    No se encontraron técnicos que coincidan con los filtros aplicados.
                </Card>
            )}

        </div>
    );
};

export default TecnicosPage;
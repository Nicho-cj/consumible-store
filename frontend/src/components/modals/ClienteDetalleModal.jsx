import { useState, useMemo, useEffect } from 'react';
import { Wrench, Laptop } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { getClienteOrdenes, getClienteEquipos } from '../../api/entidades';

const ClienteDetalleModal = ({ isOpen, onClose, customer }) => {
    const [activeTab, setActiveTab] = useState('ordenes');
    const [ordenes, setOrdenes] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);

    const ordenesActivas = useMemo(
        () => ordenes.filter((o) => o.estado !== 'CANCELADO'),
        [ordenes]
    );

    const equiposRegistrados = useMemo(() => equipos, [equipos]);

    useEffect(() => {
        if (!customer?.id) return;
        let cancel = false;
        Promise.all([getClienteOrdenes(customer.id), getClienteEquipos(customer.id)])
            .then(([ordenesData, equiposData]) => {
                if (cancel) return;
                setOrdenes(ordenesData);
                setEquipos(equiposData);
            })
            .catch((err) => {
                if (!cancel) console.error('Error cargando historial del cliente:', err);
            })
            .finally(() => {
                if (!cancel) setLoading(false);
            });
        return () => { cancel = true; };
    }, [customer?.id]);

    if (!customer) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Detalle del Cliente - ${customer.nombre}`}
        >
            <div className="space-y-4">
                <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg flex flex-wrap justify-between gap-2 text-xs">
                    <div>
                        <span className="text-slate-400 block font-medium">Documento</span>
                        <span className="font-semibold text-slate-700">{customer.cedulaRif || 'N/A'}</span>
                    </div>
                    <div>
                        <span className="text-slate-400 block font-medium">Teléfono</span>
                        <span className="font-semibold text-slate-700">{customer.telefono || 'N/A'}</span>
                    </div>
                    <div>
                        <span className="text-slate-400 block font-medium">Dirección</span>
                        <span className="font-semibold text-slate-700">{customer.direccion || 'N/A'}</span>
                    </div>
                </div>

                <div className="flex border-b border-[#E2E8F0] gap-4 text-xs font-semibold">
                    <button
                        type="button"
                        onClick={() => setActiveTab('ordenes')}
                        className={`pb-2 transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${activeTab === 'ordenes'
                                ? 'border-[#97C719] text-[#55720C]'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Wrench size={14} />
                        Órdenes Activas ({ordenesActivas.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('equipos')}
                        className={`pb-2 transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${activeTab === 'equipos'
                                ? 'border-[#97C719] text-[#55720C]'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Laptop size={14} />
                        Equipos Registrados ({equiposRegistrados.length})
                    </button>
                </div>

                {activeTab === 'ordenes' ? (
                    <div>
                        {loading && <p className="text-xs text-slate-500 p-3">Cargando historial...</p>}
                        {!loading && ordenesActivas.length === 0 ? (
                            <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-[#E2E8F0]">
                                <Wrench className="mx-auto size-8 text-slate-400 mb-2" />
                                <p className="text-xs text-slate-500 font-medium">
                                    Este cliente no posee órdenes de servicio activas en este momento.
                                </p>
                            </div>
                        ) : (
                            <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                                <table className="w-full text-left text-xs text-slate-700">
                                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-[#E2E8F0]">
                                        <tr>
                                            <th className="p-2.5">N° Orden</th>
                                            <th className="p-2.5">Equipo</th>
                                            <th className="p-2.5">Fecha Ingreso</th>
                                            <th className="p-2.5 text-right">Estatus</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E2E8F0]">
                                        {ordenesActivas.map((orden) => (
                                            <tr key={orden.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="p-2.5 font-bold text-slate-800">#{orden.codigo}</td>
                                                <td className="p-2.5 font-medium text-slate-700">{orden.equipoModelo}</td>
                                                <td className="p-2.5 text-slate-500">{orden.fechaIngreso}</td>
                                                <td className="p-2.5 text-right">
                                                    <StatusBadge status={orden.estado} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        {loading && <p className="text-xs text-slate-500 p-3">Cargando equipos...</p>}
                        {!loading && equiposRegistrados.length === 0 ? (
                            <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-[#E2E8F0]">
                                <Laptop className="mx-auto size-8 text-slate-400 mb-2" />
                                <p className="text-xs text-slate-500 font-medium">
                                    No hay equipos previamente registrados para este cliente.
                                </p>
                            </div>
                        ) : (
                            <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                                <table className="w-full text-left text-xs text-slate-700">
                                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-[#E2E8F0]">
                                        <tr>
                                            <th className="p-2.5">Tipo / Categoría</th>
                                            <th className="p-2.5">Marca / Modelo</th>
                                            <th className="p-2.5">N° Serie</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E2E8F0]">
                                        {equiposRegistrados.map((eq) => (
                                            <tr key={eq.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="p-2.5 font-bold text-slate-800">{eq.tipo}</td>
                                                <td className="p-2.5 font-medium text-slate-700">{eq.marca} {eq.modelo}</td>
                                                <td className="p-2.5 font-mono text-slate-500">{eq.serial}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end pt-3 border-t border-[#E2E8F0]">
                    <Button variant="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ClienteDetalleModal;

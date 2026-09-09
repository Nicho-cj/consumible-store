import { useState, useMemo, useEffect } from 'react';
import { History } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { listOrdenes } from '../../api/ordenes';

const TecnicoHistorialModal = ({ isOpen, onClose, technician }) => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!technician?.id) return;
        let cancel = false;
        listOrdenes({ tecnicoId: technician.id })
            .then((data) => {
                if (!cancel) setOrdenes(data);
            })
            .catch((err) => {
                if (!cancel) console.error('Error cargando historial del técnico:', err);
            })
            .finally(() => {
                if (!cancel) setLoading(false);
            });
        return () => { cancel = true; };
    }, [technician?.id]);

    const historial = useMemo(
        () => ordenes.filter(
            (o) => o.estado === 'ENTREGADO' || o.estado === 'LISTO_ENTREGA'
        ),
        [ordenes]
    );

    if (!technician) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Historial de Órdenes - ${technician.nombre}`}
        >
            <div className="space-y-4">
                <p className="text-xs text-slate-500">
                    Historial de equipos diagnosticados, reparados y entregados por este técnico.
                </p>

                {loading ? (
                    <p className="text-xs text-slate-500 p-3">Cargando historial...</p>
                ) : historial.length > 0 ? (
                    <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs text-slate-700">
                            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-[#E2E8F0]">
                                <tr>
                                    <th className="p-2.5">N° Orden</th>
                                    <th className="p-2.5">Equipo / Modelo</th>
                                    <th className="p-2.5">Fecha Cierre</th>
                                    <th className="p-2.5 text-right">Estatus</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0]">
                                {historial.map((orden) => (
                                    <tr key={orden.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-2.5 font-bold text-slate-800">#{orden.codigo}</td>
                                        <td className="p-2.5 font-medium text-slate-700">{orden.equipoModelo}</td>
                                        <td className="p-2.5 text-slate-500">{orden.fechaEntregado || '-'}</td>
                                        <td className="p-2.5 text-right">
                                            <StatusBadge status={orden.estado} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-[#E2E8F0]">
                        <History className="mx-auto size-8 text-slate-400 mb-2" />
                        <p className="text-xs text-slate-500 font-medium">
                            Este técnico no posee órdenes registradas en su historial reciente.
                        </p>
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

export default TecnicoHistorialModal;
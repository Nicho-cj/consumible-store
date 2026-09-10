import { PackageSearch } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';

const TecnicoOrdenesModal = ({ isOpen, onClose, technician }) => {
    if (!technician) return null;

    const ordenes = technician.ordenesActuales || [];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Órdenes Activas - ${technician.nombre}`}
        >
            <div className="space-y-4">
                <p className="text-xs text-slate-500">
                    Órdenes en taller asignadas actualmente a este técnico.
                </p>

                {ordenes.length > 0 ? (
                    <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs text-slate-700">
                            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-[#E2E8F0]">
                                <tr>
                                    <th className="p-2.5">N° Orden</th>
                                    <th className="p-2.5 text-right">Estatus</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0]">
                                {ordenes.map((ord) => (
                                    <tr key={ord.codigo} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-2.5 font-bold text-slate-800 font-mono">#{ord.codigo}</td>
                                        <td className="p-2.5 text-right">
                                            <StatusBadge status={ord.estatus} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-[#E2E8F0]">
                        <PackageSearch className="mx-auto size-8 text-slate-400 mb-2" />
                        <p className="text-xs text-slate-500 font-medium">
                            Este técnico no posee órdenes activas en taller.
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

export default TecnicoOrdenesModal;
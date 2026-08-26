import { useState } from 'react';
import CustomerCard from '../components/common/CustomerCard';
import Input from '../components/common/Input';
import ClienteDetalleModal from '../components/modals/ClienteDetalleModal';
import { Search } from 'lucide-react';
import { mockClientes } from '../data/clientesData';

const ClientesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCliente, setSelectedCliente] = useState(null);

    const clientesFiltrados = mockClientes.filter((cliente) => {
        const term = searchTerm.toLowerCase().trim();
        const doc = (cliente.cedulaRif || cliente.documento || '').toLowerCase();
        return cliente.nombre.toLowerCase().includes(term) || doc.includes(term);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Panel de Clientes</h2>
                    <p className="text-xs text-slate-500 mt-1">Gestión de clientes e historial de órdenes.</p>
                </div>

                <div className="w-full sm:w-72">
                    <Input
                        placeholder="Buscar cliente o documento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={Search}
                    />
                </div>
            </div>

            {/* Grid de Tarjetas */}
            {clientesFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clientesFiltrados.map((cliente) => (
                        <CustomerCard
                            key={cliente.id}
                            customer={cliente}
                            onClick={() => setSelectedCliente(cliente)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-500">No se encontraron clientes que coincidan con la búsqueda.</p>
                </div>
            )}

            {/* Modal de Detalle de Cliente (Órdenes y Equipos) */}
            <ClienteDetalleModal
                isOpen={!!selectedCliente}
                onClose={() => setSelectedCliente(null)}
                customer={selectedCliente}
            />
        </div>
    );
};

export default ClientesPage;
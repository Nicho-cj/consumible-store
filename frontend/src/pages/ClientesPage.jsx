import { useState, useEffect } from 'react';
import CustomerCard from '../components/common/CustomerCard';
import Input from '../components/common/Input';
import ClienteDetalleModal from '../components/modals/ClienteDetalleModal';
import { Search, RefreshCw } from 'lucide-react';
import { listClientes } from '../api/entidades';

const ClientesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancel = false;
        listClientes()
            .then((data) => {
                if (!cancel) {
                    setClientes(data);
                    setError('');
                }
            })
            .catch((err) => {
                if (!cancel) {
                    console.error('Error cargando clientes:', err);
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
        listClientes()
            .then((data) => {
                setClientes(data);
                setError('');
            })
            .catch((err) => {
                console.error('Error cargando clientes:', err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    };

    const clientesFiltrados = clientes.filter((cliente) => {
        const term = searchTerm.toLowerCase().trim();
        const doc = (cliente.cedulaRif || '').toLowerCase();
        return (cliente.nombre || '').toLowerCase().includes(term) || doc.includes(term);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Panel de Clientes</h2>
                    <p className="text-xs text-slate-500 mt-1">Gestión de clientes e historial de órdenes.</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="w-full sm:w-72">
                        <Input
                            placeholder="Buscar cliente o documento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={Search}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={reload}
                        disabled={loading}
                        className="inline-flex items-center justify-center p-2 rounded font-semibold transition-all duration-150 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-[#E2E8F0] text-[#1E293B] hover:bg-slate-100 bg-white"
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>

            {loading && <p className="text-sm text-slate-500">Cargando clientes...</p>}
            {error && <p className="text-sm text-red-500">Error al cargar: {error}</p>}

            {!loading && !error && clientesFiltrados.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clientesFiltrados.map((cliente) => (
                        <CustomerCard
                            key={cliente.id}
                            customer={cliente}
                            onClick={() => setSelectedCliente(cliente)}
                        />
                    ))}
                </div>
            )}

            {!loading && !error && clientesFiltrados.length === 0 && (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-500">No se encontraron clientes que coincidan con la búsqueda.</p>
                </div>
            )}

            {/* Modal de Detalle de Cliente (Órdenes y Equipos) */}
            <ClienteDetalleModal
                key={selectedCliente?.id || 'none'}
                isOpen={!!selectedCliente}
                onClose={() => setSelectedCliente(null)}
                customer={selectedCliente}
            />
        </div>
    );
};

export default ClientesPage;
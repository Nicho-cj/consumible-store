import CustomerCard from '../components/common/CustomerCard';

const ClientesPage = () => {
    const clientesData = [
        {
            id: 1,
            nombre: 'DellAcuatica CA',
            documento: 'J-12345678-0',
            telefono: '(555) 442-9911',
            estado: 'ACTIVE',
            totalOrdenes: 3,
        },
        {
            id: 2,
            nombre: 'Nexus Corp',
            documento: 'V-80012234-9',
            telefono: '(555) 837-5920',
            estado: 'ACTIVE',
            totalOrdenes: 1,
        },
        {
            id: 3,
            nombre: 'Oak Valley Clinic',
            documento: 'V-12345678',
            telefono: '(555) 442-9911',
            estado: 'IDLE',
            totalOrdenes: 0,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Panel de Clientes</h2>
                <p className="text-xs text-slate-500 mt-1">Gestion de Clientes y su historial.</p>
            </div>

            {/* Grid de Tarjetas de Clientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientesData.map((cliente) => (
                    <CustomerCard
                        key={cliente.id}
                        customer={cliente}
                        onClick={() => alert(`Seleccionado: ${cliente.nombre}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ClientesPage;
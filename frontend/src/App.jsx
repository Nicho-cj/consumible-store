import { useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import NewOrderModal from './components/modals/NewOrderModal';
import OrdenEnvioModal from './components/modals/OrdenEnvioModal';

function App() {
    const [currentRole, setCurrentRole] = useState(null);
    const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [lastCreatedOrder, setLastCreatedOrder] = useState(null);

    const handleOpenNewOrderModal = () => {
        setIsNewOrderModalOpen(true);
    };

    const handleSaveOrder = (orderData) => {
        const nuevaOrdenCompleta = {
            id: Date.now(),
            codigo: `ORD-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
            fechaIngreso: new Date().toISOString().slice(0, 10),
            fechaEntregado: null,
            clienteId: null,
            clienteNombre: orderData.cliente?.nombre || 'Cliente General',
            clienteCedulaRif: orderData.cliente?.cedulaRif || '',
            clienteTelefono: orderData.cliente?.telefono || '',
            clienteEmail: '',
            equipoModelo: orderData.equipo ? `${orderData.equipo.marca} ${orderData.equipo.modelo}` : 'Equipo',
            tipoEquipo: 'Equipo de Oficina',
            equipoSerie: orderData.equipo?.serial || 'S/N-000000',
            equipoMarca: orderData.equipo?.marca || '',
            fallaReportada: orderData.equipo?.falla || 'Revisión general',
            diagnosticoInicial: orderData.equipo?.falla || 'Revisión general',
            diagnostico: '',
            observacionesFisicas: orderData.equipo?.observaciones || '',
            accesorios: '',
            tecnicoId: orderData.tecnicoId ? parseInt(orderData.tecnicoId, 10) : null,
            tecnicoAsignado: orderData.tecnicoId ? getTecnicoName(orderData.tecnicoId) : 'Sin Asignar',
            estado: 'REGISTRADO',
            contadorInicial: 0,
            contadorFinal: null,
            montoCobro: null,
            repuestosUsados: [],
        };

        setIsNewOrderModalOpen(false);
        setLastCreatedOrder(nuevaOrdenCompleta);
        setIsReceiptModalOpen(true);
    };

    const handleRoleChange = (newRole) => {
        setCurrentRole(newRole);
    };

    return (
        <>
            <AppRoutes
                currentRole={currentRole}
                onRoleChange={handleRoleChange}
                onOpenNewOrderModal={handleOpenNewOrderModal}
            />
            <NewOrderModal
                isOpen={isNewOrderModalOpen}
                onClose={() => setIsNewOrderModalOpen(false)}
                onSubmit={handleSaveOrder}
            />
            <OrdenEnvioModal
                isOpen={isReceiptModalOpen}
                onClose={() => setIsReceiptModalOpen(false)}
                order={lastCreatedOrder}
            />
        </>
    );
}

function getTecnicoName(id) {
    const tecnicos = {
        1: 'Hector Luis Rodriguez',
        2: 'Dario Jose Jimenez',
        3: 'Domingo',
        4: 'Eloy',
    };
    return tecnicos[parseInt(id, 10)] || 'Sin Asignar';
}

export default App;

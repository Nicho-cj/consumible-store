import { useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import NewOrderModal from './components/modals/NewOrderModal';
import OrdenEnvioModal from './components/modals/OrdenEnvioModal'; // <-- 1. Importar

function App() {
    const [currentRole, setCurrentRole] = useState('ADMIN_RECEPCION');

    // Control modal de Nueva Orden
    const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

    // Control modal del Comprobante / Recibo
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [lastCreatedOrder, setLastCreatedOrder] = useState(null);

    const handleOpenNewOrderModal = () => {
        setIsNewOrderModalOpen(true);
    };

    // Al hacer clic en "Guardar Orden de Servicio":
    const handleSaveOrder = (orderData) => {
        // Estructura completa de la orden simulada
        const nuevaOrdenCompleta = {
            id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            fecha: new Date().toLocaleString('es-VE'),
            tecnico: 'J. Medina',
            cliente: orderData.cliente,
            equipo: orderData.equipo,
            falla: orderData.equipo?.falla,
            serial: orderData.equipo?.serial,
            contadorInicial: 12450,
            tipoServicio: 'Revisión y Reparación'
        };

        // Cerrar modal de creación y abrir el comprobante de WhatsApp / Impresión
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

            {/* Modal de Formulario */}
            <NewOrderModal
                isOpen={isNewOrderModalOpen}
                onClose={() => setIsNewOrderModalOpen(false)}
                onSubmit={handleSaveOrder}
            />

            {/* Modal de Comprobante / WhatsApp / Impresión con JsBarcode */}
            <OrdenEnvioModal
                isOpen={isReceiptModalOpen}
                onClose={() => setIsReceiptModalOpen(false)}
                order={lastCreatedOrder}
            />
        </>
    );
}

export default App;

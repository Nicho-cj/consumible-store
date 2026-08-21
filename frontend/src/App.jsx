import React, { useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import NewOrderModal from './components/modals/NewOrderModal';

function App() {
    // Estado simulado para el Rol de Sesión
    const [currentRole, setCurrentRole] = useState('ADMIN_RECEPCION');

    // Control modal de Nueva Orden
    const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

    const handleOpenNewOrderModal = () => {
        setIsNewOrderModalOpen(true);
    };

    const handleSaveOrder = (orderData) => {
        console.log('Guardar Orden:', orderData);
        setIsNewOrderModalOpen(false);
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
        </>
    );
}

export default App;
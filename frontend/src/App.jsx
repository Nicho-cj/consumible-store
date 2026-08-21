import React, { useState } from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {
    // Estado simulado para el Rol de Sesión
    const [currentRole, setCurrentRole] = useState('ADMIN_RECEPCION');

    // Control modal de Nueva Orden
    const handleOpenNewOrderModal = () => {
        alert('Abrir Modal: Nueva Orden de Servicio');
    };

    const handleRoleChange = (newRole) => {
        setCurrentRole(newRole);
    };

    return (
        <AppRoutes
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            onOpenNewOrderModal={handleOpenNewOrderModal}
        />
    );
}

export default App;
import { useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import NewOrderModal from './components/modals/NewOrderModal';
import OrdenEnvioModal from './components/modals/OrdenEnvioModal';
import { loginAdmin, accessTechnician, clearSession, getCurrentUser, getCurrentRole } from './api/auth';
import { createOrden } from './api/ordenes';

function App() {
    // @REVISAR: la sesion es POR PESTANA (sessionStorage): cada pestaña/ventana del navegador
    // mantiene su propio rol, permitiendo varias vistas simultaneas (varios administradores
    // logueados + la vista tecnica comunitaria abierta a la vez).
    const [currentRole, setCurrentRole] = useState(getCurrentRole);

    const [currentUser, setCurrentUser] = useState(getCurrentUser);

    const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [lastCreatedOrder, setLastCreatedOrder] = useState(null);

    const handleOpenNewOrderModal = () => {
        setIsNewOrderModalOpen(true);
    };

    // @REVISAR: login del admin - valida contra el backend /auth/login (RNF-05)
    const handleLoginAdmin = async ({ usuario, password }) => {
        const data = await loginAdmin({ usuario, password });
        setCurrentRole(data.usuario.rol);
        setCurrentUser(data.usuario);
        return data;
    };

    // @REVISAR: acceso tecnico comunitario - no requiere credenciales
    const handleAccessTechnician = () => {
        accessTechnician();
        setCurrentRole('TECNICO');
        setCurrentUser(null);
    };

    const handleRoleChange = (newRole) => {
        setCurrentRole(newRole);
    };

    const handleLogout = () => {
        clearSession();
        setCurrentRole(null);
        setCurrentUser(null);
    };

    // @REVISAR: FASE 5-1 - crea la orden REAL en el backend (POST /ordenes).
    // El backend autogenera codigo_orden y fecha_ingreso; retorna la orden con sus JOINs.
    const handleSaveOrder = async (orderData) => {
        try {
            const nuevaOrden = await createOrden({
                tipoServicio: 'Revisión y Diagnóstico',
                fallaReportada: orderData.equipo?.falla || 'Revisión general',
                contadorInicial: 0,
                idCliente: orderData.cliente?.id,
                idEquipo: orderData.equipo?.id,
                idUsuarioRecep: currentUser?.id,
                idTecnico: orderData.tecnicoId ? parseInt(orderData.tecnicoId, 10) : null,
            });

            setIsNewOrderModalOpen(false);
            setLastCreatedOrder(nuevaOrden);
            setIsReceiptModalOpen(true);
        } catch (err) {
            console.error('Error al crear la orden:', err);
            alert(`Error al guardar la orden: ${err.message}`);
        }
    };

    return (
        <>
            <AppRoutes
                currentRole={currentRole}
                currentUser={currentUser}
                onRoleChange={handleRoleChange}
                onLogout={handleLogout}
                onLoginAdmin={handleLoginAdmin}
                onAccessTechnician={handleAccessTechnician}
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

export default App;

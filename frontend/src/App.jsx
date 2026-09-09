import { useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import NewOrderModal from './components/modals/NewOrderModal';
import OrdenEnvioModal from './components/modals/OrdenEnvioModal';

// @REVISAR: base URL del backend. En produccion LAN cambiar por la IP real (p.ej. http://172.24.87.158:3000)
const API_BASE = 'http://localhost:3000';

function App() {
    // @REVISAR: la sesion se persiste en localStorage para que cada PC recuerde su rol al recargar
    // (admin en su PC ve dashboard, tecnico en su PC ve la vista tecnica comunitaria)
    const [currentRole, setCurrentRole] = useState(() => {
        const saved = localStorage.getItem('cs_rol');
        return saved || null;
    });

    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('cs_usuario');
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('cs_token') || null;
    });

    const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [lastCreatedOrder, setLastCreatedOrder] = useState(null);

    const handleOpenNewOrderModal = () => {
        setIsNewOrderModalOpen(true);
    };

    // @REVISAR: login del admin - valida contra el backend /auth/login (RNF-05)
    const handleLoginAdmin = async ({ usuario, password }) => {
        const resp = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: usuario, contrasena: password }),
        });

        const data = await resp.json();

        if (!resp.ok) {
            throw new Error(data.message || 'Credenciales inválidas');
        }

        localStorage.setItem('cs_rol', data.usuario.rol);
        localStorage.setItem('cs_usuario', JSON.stringify(data.usuario));
        localStorage.setItem('cs_token', data.token);

        setCurrentRole(data.usuario.rol);
        setCurrentUser(data.usuario);
        setToken(data.token);
    };

    // @REVISAR: acceso tecnico comunitario - no requiere credenciales
    const handleAccessTechnician = () => {
        localStorage.setItem('cs_rol', 'TECNICO');
        localStorage.removeItem('cs_usuario');
        localStorage.removeItem('cs_token');
        setCurrentRole('TECNICO');
        setCurrentUser(null);
        setToken(null);
    };

    const handleRoleChange = (newRole) => {
        setCurrentRole(newRole);
    };

    const handleLogout = () => {
        localStorage.removeItem('cs_rol');
        localStorage.removeItem('cs_usuario');
        localStorage.removeItem('cs_token');
        setCurrentRole(null);
        setCurrentUser(null);
        setToken(null);
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

    return (
        <>
            <AppRoutes
                currentRole={currentRole}
                currentUser={currentUser}
                token={token}
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

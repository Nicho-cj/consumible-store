// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

// Vistas
import DashboardPage from '../pages/DashboardPage';
import OrdenesPage from '../pages/OrdenesPage';
import ClientesPage from '../pages/ClientesPage';
import EquiposPage from '../pages/EquiposPage';
import TecnicosPage from '../pages/TecnicosPage';
import ReportesPage from '../pages/ReportesPage';
import LoginPage from '../pages/LoginPage';
import TecnicosOrdenesPage from '../pages/TecnicosOrdenesPage';

const AppRoutes = ({ currentRole, onRoleChange, onOpenNewOrderModal }) => {
    const navigate = useNavigate();

    // Handlers para la autenticación
    const handleLoginAdmin = (credentials) => {
        console.log('Login Admin:', credentials);
        onRoleChange('ADMIN_RECEPCION');
        navigate('/dashboard');
    };

    const handleAccessTechnician = () => {
        console.log('Acceso Técnico');
        onRoleChange('TECNICO');
        navigate('/tecnico'); // O a la ruta /tecnico si vas a crear una vista independiente
    };

    return (
        <Routes>
            {/* Ruta pública del Login sin el Layout del Dashboard */}
            <Route
                path="/login"
                element={
                    <LoginPage
                        onLoginAdmin={handleLoginAdmin}
                        onAccessTechnician={handleAccessTechnician}
                    />
                }
            />

            {/* Rutas protegidas dentro del Layout administrativo */}
            <Route
                element={
                    <Layout
                        currentRole={currentRole}
                        onRoleChange={onRoleChange}
                        onOpenNewOrderModal={onOpenNewOrderModal}
                    />
                }
            >
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route
                    path="/dashboard"
                    element={<DashboardPage onOpenNewOrderModal={onOpenNewOrderModal} />}
                />

                <Route
                    path="/ordenes"
                    element={<OrdenesPage onOpenNewOrderModal={onOpenNewOrderModal} />}
                />
                <Route path="/clientes" element={<ClientesPage />} />
                <Route path="/tecnicos" element={<TecnicosPage />} />
                <Route path="/equipos" element={<EquiposPage />} />
                <Route path="/reportes" element={<ReportesPage />} />
                <Route path="/tecnico" element={<TecnicosOrdenesPage />} />

                <Route
                    path="*"
                    element={<h2 className="text-xl text-red-500 p-6">Página no encontrada</h2>}
                />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
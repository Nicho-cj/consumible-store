// @REVISAR: rutas - login conectado al backend, sesion por pestana (sessionStorage)
// y cerrado de sesion. Cada pestaña/ventana es independiente (varias vistas en simultaneo).
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

const AppRoutes = ({
    currentRole,
    currentUser,
    onRoleChange,
    onLogout,
    onLoginAdmin,
    onAccessTechnician,
    onOpenNewOrderModal,
}) => {
    const navigate = useNavigate();

    const handleLoginAdmin = async (credentials) => {
        const data = await onLoginAdmin(credentials);
        onRoleChange(data.usuario.rol);
        navigate('/dashboard');
    };

    const handleAccessTechnician = () => {
        onAccessTechnician();
        onRoleChange('TECNICO');
        navigate('/tecnico');
    };

    const handleLogoutTechnical = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <Routes>
            {/* Ruta publica del Login sin el Layout */}
            <Route
                path="/login"
                element={
                    <LoginPage
                        onLoginAdmin={handleLoginAdmin}
                        onAccessTechnician={handleAccessTechnician}
                    />
                }
            />

            {/* Rutas dentro del Layout administrativo */}
            <Route
                element={
                    <Layout
                        currentRole={currentRole}
                        currentUser={currentUser}
                        onRoleChange={onRoleChange}
                        onLogout={onLogout}
                        onOpenNewOrderModal={onOpenNewOrderModal}
                    />
                }
            >
                {/* Si no hay sesion, redirigir al login */}
                <Route path="/" element={currentRole ? <Navigate to={currentRole === 'TECNICO' ? '/tecnico' : '/dashboard'} replace /> : <Navigate to="/login" replace />} />

                <Route
                    path="/dashboard"
                    element={
                        currentRole === 'ADMIN_RECEPCION' && currentUser
                            ? <DashboardPage onOpenNewOrderModal={onOpenNewOrderModal} />
                            : <Navigate to="/login" replace />
                    }
                />

                <Route
                    path="/ordenes"
                    element={currentRole === 'ADMIN_RECEPCION' ? <OrdenesPage onOpenNewOrderModal={onOpenNewOrderModal} /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/clientes"
                    element={currentRole === 'ADMIN_RECEPCION' ? <ClientesPage /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/tecnicos"
                    element={currentRole === 'ADMIN_RECEPCION' ? <TecnicosPage /> : <Navigate to="/login" replace />}
                />
                <Route path="/equipos" element={currentRole ? <EquiposPage currentRole={currentRole} /> : <Navigate to="/login" replace />} />
                <Route
                    path="/reportes"
                    element={currentRole === 'ADMIN_RECEPCION' ? <ReportesPage /> : <Navigate to="/login" replace />}
                />
                <Route path="/tecnico" element={currentRole ? <TecnicosOrdenesPage onLogout={handleLogoutTechnical} /> : <Navigate to="/login" replace />} />

                <Route
                    path="*"
                    element={<h2 className="text-xl text-red-500 p-6">Página no encontrada</h2>}
                />
            </Route>
        </Routes>
    );
};

export default AppRoutes;

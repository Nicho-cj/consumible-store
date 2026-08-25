import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

// Vistas
import DashboardPage from '../pages/DashboardPage';
import OrdenesPage from '../pages/OrdenesPage';
import ClientesPage from '../pages/ClientesPage';
import EquiposPage from '../pages/EquiposPage';
import TecnicosPage from '../pages/TecnicosPage';
import ReportesPage from '../pages/ReportesPage';

const AppRoutes = ({ currentRole, onRoleChange, onOpenNewOrderModal }) => {
    return (
        <Routes>
            <Route
                element={
                    <Layout
                        currentRole={currentRole}
                        onRoleChange={onRoleChange}
                        onOpenNewOrderModal={onOpenNewOrderModal}
                    />
                }
            >
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Dashboard renderizado con componentes reutilizables */}
                <Route
                    path="/dashboard"
                    element={<DashboardPage onOpenNewOrderModal={onOpenNewOrderModal} />}
                />

                <Route path="/ordenes" element={<OrdenesPage />} />
                <Route path="/clientes" element={<ClientesPage />} />
                <Route path="/tecnicos" element={<TecnicosPage />} />
                <Route path="/equipos" element={<EquiposPage />} />
                <Route path="/reportes" element={<ReportesPage />} />

                <Route path="*" element={<h2 className="text-xl text-red-500">Página no encontrada</h2>} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
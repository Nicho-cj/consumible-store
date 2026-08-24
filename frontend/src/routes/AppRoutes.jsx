import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

// Vistas
import DashboardPage from '../pages/DashboardPage';
import OrdenesPage from '../pages/OrdenesPage';

// Modales / Placeholders
const ClientesPage = () => <h2 className="text-xl font-bold text-slate-800">Gestión de Clientes</h2>;
const TecnicosPage = () => <h2 className="text-xl font-bold text-slate-800">Gestión de Técnicos</h2>;
const ReportesPage = () => <h2 className="text-xl font-bold text-slate-800">Logs y Reportes</h2>;

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
                <Route path="/reportes" element={<ReportesPage />} />

                <Route path="*" element={<h2 className="text-xl text-red-500">Página no encontrada</h2>} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import { useState } from 'react';


export function App() {
    const [role] = useState('ADMIN_RECEPCION');

    const handleOpenNewOrderModal = () => {
        alert('Próximamente: Abrir formulario / modal para crear nueva orden');
    };

    return (
        <BrowserRouter>
            <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
                {/* Sidebar fija a la izquierda con el botón Crear Orden */}
                <NavBar
                    currentRole={role}
                    onOpenNewOrderModal={handleOpenNewOrderModal}
                />

                {/* Área donde cambian las vistas según la ruta */}
                <main className="flex-1 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<Navigate to="/ordenes" replace />} />
                        <Route path="*" element={<Navigate to="/ordenes" replace />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
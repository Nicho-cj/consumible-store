import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Header from './Header'

// @REVISAR: Layout actualizado - recibe currentUser y onLogout para mostrarlos en la UI
const Layout = ({ currentRole, currentUser, onRoleChange, onLogout, onOpenNewOrderModal }) => {
    const handleSearch = (query) => {
        console.log('Búsqueda global:', query);
    };
    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <NavBar
                currentRole={currentRole}
                onRoleChange={onRoleChange}
                onOpenNewOrderModal={onOpenNewOrderModal}
            />
            <div className="flex-1 ml-[260px] min-h-screen flex flex-col">
                <Header
                    onSearch={handleSearch}
                    currentUser={currentUser}
                    onLogout={onLogout}
                />
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;

import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Header from './Header'



const Layout = ({ currentRole, onRoleChange, onOpenNewOrderModal }) => {
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
                <Header onSearch={handleSearch} />
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
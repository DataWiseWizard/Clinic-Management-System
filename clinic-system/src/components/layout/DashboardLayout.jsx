import { useAuth } from "../../features/auth/AuthContext";
import { Link, useLocation } from 'react-router-dom';
import { FaUserMd, FaUserNurse, FaSignOutAlt, FaColumns, FaUsers, FaClipboardList, FaFileInvoiceDollar, FaChartPie } from 'react-icons/fa';

export default function DashboardLayout({ role, children }) {
    const { logout, user } = useAuth();
    const location = useLocation();

    const doctorLinks = [
        { name: "Console", path: "/doctor/dashboard", icon: <FaUserMd /> },
        { name: "Patients", path: "/doctor/patients", icon: <FaUsers /> },
        { name: "Analytics", path: "/doctor/analytics", icon: <FaChartPie /> },
    ];

    const receptionLinks = [
        { name: "Front Desk", path: "/reception/dashboard", icon: <FaColumns /> },
        { name: "Registration", path: "/reception/register", icon: <FaClipboardList /> },
        { name: "Billing", path: "/reception/billing", icon: <FaFileInvoiceDollar /> },
    ];

    const links = role === 'doctor' ? doctorLinks : receptionLinks;

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        {role === 'doctor' ? <FaUserMd size={20} /> : <FaUserNurse size={20} />}
                    </div>
                    <h1 className="font-bold text-gray-800 text-lg tracking-tight">Clinic<span className="text-blue-600">OS</span></h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-700 truncate">{user?.email}</p>
                            <p className="text-xs text-gray-400 capitalize">{role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-md transition"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b p-4 md:hidden flex justify-between items-center">
                    <span className="font-bold text-gray-800">ClinicOS</span>
                    <button onClick={logout}><FaSignOutAlt className="text-gray-600" /></button>
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
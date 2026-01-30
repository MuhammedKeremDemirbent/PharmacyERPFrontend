import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white";
    }

    return (
        <div className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-800 border-r dark:bg-gray-800 dark:border-gray-600">
            <h2 className="text-3xl font-semibold text-center text-white mb-6">Menu</h2>

            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>
                    <Link className={`flex items-center px-4 py-2 mt-5 transition-colors duration-200 transform rounded-md ${isActive('/')}`} to="/">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="mx-4 font-medium">Stok</span>
                    </Link>

                    <Link className={`flex items-center px-4 py-2 mt-5 transition-colors duration-200 transform rounded-md ${isActive('/patients')}`} to="/patients">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="mx-4 font-medium">Hastalar</span>
                    </Link>

                    <Link className={`flex items-center px-4 py-2 mt-5 transition-colors duration-200 transform rounded-md ${isActive('/procurement')}`} to="/procurement">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="mx-4 font-medium">Tedarik</span>
                    </Link>

                    <Link className={`flex items-center px-4 py-2 mt-5 transition-colors duration-200 transform rounded-md ${isActive('/sales')}`} to="/sales">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="mx-4 font-medium">Satış Ekranı</span>
                    </Link>

                    <Link className={`flex items-center px-4 py-2 mt-5 transition-colors duration-200 transform rounded-md ${isActive('/register-employee')}`} to="/register-employee">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span className="mx-4 font-medium">Personel Ekle</span>
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;

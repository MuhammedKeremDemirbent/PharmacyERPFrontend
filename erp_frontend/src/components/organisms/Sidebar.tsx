import React from 'react';
import { useLocation } from 'react-router-dom';
import NavItem from '../molecules/NavItem';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex flex-col w-64 h-screen px-4 py-8 bg-slate-900 border-r border-slate-800 shadow-xl">
            <h2 className="text-3xl font-semibold text-center text-white mb-6 tracking-tight">Menu</h2>

            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>
                    <NavItem
                        to="/"
                        label="Stok"
                        isActive={isActive('/')}
                        icon={
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        }
                    />

                    <NavItem
                        to="/patients"
                        label="Hastalar"
                        isActive={isActive('/patients')}
                        icon={
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                    />

                    <NavItem
                        to="/procurement"
                        label="Tedarik"
                        isActive={isActive('/procurement')}
                        icon={
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        }
                    />

                    <NavItem
                        to="/sales"
                        label="Satış Ekranı"
                        isActive={isActive('/sales')}
                        icon={
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />

                    <NavItem
                        to="/register-employee"
                        label="Personel Ekle"
                        isActive={isActive('/register-employee')}
                        icon={
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        }
                    />
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;

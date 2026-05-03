import React from 'react';
import { useLocation } from 'react-router-dom';
import NavItem from '../molecules/NavItem';
import { LayoutDashboard, Users, ShoppingCart, CreditCard, UserPlus, Pill } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex flex-col w-72 h-screen px-6 py-8 bg-slate-950 border-r border-white/5 shadow-2xl relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            
            <div className="flex items-center space-x-3 mb-10 px-2">
                <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
                    <Pill className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Eczane<span className="text-primary font-extrabold">ERP</span></h2>
            </div>

            <div className="flex flex-col justify-between flex-1">
                <nav className="space-y-2">
                    <NavItem
                        to="/"
                        label="Stok Yönetimi"
                        isActive={isActive('/')}
                        icon={<LayoutDashboard size={20} />}
                    />

                    <NavItem
                        to="/patients"
                        label="Hasta Takip"
                        isActive={isActive('/patients')}
                        icon={<Users size={20} />}
                    />

                    <NavItem
                        to="/procurement"
                        label="Tedarikçiler"
                        isActive={isActive('/procurement')}
                        icon={<ShoppingCart size={20} />}
                    />

                    <NavItem
                        to="/sales"
                        label="Hızlı Satış"
                        isActive={isActive('/sales')}
                        icon={<CreditCard size={20} />}
                    />

                    <div className="pt-6 mt-6 border-t border-white/5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Yönetim</p>
                        <NavItem
                            to="/register-employee"
                            label="Personel Kaydı"
                            isActive={isActive('/register-employee')}
                            icon={<UserPlus size={20} />}
                        />
                    </div>
                </nav>

                <div className="mt-auto pt-10">
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <p className="text-xs text-slate-400 leading-relaxed text-center">
                            Sürüm 1.0.1 <br/>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;


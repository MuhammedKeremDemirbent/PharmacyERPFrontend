import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import type { RootState } from '../../store/store';
import Button from '../atoms/Button';
import { User, LogOut, Bell } from 'lucide-react';

const Navbar = () => {
    const dispatch = useDispatch();
    const username = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = "/";
    };

    return (
        <nav className="glass sticky top-0 z-40 w-full px-8 py-3 flex justify-between items-center border-b border-white/10 shadow-sm">
            <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Demirbent Eczanesi Portal</span>
            </div>

            <div className="flex items-center space-x-6">
                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <Bell size={20} />
                </button>
                
                {username && (
                    <div className="flex items-center space-x-3 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <User size={14} />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {username}
                        </span>
                    </div>
                )}
                
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-slate-500 hover:text-destructive hover:bg-destructive/10 transition-all flex items-center space-x-2"
                >
                    <LogOut size={16} />
                    <span>Güvenli Çıkış</span>
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;


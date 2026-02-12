import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import type { RootState } from '../../store/store';
import Button from '../atoms/Button';

const Navbar = () => {
    const dispatch = useDispatch();
    const username = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = "/"; // Login sayfasına at
    };

    return (
        <nav className="bg-slate-900 text-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-bold flex items-center">
                    Demirbent Eczanesi
                </div>

                <div className="flex items-center space-x-4">
                    {username && (
                        <span className="font-medium border-r border-primary-foreground/30 pr-4 opacity-90">
                            👤 {username}
                        </span>
                    )}
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleLogout}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Çıkış Yap
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

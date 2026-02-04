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
        <nav className="bg-gray-800 shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-bold text-white flex items-center">
                    Demirbent Eczanesi
                </div>

                <div className="flex items-center space-x-4">
                    {username && (
                        <span className="text-gray-300 font-medium border-r border-gray-600 pr-4">
                            👤 {username}
                        </span>
                    )}
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={handleLogout}
                    >
                        Çıkış Yap
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

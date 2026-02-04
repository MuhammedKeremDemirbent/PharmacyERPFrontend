import React from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
    to: string;
    label: string;
    icon: React.ReactNode;
    isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon, isActive = false }) => {

    // Aktiflik durumuna göre stil
    const activeStyles = isActive
        ? "bg-gray-700 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white";

    return (
        <Link
            to={to}
            className={`flex items-center px-4 py-2 mt-5 transition-colors duration-200 transform rounded-md ${activeStyles}`}
        >
            {/* İkonu sarmalayalım ki boyut kontrolü bizde olsun */}
            <span className="w-5 h-5">
                {icon}
            </span>
            <span className="mx-4 font-medium">
                {label}
            </span>
        </Link>
    );
};

export default NavItem;

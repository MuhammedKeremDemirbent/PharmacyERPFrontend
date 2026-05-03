import React from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
    to: string;
    label: string;
    icon: React.ReactNode;
    isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon, isActive = false }) => {

    const activeStyles = isActive
        ? "bg-primary text-white shadow-lg shadow-primary/25 translate-x-1"
        : "text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1";

    return (
        <Link
            to={to}
            className={`flex items-center px-4 py-3 transition-all duration-300 transform rounded-xl group ${activeStyles}`}
        >
            <span className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-primary'}`}>
                {icon}
            </span>
            <span className="mx-4 text-sm font-semibold tracking-wide">
                {label}
            </span>
            {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
        </Link>
    );
};

export default NavItem;


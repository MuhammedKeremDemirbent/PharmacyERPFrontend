import React from 'react';
import Navbar from '../organisms/Navbar';
import Sidebar from '../organisms/Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sol Sidebar*/}
            <Sidebar />

            {/* Sağ Ana İçerik */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Üst Bar*/}
                <Navbar />

                {/* Sayfa İçeriği*/}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

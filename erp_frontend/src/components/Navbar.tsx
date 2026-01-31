// Link removed

const Navbar = () => {
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.reload();
    };

    const username = localStorage.getItem('username');

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
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                        Çıkış Yap
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

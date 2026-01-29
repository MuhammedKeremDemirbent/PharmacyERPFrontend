import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-bold text-white">
                    Pharmacy ERP
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

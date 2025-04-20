import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from 'react-router-dom'
import { isAuthenticated, logout } from '../utils/auth';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-transparent  p-6  fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Logo */}
        <a href="/" className="text-white text-2xl font-bold">Plantify AI</a>

        {/* Desktop Menu (Centered) */}
        <div className="hidden md:flex space-x-10 ">
          <Link to="/" className=" px-5 py-2 text-white hover:text-green-500 transition">HOME</Link>
          <Link to="/About" className=" px-5 py-2 text-white hover:text-green-500 transition">ABOUT</Link>
          <Link to="/service" className=" px-5 py-2 border border-green-400 rounded text-white hover:bg-green hover:text-green-400 transition">
            SERVICES
          </Link>
          {isAuthenticated() ? (
            <>
              <Link to="/dashboard" className="px-5 py-2 border border-green-400 rounded bg-green-400 text-white hover:bg-green-500 transition">
                DASHBOARD
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 border border-green-400 rounded bg-green-400 text-white hover:bg-green-500 transition"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2 border border-green-400 rounded bg-green-400 text-white hover:bg-green-500 transition">
                LOGIN
              </Link>
              <Link to="/register" className="px-5 py-2 border border-green-400 rounded bg-green-400 text-white hover:bg-green-500 transition">
                CREATE ACCOUNT
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-black border border-black p-2 rounded focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-16 left-0 w-full bg-white p-5 shadow-md transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="flex flex-col space-y-4">
          <Link to="#" className="text-black hover:text-gray-600 transition">Home</Link>
          <Link to="/About" className="text-black hover:text-gray-600 transition">About</Link>
          <Link to="#" className="px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition">
            Services
          </Link>
          <Link to="#" className="px-4 py-2 border border-black rounded bg-black text-white hover:bg-gray-800 transition">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;

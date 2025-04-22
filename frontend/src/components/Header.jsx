import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for scroll and update header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`p-4 fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Logo */}
        <a
          href="/"
          className={`text-2xl font-bold transition-colors ${
            scrolled ? "text-green-600" : "text-white"
          }`}
        >
          Plantify AI
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10">
          <Link
            to="/"
            className={`px-5 py-2 transition ${
              scrolled ? "text-green-700 hover:text-green-900" : "text-white hover:text-green-500"
            }`}
          >
            HOME
          </Link>
          <Link
            to="/About"
            className={`px-5 py-2 transition ${
              scrolled ? "text-green-700 hover:text-green-900" : "text-white hover:text-green-500"
            }`}
          >
            ABOUT
          </Link>
          <Link
            to="/service"
            className={`px-5 py-2 border rounded transition ${
              scrolled
                ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                : "border-green-400 text-white hover:bg-green-400 hover:text-white"
            }`}
          >
            SERVICES
          </Link>

          {isAuthenticated() ? (
            <>
              <Link
                to="/dashboard"
                className={`px-5 py-2 border rounded transition ${
                  scrolled
                    ? "border-green-600 bg-green-600 text-white hover:bg-green-700"
                    : "border-green-400 bg-green-400 text-white hover:bg-green-500"
                }`}
              >
                DASHBOARD
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`text-3xl transition ${
                    scrolled ? "text-green-600 hover:text-green-700" : "text-green-400 hover:text-green-500"
                  }`}
                >
                  <FaUserCircle />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50">
                    <ul className="py-1 text-sm text-gray-700">
                      <li>
                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/help" className="block px-4 py-2 hover:bg-gray-100">
                          Help
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                        >
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-5 py-2 border rounded transition ${
                  scrolled
                    ? "border-green-600 bg-green-600 text-white hover:bg-green-700"
                    : "border-green-400 bg-green-400 text-white hover:bg-green-500"
                }`}
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                className={`px-5 py-2 border rounded transition ${
                  scrolled
                    ? "border-green-600 bg-green-600 text-white hover:bg-green-700"
                    : "border-green-400 bg-green-400 text-white hover:bg-green-500"
                }`}
              >
                CREATE ACCOUNT
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 border rounded focus:outline-none transition ${
            scrolled ? "text-green-600 border-green-600" : "text-white border-white"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full bg-white p-5 shadow-md transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col space-y-4">
          <Link to="/" className="text-black hover:text-gray-600 transition">Home</Link>
          <Link to="/About" className="text-black hover:text-gray-600 transition">About</Link>
          <Link to="/service" className="text-black hover:text-gray-600 transition">Services</Link>
          <Link to="/contact" className="text-black hover:text-gray-600 transition">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;

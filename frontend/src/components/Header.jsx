import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import { isAuthenticated, logout } from "../utils/auth";
import axiosInstance from "../utils/axios";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get('/account/profile/');
      if (response.data) {
        setProfileData(response.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      if (authenticated) {
        fetchProfileData();
      }
    };

    // Check auth status initially
    checkAuth();

    // Check auth status when localStorage changes (cross-tab)
    window.addEventListener('storage', checkAuth);

    // Handle scroll events for navbar transparency
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    setProfileData(null);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`p-4 fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto flex justify-between items-center relative">
        <Link
          to="/"
          className={`text-2xl font-bold transition-colors ${scrolled ? "text-green-600" : "text-white"
            }`}
        >
         🌿 Plantify AI
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10 items-center">
          <Link
            to="/"
            className={`transition ${scrolled ? "text-green-700" : "text-white"
              } hover:text-green-500`}
          >
            HOME
          </Link>
          <Link
            to="/About"
            className={`transition ${scrolled ? "text-green-700" : "text-white"
              } hover:text-green-500`}
          >
            ABOUT
          </Link>
          <HashLink
            smooth
            to="/#services"
            className={`transition ${scrolled ? "text-green-700" : "text-white"
              } hover:text-green-500`}
          >
            SERVICES
          </HashLink>

          {isAuth ? (
            <>
              <Link
                to="/dashboard"
                className={`px-5 py-2 border-green-500 rounded transition ${scrolled
                  ? "bg-green-500 text-white hover:bg-green-600 hover:text-white"
                  : "bg-green-500 text-white hover:bg-green-600 hover:text-white"
                  }`}
              >
                PREDICT DISEASE
              </Link>
              <div className="relative flex items-center gap-3" ref={dropdownRef}>
                <span className="text-green-600 font-semibold text-lg hover:text-green-500">
                  {profileData?.first_name || 'User'}
                </span>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full overflow-hidden transition ${scrolled ? "border-2 border-green-600" : "border-2 border-white"
                    }`}
                >
                  {profileData?.image_url ? (
                    <img
                      src={profileData.image_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-50"><div class="text-green-600 text-2xl"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg></div></div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <FaUserCircle className="text-green-600 text-2xl" />
                    </div>
                  )}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-5 py-2  rounded transition ${scrolled
                  ? "bg-green-500 text-white hover:bg-green-600 hover:text-white"
                  : "bg-green-500 text-white hover:bg-green-600 hover:text-white"
                  }`}
              >
                LOGIN
              </Link>
              <Link
                to="/signup"
                className={`px-5 py-2 rounded  transition ${scrolled
                  ? "bg-green-500 text-white hover:bg-green-600 hover:text-white"
                  : "bg-green-500 text-white hover:bg-green-600 hover:text-white"
                  }`}
              >
                SIGNUP
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 transition ${scrolled ? "text-green-600" : "text-white"
            }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed top-16 left-0 w-full bg-white p-5 shadow-md transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/About"
              className="text-gray-700 hover:text-green-600 transition"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <HashLink
              smooth
              to="/#services"
              className="text-gray-700 hover:text-green-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Services
            </HashLink>

            {isAuth ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-green-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Predict Disease
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-green-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-left text-red-600 hover:text-red-700 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-700 hover:text-green-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

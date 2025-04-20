import { FaLinkedinIn, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
        {/* Logo and Description */}
        <div>
          <h2 className="text-2xl font-bold text-green-400">🌿 Plantify</h2>
          <p className="mt-4 text-sm text-gray-300">
            Plantify - Bringing nature closer to you with our premium collection of plants and gardening essentials.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-green-400">CONTACT</h3>
          <ul className="mt-4 space-y-2 text-gray-300">
            <li className="flex items-center justify-center md:justify-start">
              <MdLocationOn className="mr-2 text-green-300" />
              123 Green St, Nature City, Earth 400701
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <MdEmail className="mr-2 text-green-300" />
              contact@plantify.com
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <MdPhone className="mr-2 text-green-300" />
              +91-1234567890
            </li>
          </ul>
        </div>

        {/* Quick Links + Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-green-400">QUICK LINKS</h3>
          <ul className="mt-4 space-y-2 text-gray-300">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Shop</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
          <div className="mt-4 flex justify-center md:justify-start space-x-4">
            <a href="#" className="text-blue-500 hover:text-white text-xl"><FaLinkedinIn /></a>
            <a href="#" className="text-blue-400 hover:text-white text-xl"><FaTwitter /></a>
            <a href="#" className="text-pink-500 hover:text-white text-xl"><FaInstagram /></a>
            <a href="#" className="text-red-600 hover:text-white text-xl"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} <span className="text-green-400 font-semibold">Plantify</span> | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

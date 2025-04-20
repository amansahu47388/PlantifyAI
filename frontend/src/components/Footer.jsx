import { FaLinkedinIn, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="bg-green-500 text-white py-5">
      <div className="container mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo and Description */}
        <div>
          <h2 className="text-2xl font-bold">Plantify</h2>
          <p className="mt-5 text-sm text-gray-800">
            Bringing nature closer to you with our premium collection of plants.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-xl font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2 text-gray-800">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Services</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold">Follow Us</h3>
          <div className="mt-2 flex justify-center md:justify-start space-x-4 ">
            <a href="#" className="text-blue-800 hover:text-white text-xl"><FaLinkedinIn /></a>
            <a href="#" className="text-blue-700 hover:text-white text-xl"><FaTwitter /></a>
            <a href="#" className="text-pink-500 hover:text-white text-xl"><FaInstagram /></a>
            <a href="#" className="text-red-600 hover:text-white text-xl"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-white pt-4 text-center text-gray-1000 text-sm">
        &copy; {new Date().getFullYear()} Plantify. All rights reserved.
      </div>
    </footer>
  );
}


export default Footer;
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { CiLogout } from "react-icons/ci";
import { RiHome3Line } from "react-icons/ri";
import { BiSpreadsheet } from "react-icons/bi";

const NavBar = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-200 text-white shadow-lg border border-black py-1">
      <div className="container mx-auto px-4 py-4">
        <div className="flex space-x-6 items-center">
          <Link
            to="/home"
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
              isActive('/home') ? 'border-b-3 border-blue-800 bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            <RiHome3Line className='text-xl'/><p className='pl-1'>Home</p>
          </Link>
          <Link
            to="/sheets"
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
              isActive('/sheets') ? 'border-b-3 border-blue-800 bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            <BiSpreadsheet className='text-xl'/><p className='pl-1'>CP Sheets</p>
          </Link>
          <div className="flex-1 text-center pr-12">
            <span className="text-4xl font-bold text-gray-800">
              Code<span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent ml-1">Orbit</span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center ml-auto bg-red-500 hover:bg-red-600 border border-black px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            title='Logout'
          >
            <CiLogout className='text-2xl'/><p className='pl-1'>Logout</p>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

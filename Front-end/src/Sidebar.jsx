import React from "react";
import { Home, List, Users, Tool, LogOut } from "feather-icons-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center p-2 rounded-lg ${
      isActive ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="sidebar bg-white w-64 border-r border-gray-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Tool className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800 ml-2">ServiTI</h1>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <NavLink to="/LandingPage" className={linkClass}>
              <Home className="w-5 h-5" />
              <span className="ml-3">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/chamados" className={linkClass}>
              <List className="w-5 h-5" />
              <span className="ml-3">Chamados</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/clientes" className={linkClass}>
              <Users className="w-5 h-5" />
              <span className="ml-3">Clientes</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Seção do usuário + botão de logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <img
            src="http://static.photos/people/200x200/1"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">admin@serviti.com</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

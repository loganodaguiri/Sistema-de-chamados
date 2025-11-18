import React, { useEffect, useState } from "react";
import { Home, List, Users, Tool, LogOut } from "feather-icons-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", id: null });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        setUser({
          email: payload.email,
          id: payload.id,
        });
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
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

      {/* Usuário logado */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <img
            src="https://api.dicebear.com/7.x/initials/svg?seed=User"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">
              {user.email?.split("@")[0] || "Usuário"}
            </p>
            <p className="text-xs text-gray-500">{user.email || "email@dominio.com"}</p>
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

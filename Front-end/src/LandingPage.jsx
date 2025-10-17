import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { Home, List, Users, Settings, Tool, AlertCircle, Clock, CheckCircle, Bell, Search } from "feather-icons-react";
import AOS from "aos";
import "aos/dist/aos.css";
import "tailwindcss/tailwind.css";

export default function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 font-[Inter,sans-serif]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Landing Page</h2>
        </header>

        {/* Main section */}
        <main className="p-6">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card title="Dashboard" value="24" color="blue" Icon={Home} />
            <Card title="Chamados" value="12" color="yellow" Icon={List} />
            <Card title="Clientes" value="36" color="purple" Icon={Users} />
            <Card title="Configurações" value="3" color="green" Icon={Settings} />
          </div>

          {/* Chamados Recentes */}
          <TicketsTable />

          {/* Charts / Estatísticas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ChartCard title="Chamados por Status" src="http://static.photos/abstract/640x360/1" />
            <ChartCard title="Chamados por Mês" src="http://static.photos/abstract/640x360/2" />
          </div>
        </main>
      </div>
    </div>
  );
}

// Componente Card
const Card = ({ title, value, color, Icon }) => (
  <div
    className="bg-white p-6 rounded-lg shadow hover:-translate-y-1 transition-transform flex items-center justify-between"
    data-aos="fade-up"
  >
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
    </div>
    <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
      <Icon />
    </div>
  </div>
);

// Componente TicketsTable
const TicketsTable = () => {
  const chamados = [
    { id: "#4567", titulo: "Problema com impressora", cliente: "Empresa A", status: "Em andamento", cor: "yellow", data: "10/05/2023" },
    { id: "#4566", titulo: "Acesso ao sistema", cliente: "Empresa B", status: "Resolvido", cor: "green", data: "09/05/2023" },
    { id: "#4565", titulo: "Rede lenta", cliente: "Empresa C", status: "Aberto", cor: "blue", data: "08/05/2023" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8" data-aos="fade-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Chamados Recentes</h3>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-500">Ver todos</a>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["ID", "Título", "Cliente", "Status", "Data"].map((th) => (
                <th key={th} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chamados.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.titulo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.cliente}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${c.cor}-100 text-${c.cor}-800`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente ChartCard
const ChartCard = ({ title, src }) => (
  <div className="bg-white rounded-lg shadow-sm p-6" data-aos="fade-up">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="h-64">
      <img src={src} alt={title} className="w-full h-full object-cover rounded" />
    </div>
  </div>
);

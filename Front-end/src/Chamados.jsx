import React, { useEffect, useState } from "react";
import feather from "feather-icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Componente Sidebar importado

// Header da página
const Header = () => {
  const navigate = useNavigate();

  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Chamados</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/NovoChamado")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <i data-feather="plus" className="w-4 h-4 mr-2"></i>
            Novo Chamado
          </button>
        </div>
      </div>
    </header>
  );
};

// Filtros da página
const Filters = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
    <div className="flex flex-wrap items-center gap-4">
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          id="status"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Todos</option>
          <option value="open">Abertos</option>
          <option value="progress">Em andamento</option>
          <option value="closed">Resolvidos</option>
        </select>
      </div>
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
        <select
          id="priority"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Todas</option>
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Período</label>
        <select
          id="date"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="7days">Últimos 7 dias</option>
          <option value="30days">Últimos 30 dias</option>
          <option value="all">Todos</option>
        </select>
      </div>
      <div className="ml-auto">
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center">
          <i data-feather="filter" className="w-4 h-4 mr-2"></i>
          Aplicar Filtros
        </button>
      </div>
    </div>
  </div>
);

// Tabela de tickets
const TicketsTable = () => {
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "alta": return "bg-red-100 text-red-800";
      case "media": return "bg-yellow-100 text-yellow-800";
      case "baixa": return "bg-blue-100 text-blue-800";
      default: return "";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "aberto": return "bg-blue-100 text-blue-800";
      case "em andamento": return "bg-yellow-100 text-yellow-800";
      case "resolvido": return "bg-green-100 text-green-800";
      default: return "";
    }
  };

  // Função para buscar tickets
  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:3000/chamados", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTickets(data.chamados || []);
    } catch (err) {
      console.error("Erro ao buscar chamados:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  useEffect(() => {
    feather.replace(); // Atualiza os ícones após carregar tickets
  }, [tickets]);

  // Função para excluir ticket
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este chamado?")) return;
    try {
      const res = await fetch(`http://localhost:3000/chamados/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTickets(tickets.filter(ticket => ticket.id !== id));
      } else {
        const errData = await res.json();
        alert("Erro ao excluir chamado: " + (errData.message || res.statusText));
      }
    } catch (err) {
      console.error("Erro ao excluir chamado:", err);
      alert("Erro ao excluir chamado");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["ID", "Título", "Cliente", "Prioridade", "Status", "Data", "Ações"].map((th) => (
                <th key={th} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${th === "Ações" ? "text-right" : ""}`}>
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{ticket.titulo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.cliente_nome}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.prioridade)}`}>
                    {ticket.prioridade}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.data_criacao ? new Date(ticket.data_criacao).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <a href="#" className="text-blue-600 hover:text-blue-900"><i data-feather="eye"></i></a>
                    <button
                      className="text-green-600 hover:text-green-900"
                      onClick={() => navigate(`/NovoChamado/${ticket.id}`)}
                    >
                      <i data-feather="edit"></i>
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(ticket.id)}
                    >
                      <i data-feather="trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Página Chamados
const ChamadosPage = () => {
  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-6">
          <Filters />
          <TicketsTable />
        </main>
      </div>
    </div>
  );
};

export default ChamadosPage;

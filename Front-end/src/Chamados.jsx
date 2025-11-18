// ChamadosPage.jsx
import React, { useEffect, useState } from "react";
import feather from "feather-icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ResponderChamadoModal from "./ResponderChamadoModal";

// ----------------------------
// Header da página
// ----------------------------
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

// ----------------------------
// Tabela de tickets (COM PAGINAÇÃO)
// ----------------------------
const TicketsTable = () => {
  const [tickets, setTickets] = useState([]);
  const [isResponderModalOpen, setResponderModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ----------------------------
  // PAGINAÇÃO
  // ----------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentTickets = tickets.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ----------------------------
  // Prioridade
  // ----------------------------
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "alta":
        return "bg-red-100 text-red-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "baixa":
        return "bg-blue-100 text-blue-800";
      default:
        return "";
    }
  };

  // ----------------------------
  // Status
  // ----------------------------
  const statusMap = {
    aberto: { label: "Aberto", color: "bg-blue-100 text-blue-800" },
    em_progresso: {
      label: "Em Progresso",
      color: "bg-yellow-100 text-yellow-800",
    },
    resolvido: { label: "Resolvido", color: "bg-green-100 text-green-800" },
    fechado: { label: "Fechado", color: "bg-red-100 text-red-800" },
  };

  const getStatusInfo = (status) =>
    statusMap[status] || { label: status, color: "" };

  // ----------------------------
  // Buscar tickets
  // ----------------------------
  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:3000/chamados", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setTickets(data.chamados || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Erro ao buscar chamados:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  useEffect(() => {
    feather.replace();
  }, [tickets, currentPage]);

  // ----------------------------
  // Excluir ticket
  // ----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este chamado?")) return;

    try {
      const res = await fetch(`http://localhost:3000/chamados/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setTickets(tickets.filter((ticket) => ticket.id !== id));
      } else {
        const errData = await res.json();
        alert(
          "Erro ao excluir chamado: " + (errData.message || res.statusText)
        );
      }
    } catch (err) {
      console.error("Erro ao excluir chamado:", err);
      alert("Erro ao excluir chamado");
    }
  };

  // ----------------------------
  // Modal
  // ----------------------------
  const handleOpenModal = (id) => {
    setSelectedTicketId(id);
    setResponderModalOpen(true);
  };

  const handleCloseModal = () => {
    setResponderModalOpen(false);
    setSelectedTicketId(null);
  };

  // ----------------------------
  // JSX da tabela
  // ----------------------------
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "ID",
                "Título",
                "Cliente",
                "Prioridade",
                "Status",
                "Data",
                "Ações",
              ].map((th) => (
                <th
                  key={th}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    th === "Ações" ? "text-right" : ""
                  }`}
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentTickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Nenhum chamado encontrado.
                </td>
              </tr>
            ) : (
              currentTickets.map((ticket) => {
                const statusInfo = getStatusInfo(ticket.status);

                return (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ticket.id}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ticket.titulo}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.cliente_nome}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                          ticket.prioridade
                        )}`}
                      >
                        {ticket.prioridade}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.data_criacao
                        ? new Date(ticket.data_criacao).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleOpenModal(ticket.id)}
                        >
                          <i data-feather="eye"></i>
                        </button>

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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------------------- */}
      {/* PAGINAÇÃO */}
      {/* ---------------------------- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center p-4 space-x-2">
          <button
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-2 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima
          </button>
        </div>
      )}

      {/* Modal */}
      <ResponderChamadoModal
        isOpen={isResponderModalOpen}
        onClose={handleCloseModal}
        chamadoId={selectedTicketId}
      />
    </div>
  );
};

// ----------------------------
// Página Chamados
// ----------------------------
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
          <TicketsTable />
        </main>
      </div>
    </div>
  );
};

export default ChamadosPage;

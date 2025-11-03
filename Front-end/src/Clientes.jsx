import React, { useEffect, useState } from "react";
import feather from "feather-icons";
import Sidebar from "./Sidebar";

// Header
const Header = () => {
  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Clientes</h2>
        <div className="flex items-center space-x-4">
          <a
            href="/NovoCliente"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <i data-feather="plus" className="w-4 h-4 mr-2"></i>
            Novo Cliente
          </a>
        </div>
      </div>
    </header>
  );
};

// Linha da tabela
const ClientRow = ({ client, onEdit, onDelete }) => {
  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {client.nome}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {client.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {client.telefone}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {client.empresa}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <button
          onClick={() => onEdit(client)}
          className="text-green-600 hover:text-green-900"
        >
          <i data-feather="edit" className="w-4 h-4"></i>
        </button>
        <button
          onClick={() => onDelete(client.id)}
          className="text-red-600 hover:text-red-900"
        >
          <i data-feather="trash-2" className="w-4 h-4"></i>
        </button>
      </td>
    </tr>
  );
};

// Tabela de clientes com paginação
const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/clientes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClients(data.clientes || []);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleEdit = (client) => {
    window.location.href = `/NovoCliente/${client.id}`;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao excluir cliente");

      setClients((prev) => prev.filter((c) => c.id !== id));
      alert("Cliente excluído com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir cliente");
    }
  };

  // Paginação
  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClients = clients.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentClients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Botões de Paginação */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

// Página Clientes
const ClientesPage = () => {
  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-6">
          <ClientsTable />
        </main>
      </div>
    </div>
  );
};

export default ClientesPage;

import React, { useEffect, useState } from "react";
import feather from "feather-icons";
import Sidebar from "./Sidebar";
import { IMaskInput } from "react-imask";
import { useParams } from "react-router-dom";

// Header
const Header = () => {
  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Novo Cliente</h2>
        <div className="flex items-center space-x-4">
          <a
            href="/clientes"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center"
          >
            <i data-feather="arrow-left" className="w-4 h-4 mr-2"></i>
            Voltar
          </a>
        </div>
      </div>
    </header>
  );
};

// Formulário Novo Cliente
const ClienteForm = () => {
  const { id } = useParams(); // Pegando o id da URL
  const [formData, setFormData] = useState({
    cpf: "",
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    cargo: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    observacoes: "",
  });

  // Buscar cliente se houver id
  useEffect(() => {
    const fetchCliente = async () => {
      if (!id) return; // Se não houver id, não faz nada
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/clientes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Erro ao buscar cliente");
        const data = await res.json();
        setFormData({
          cpf: data.cpf || "",
          nome: data.nome || "",
          email: data.email || "",
          telefone: data.telefone || "",
          empresa: data.empresa || "",
          cargo: data.cargo || "",
          endereco: data.endereco || "",
          cidade: data.cidade || "",
          estado: data.estado || "",
          cep: data.cep || "",
          observacoes: data.observacoes || "",
        });
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar dados do cliente");
      }
    };

    fetchCliente();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          endereco: data.logradouro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const method = id ? "PUT" : "POST"; // Se houver id, é edição
      const url = id
        ? `http://localhost:3000/clientes/${id}`
        : "http://localhost:3000/clientes";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Erro: ${errorData.message}`);
        return;
      }

      const data = await res.json();
      alert(
        id ? "Cliente atualizado com sucesso!" : "Cliente criado com sucesso!",
      );
      console.log(data.cliente);

      if (!id) {
        // Limpar formulário apenas se for criação
        setFormData({
          cpf: "",
          nome: "",
          email: "",
          telefone: "",
          empresa: "",
          cargo: "",
          endereco: "",
          cidade: "",
          estado: "",
          cep: "",
          observacoes: "",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar cliente");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              CPF
            </label>
            <IMaskInput
              mask="000.000.000-00"
              value={formData.cpf}
              onAccept={(value) => setFormData({ ...formData, cpf: value })}
              id="cpf"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="000.000.000-00"
              required
            />
          </div>
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome Completo
            </label>
            <input
              type="text"
              id="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o nome completo"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="exemplo@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Telefone
            </label>
            <IMaskInput
              mask="(00) 00000-0000"
              value={formData.telefone}
              onAccept={(value) =>
                setFormData({ ...formData, telefone: value })
              }
              id="telefone"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="(00) 00000-0000"
            />
          </div>
          <div>
            <label
              htmlFor="empresa"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Empresa
            </label>
            <input
              type="text"
              id="empresa"
              value={formData.empresa}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nome da empresa"
            />
          </div>
          <div>
            <label
              htmlFor="cargo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cargo
            </label>
            <input
              type="text"
              id="cargo"
              value={formData.cargo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Cargo na empresa"
            />
          </div>
        </div>

        {/* CEP e Endereço */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label
              htmlFor="cep"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              CEP
            </label>
            <IMaskInput
              mask="00000-000"
              value={formData.cep}
              onAccept={(value) => setFormData({ ...formData, cep: value })}
              onBlur={handleCepBlur}
              id="cep"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="00000-000"
            />
          </div>

          <div>
            <label
              htmlFor="endereco"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Endereço
            </label>
            <input
              type="text"
              id="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rua, número, complemento"
            />
          </div>

          <div>
            <label
              htmlFor="cidade"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cidade
            </label>
            <input
              type="text"
              id="cidade"
              value={formData.cidade}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Cidade"
            />
          </div>

          <div>
            <label
              htmlFor="estado"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Estado
            </label>
            <input
              type="text"
              id="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="UF"
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="observacoes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Observações
          </label>
          <textarea
            id="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Alguma observação importante sobre o cliente"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
          >
            <i data-feather="save" className="w-4 h-4 mr-2"></i>
            {id ? "Atualizar Cliente" : "Salvar Cliente"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Página Principal
const NovoClientePage = () => {
  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-6">
          <ClienteForm />
        </main>
      </div>
    </div>
  );
};

export default NovoClientePage;

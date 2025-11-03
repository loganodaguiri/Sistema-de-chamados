import React, { useEffect, useState } from "react";
import feather from "feather-icons";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const Header = () => (
  <header className="bg-white border-b border-gray-200 p-4">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Novo Chamado</h2>
      <div className="flex items-center space-x-4">
        <a
          href="/chamados"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center"
        >
          <i data-feather="arrow-left" className="w-4 h-4 mr-2"></i>
          Voltar
        </a>
      </div>
    </div>
  </header>
);

const NovoChamadoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [arquivo, setArquivo] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({
    cliente_id: "",
    categoria: "",
    prioridade: "baixa",
    responsavel_id: "",
    titulo: "",
    descricao: "",
    status: "aberto",
  });

  useEffect(() => {
    feather.replace();
    const token = localStorage.getItem("token");

    // Pega info do usuário logado do localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "{}");
    setUsuario({ isAdmin: usuarioLogado.isAdmin });

    // Buscar clientes
    const fetchClientes = async () => {
      try {
        const res = await fetch("http://localhost:3000/clientes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setClientes(data.clientes || []);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      }
    };
    fetchClientes();

    // Buscar usuários administradores
    const fetchResponsaveis = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/admins", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setResponsaveis(data.usuarios || []);
      } catch (err) {
        console.error("Erro ao buscar responsáveis:", err);
      }
    };
    fetchResponsaveis();

    // Buscar chamado se estiver em edição
    if (id) {
      const fetchChamado = async () => {
        try {
          const res = await fetch(`http://localhost:3000/chamados/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setFormData({
            cliente_id: data.cliente_id || "",
            categoria: data.categoria || "",
            prioridade: data.prioridade || "baixa",
            responsavel_id: data.responsavel_id || "",
            titulo: data.titulo || "",
            descricao: data.descricao || "",
            status: data.status || "aberto",
          });
          if (data.anexo) setArquivo({ name: data.anexo });
        } catch (err) {
          console.error("Erro ao buscar chamado:", err);
        }
      };
      fetchChamado();
    }
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSizeMB = 10;
    if (file.size / 1024 / 1024 > maxSizeMB) {
      alert(`Arquivo muito grande! Máximo permitido: ${maxSizeMB}MB.`);
      e.target.value = null;
      setArquivo(null);
      return;
    }
    setArquivo(file);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (
      !formData.cliente_id ||
      !formData.categoria ||
      !formData.prioridade ||
      !formData.titulo ||
      !formData.responsavel_id
    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const data = new FormData();
    data.append("cliente_id", formData.cliente_id);
    data.append("categoria", formData.categoria);
    data.append("prioridade", formData.prioridade);
    data.append("responsavel_id", formData.responsavel_id);
    data.append("titulo", formData.titulo);
    data.append("descricao", formData.descricao || "");
    if (arquivo) data.append("anexo", arquivo);

    // Sempre envia status se estiver em edição
    if (id) {
      data.append("status", formData.status);
    }

    try {
      const url = id
        ? `http://localhost:3000/chamados/${id}`
        : "http://localhost:3000/chamados";
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.message || "Erro ao salvar chamado");
        return;
      }

      alert(`Chamado ${id ? "atualizado" : "criado"} com sucesso!`);
      navigate("/chamados");
    } catch (err) {
      console.error("Erro ao salvar chamado:", err);
      alert("Erro ao salvar chamado");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Cliente */}
          <div>
            <label
              htmlFor="cliente_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cliente
            </label>
            <select
              id="cliente_id"
              value={formData.cliente_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label
              htmlFor="categoria"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categoria
            </label>
            <select
              id="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Rede">Rede</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          {/* Prioridade */}
          <div>
            <label
              htmlFor="prioridade"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Prioridade
            </label>
            <select
              id="prioridade"
              value={formData.prioridade}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>

          {/* Responsável */}
          <div>
            <label
              htmlFor="responsavel_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Responsável
            </label>
            <select
              id="responsavel_id"
              value={formData.responsavel_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um responsável</option>
              {responsaveis.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status — só para edição e admins */}
        {id && usuario?.isAdmin && (
          <div className="mb-6">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="aberto">Aberto</option>
              <option value="em_progresso">Em progresso</option>
              <option value="resolvido">Resolvido</option>
              <option value="fechado">Fechado</option>
            </select>
          </div>
        )}

        {/* Título */}
        <div className="mb-6">
          <label
            htmlFor="titulo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Título
          </label>
          <input
            type="text"
            id="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Descreva brevemente o problema"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Descrição */}
        <div className="mb-6">
          <label
            htmlFor="descricao"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descrição
          </label>
          <textarea
            id="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows="5"
            placeholder="Descreva detalhadamente o problema"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Upload de arquivo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anexo
          </label>
          <div className="flex flex-col items-start gap-2">
            <label
              htmlFor="anexo"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <i
                  data-feather="upload"
                  className="w-8 h-8 text-gray-400 mb-2"
                ></i>
                <p className="mb-2 text-sm text-gray-500">
                  Clique para fazer upload
                </p>
                <p className="text-xs text-gray-500">
                  Apenas 1 arquivo: JPG, PNG, PDF (Max. 10MB)
                </p>
                {arquivo && typeof arquivo === "object" && (
                  <p className="text-sm text-gray-700 mt-2">
                    Arquivo selecionado: {arquivo.name}
                  </p>
                )}
              </div>
              <input
                id="anexo"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".jpg,.png,.pdf"
              />
            </label>
            {arquivo && typeof arquivo === "string" && (
              <a
                href={`http://localhost:3000/uploads/${arquivo}`}
                download
                className="text-blue-600 hover:underline text-sm"
              >
                Baixar anexo atual: {arquivo}
              </a>
            )}
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-between mt-8">
          <div className="flex gap-3">
            {/* Botão de responder — apenas para admins */}
            {id && usuario?.isAdmin && (
              <button
                type="button"
                onClick={() => navigate(`/chamados/${id}/responder`)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center"
              >
                <i data-feather="message-square" className="w-4 h-4 mr-2"></i>
                Responder Chamado
              </button>
            )}

            {/* Botão de avaliar — qualquer usuário */}
            {id && (
              <button
                type="button"
                onClick={() => navigate(`/chamados/${id}/avaliar`)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg flex items-center"
              >
                <i data-feather="star" className="w-4 h-4 mr-2"></i>
                Avaliar Chamado
              </button>
            )}
          </div>

          {/* Botão principal */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
          >
            <i data-feather="save" className="w-4 h-4 mr-2"></i>
            {id ? "Atualizar Chamado" : "Salvar Chamado"}
          </button>
        </div>
      </form>
    </div>
  );
};

const NovoChamadoPage = () => {
  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-6">
          <NovoChamadoForm />
        </main>
      </div>
    </div>
  );
};

export default NovoChamadoPage;

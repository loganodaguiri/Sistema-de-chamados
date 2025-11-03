import React, { useEffect, useState } from "react";

const ResponderChamadoModal = ({ isOpen, onClose, chamadoId }) => {
  const [resposta, setResposta] = useState("");
  const [respostas, setRespostas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRespostas, setLoadingRespostas] = useState(false);

  const token = localStorage.getItem("token");

  // Função para buscar todas as respostas do chamado
  const fetchRespostas = async () => {
    if (!chamadoId) return;
    try {
      setLoadingRespostas(true);
      const res = await fetch(
        `http://localhost:3000/chamados/${chamadoId}/respostas`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (res.ok) {
        setRespostas(data.respostas || []);
      } else {
        console.error("Erro ao buscar respostas:", data.message);
      }
    } catch (err) {
      console.error("Erro ao buscar respostas:", err);
    } finally {
      setLoadingRespostas(false);
    }
  };

  // Busca respostas ao abrir o modal ou quando chamadoId mudar
  useEffect(() => {
    if (isOpen) {
      fetchRespostas();
    }
  }, [isOpen, chamadoId]);

  // Envia nova resposta
  const salvarResposta = async () => {
    if (!resposta.trim()) {
      alert("Digite uma resposta antes de enviar!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3000/chamados/${chamadoId}/respostas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mensagem: resposta }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Erro ao enviar resposta");
        return;
      }
      setResposta(""); // limpa campo
      fetchRespostas(); // atualiza lista de respostas
    } catch (err) {
      console.error("Erro ao enviar resposta:", err);
      alert("Erro ao enviar resposta");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Responder Chamado
        </h2>

        {/* Lista de respostas */}
        <div className="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded p-3">
          {loadingRespostas ? (
            <p>Carregando respostas...</p>
          ) : respostas.length === 0 ? (
            <p>Nenhuma resposta ainda.</p>
          ) : (
            respostas.map((r) => (
              <div key={r.id} className="mb-3 border-b border-gray-200 pb-2">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>{r.usuarioNome}</span>
                  <span>{new Date(r.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-gray-800">{r.mensagem}</div>
              </div>
            ))
          )}
        </div>

        {/* Campo para digitar nova resposta */}
        <textarea
          value={resposta}
          onChange={(e) => setResposta(e.target.value)}
          rows="4"
          placeholder="Digite sua resposta aqui..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={salvarResposta}
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Enviando..." : "Enviar Resposta"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponderChamadoModal;

import React, { useState, useEffect } from "react";

const AvaliarChamadoModal = ({ isOpen, onClose, chamadoId }) => {
  const [comentario, setComentario] = useState("");
  const [estrelas, setEstrelas] = useState(0);
  const [avaliacaoExistente, setAvaliacaoExistente] = useState(null);

  // ✅ useEffect deve estar fora de qualquer condicional
  useEffect(() => {
    if (isOpen && chamadoId) {
      const token = localStorage.getItem("token");
      fetch(`http://localhost:3000/chamados/${chamadoId}/avaliacao`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const avaliacao = data?.avaliacao; // 👈 pega dentro do objeto
          if (avaliacao && avaliacao.id) {
            setAvaliacaoExistente(avaliacao);
            setComentario(avaliacao.comentario || "");
            setEstrelas(avaliacao.estrelas || 0);
          } else {
            setAvaliacaoExistente(null);
            setComentario("");
            setEstrelas(0);
          }
        })
        .catch((err) => console.error("Erro ao buscar avaliação:", err));
    }
  }, [isOpen, chamadoId]);

  // ✅ Só depois de inicializar tudo, pode retornar null se o modal estiver fechado
  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (estrelas === 0) {
      alert("Selecione pelo menos uma estrela!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/chamados/${chamadoId}/avaliar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comentario, estrelas }),
        },
      );

      if (res.ok) {
        alert("Avaliação enviada com sucesso!");
        setComentario("");
        setEstrelas(0);
        onClose();
      } else {
        const data = await res.json();
        alert("Erro ao enviar avaliação: " + (data.message || res.statusText));
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar avaliação");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-96 p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">
          Avaliar Chamado #{chamadoId}
        </h2>

        {/* Comentário */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comentário
        </label>
        <textarea
          rows={4}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Digite seu comentário"
          disabled={!!avaliacaoExistente}
          className={`w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none ${
            avaliacaoExistente
              ? "bg-gray-100 cursor-not-allowed"
              : "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />

        {/* Estrelas */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estrelas
        </label>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <svg
              key={n}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={n <= estrelas ? "yellow" : "gray"}
              className={`w-6 h-6 mr-1 ${
                avaliacaoExistente
                  ? "cursor-default"
                  : "cursor-pointer hover:scale-110 transition-transform"
              }`}
              onClick={() => !avaliacaoExistente && setEstrelas(n)}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.377 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.377-2.455a1 1 0 00-1.176 0l-3.377 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.393c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.966z" />
            </svg>
          ))}
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Fechar
          </button>

          {!avaliacaoExistente && (
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
              onClick={handleSubmit}
            >
              Enviar Avaliação
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvaliarChamadoModal;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode"; // importação correta

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login");
        return;
      }

      // salvar token no localStorage
      localStorage.setItem("token", data.token);

      // decodificar token para pegar informações do usuário
      const decoded = jwt_decode(data.token);
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          id: decoded.id,
          email: decoded.email,
          isAdmin: decoded.is_admin, // salva se é admin
        }),
      );

      // redirecionar para página protegida
      navigate("/LandingPage");
    } catch (err) {
      console.error(err);
      setError("Erro de conexão com o servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl flex overflow-hidden max-w-4xl w-full">
        {/* Lado esquerdo - formulário */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">ServiTI</h1>
          </div>

          <p className="text-gray-500 mb-6">Portal de Atendimento</p>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Senha
              </label>
              <input
                type="password"
                placeholder="********"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Entrar
            </button>

            <div className="text-center">
              <Link
                to="/cadastro"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Cadastrar-se
              </Link>
            </div>
          </form>
        </div>

        {/* Lado direito - imagem */}
        <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center p-8">
          <div className="text-center">
            <img
              src="https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=600&q=80"
              alt="Suporte de TI"
              className="rounded-lg mb-6 shadow-md"
            />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Sistema de Gestão de Chamados
            </h2>
            <p className="text-gray-500 text-sm">
              Acompanhe e gerencie todos os seus chamados de TI em um só lugar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

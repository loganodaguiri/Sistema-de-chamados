import React, { useEffect, useState } from "react";
import { Tool, User, Mail, Lock } from "feather-icons-react";
import AOS from "aos";
import "aos/dist/aos.css";
import "tailwindcss/tailwind.css";
import { Link } from "react-router-dom";

export default function Cadastro() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // pegar os valores do formulário
    const formData = {
      nome: e.target.firstName.value,
      sobrenome: e.target.lastName.value,
      email: e.target.email.value,
      senha: e.target.password.value,
      confirmarSenha: e.target.confirmPassword.value,
      is_admin: false, // ou true se quiser permitir admin aqui
    };

    // validação básica no frontend (opcional)
    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao criar a conta");
      } else {
        alert("Conta criada com sucesso!");
        console.log(data.user); // aqui você pode redirecionar ou limpar o formulário
        e.target.reset(); // limpa o formulário
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão com o servidor");
    }
  };

  const [aceitouTermos, setAceitouTermos] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-[Inter,sans-serif]">
      <div
        className="register-container bg-white rounded-xl overflow-hidden w-full max-w-4xl mx-4 shadow-lg"
        data-aos="fade-up"
      >
        <div className="flex flex-col md:flex-row">
          {/* Lado esquerdo - Formulário */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Tool className="w-10 h-10 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-800 ml-2">
                  ServiTI
                </h1>
              </div>
              <p className="text-gray-600">Crie sua conta</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nome
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      placeholder="Nome"
                      className="input-field pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sobrenome
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="Sobrenome"
                    className="input-field block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    className="input-field pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="input-field pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="input-field pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={aceitouTermos}
                  onChange={(e) => setAceitouTermos(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Eu concordo com os{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Termos de Serviço
                  </a>{" "}
                  e{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Política de Privacidade
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!aceitouTermos}
                  className={`w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white transition 
                        ${
                          aceitouTermos
                            ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                  Criar conta
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link
                  to="/"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </div>

          {/* Lado direito - Ilustração */}
          <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-50 to-gray-100 p-10 flex items-center justify-center">
            <div className="text-center">
              <img
                src="http://static.photos/technology/640x360/43"
                alt="Suporte Técnico"
                className="rounded-lg mb-6 mx-auto"
              />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Junte-se à nossa equipe
              </h3>
              <p className="text-gray-600 text-sm">
                Gerencie todos os chamados de TI de forma eficiente e organizada
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

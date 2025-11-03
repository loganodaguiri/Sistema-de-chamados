import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import LandingPage from "./LandingPage";
import Cadastro from "./Cadastro";
import Chamados from "./Chamados";
import NovoChamado from "./NovoChamado";
import Clientes from "./Clientes";
import NovoCliente from "./NovoCliente";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/Chamados" element={<Chamados />} />
        <Route path="/NovoChamado/:id?" element={<NovoChamado />} />
        <Route path="/Clientes" element={<Clientes />} />
        <Route path="/NovoCliente/:id?" element={<NovoCliente />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import {
  List,
  Clock,
  CheckCircle,
  AlertCircle
} from "feather-icons-react";

import AOS from "aos";
import "aos/dist/aos.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

export default function LandingPage() {
  const [statusInfo, setStatusInfo] = useState({
    aberto: 0,
    emProgresso: 0,
    resolvido: 0,
    fechado: 0,
  });

  const [recentes, setRecentes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [porMes, setPorMes] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    const token = localStorage.getItem("token");

    try {
      // -------- STATUS --------
      const statusRes = await fetch("http://localhost:3000/dashboard/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statusData = await statusRes.json();

      const statusObj = statusData.data || {};

      setStatusInfo({
        aberto: Number(statusObj.aberto ?? 0),
        emProgresso: Number(statusObj.emProgresso ?? 0),
        resolvido: Number(statusObj.resolvido ?? 0),
        fechado: Number(statusObj.fechado ?? 0),
      });

      // -------- RECENTES --------
      const recRes = await fetch("http://localhost:3000/dashboard/recentes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const recData = await recRes.json();
      setRecentes(Array.isArray(recData.data) ? recData.data : []);

      // -------- CATEGORIAS --------
      const catRes = await fetch("http://localhost:3000/dashboard/categorias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const catDataRaw = await catRes.json();

      let arrCategorias = [];

      if (Array.isArray(catDataRaw)) {
        arrCategorias = catDataRaw;
      }
      else if (catDataRaw && Array.isArray(catDataRaw.data)) {
        arrCategorias = catDataRaw.data;
      }
      else if (catDataRaw && catDataRaw.data && typeof catDataRaw.data === "object") {
        arrCategorias = Object.entries(catDataRaw.data).map(([categoria, total]) => ({
          categoria,
          total
        }));
      }
      else if (catDataRaw && typeof catDataRaw === "object" && catDataRaw.categoria && catDataRaw.total !== undefined) {
        arrCategorias = [{ categoria: catDataRaw.categoria, total: catDataRaw.total }];
      }

      setCategorias(arrCategorias);

      // -------- POR MÊS --------
      const mesRes = await fetch("http://localhost:3000/dashboard/por-mes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mesData = await mesRes.json();

      if (mesData.success) {
        const ordemMeses = [
          "01","02","03","04","05","06",
          "07","08","09","10","11","12"
        ];

        const nomesMeses = [
          "Jan","Fev","Mar","Abr","Mai","Jun",
          "Jul","Ago","Set","Out","Nov","Dez"
        ];

        const arr = ordemMeses.map((mes, index) => ({
          mes: nomesMeses[index],
          total: mesData.data[mes] ?? 0
        }));

        setPorMes(arr);
      }

    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-[Inter,sans-serif]">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        </header>

        <main className="p-6">

          {/* -------- CARDS -------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card title="Abertos" value={statusInfo.aberto} color="blue" Icon={List} />
            <Card title="Em Progresso" value={statusInfo.emProgresso} color="yellow" Icon={Clock} />
            <Card title="Resolvidos" value={statusInfo.resolvido} color="green" Icon={CheckCircle} />
            <Card title="Fechados" value={statusInfo.fechado} color="red" Icon={AlertCircle} />
          </div>

          {/* -------- RECENTES -------- */}
          <TicketsTable chamados={recentes} />

          {/* -------- GRÁFICOS — LADO A LADO -------- */}
          <ChartsSection dados={porMes} categorias={categorias} />

        </main>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// CARD
// -------------------------------------------------------------
const Card = ({ title, value = 0, color, Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow hover:-translate-y-1 transition-transform flex items-center justify-between" data-aos="fade-up">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
      <Icon />
    </div>
  </div>
);

// -------------------------------------------------------------
// TABELA DE CHAMADOS RECENTES
// -------------------------------------------------------------
const TicketsTable = ({ chamados }) => {

  const statusMap = {
    aberto: { label: "Aberto", color: "bg-blue-100 text-blue-800" },
    em_progresso: { label: "Em Progresso", color: "bg-yellow-100 text-yellow-800" },
    resolvido: { label: "Resolvido", color: "bg-green-100 text-green-800" },
    fechado: { label: "Fechado", color: "bg-red-100 text-red-800" },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8" data-aos="fade-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Chamados Recentes</h3>
        <a href="/chamados" className="text-sm text-blue-600 hover:text-blue-500">Ver todos</a>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["ID", "Título", "Categoria", "Status", "Atualizado"].map((th) => (
                <th key={th} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {chamados.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Nenhum chamado encontrado.
                </td>
              </tr>
            ) : (
              chamados.map((c) => {
                const status = (c.status || "").toLowerCase();
                const info = statusMap[status] || { label: c.status, color: "bg-gray-100 text-gray-700" };

                return (
                  <tr key={c.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.id}</td>
                    <td className="px-6 py-4 text-sm">{c.titulo}</td>
                    <td className="px-6 py-4 text-sm">{c.categoria}</td>

                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${info.color}`}>
                        {info.label}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(c.data_atualizacao).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// GRÁFICOS (ONDAS + CATEGORIAS) LADO A LADO
// -------------------------------------------------------------
const ChartsSection = ({ dados, categorias }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

    {/* GRÁFICO DE ONDAS */}
    <div className="bg-white rounded-lg shadow-sm p-6" data-aos="fade-up">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Chamados por Mês</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={dados}>
            <defs>
              <linearGradient id="onda" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="90%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis allowDecimals={false} />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              fill="url(#onda)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* GRÁFICO DE CATEGORIAS */}
    <div className="bg-white rounded-lg shadow-sm p-6" data-aos="fade-up">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Categorias Mais Recorrentes</h3>

      {categorias.length === 0 ? (
        <p className="text-gray-500">Nenhuma categoria encontrada.</p>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={categorias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>

  </div>
);

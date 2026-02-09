import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";


type Candidato = {
  id: number;
  nome: string;
  funcao: string;
  foto: string | null;
  num_votacao: number;
};

type Apuracao = {
  ID: number;
  NOME: string;
  TOTAL_VOTOS: number;
};


function Admin() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [nome, setNome] = useState("");
  const [funcao, setFuncao] = useState("");
  const [numero, setNumero] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [apuracao, setApuracao] = useState<Apuracao[]>([]);
  const [urnaLiberada, setUrnaLiberada] = useState<boolean>(true);
  const [mostrarResultados, setMostrarResultados] = useState(false);




  useEffect(() => {
    carregarCandidatos();
    carregarApuracao();
    verificarStatus();

  const intervalo = setInterval(() => {
    carregarApuracao();
    verificarStatus();
  }, 5000); // atualiza a cada 5 segundos

  return () => clearInterval(intervalo);
}, []);


  const carregarCandidatos = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "https://urna-backend.onrender.com/candidatos/admin",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const ordenados = [...response.data].sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
    );

    setCandidatos(ordenados);

  } catch (error) {
    console.error("Erro ao carregar candidatos", error);
  }
};


  const cadastrar = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("funcao", funcao);
      formData.append("num_votacao", numero);

      if (foto) {
        formData.append("foto", foto);
      }

      await axios.post("https://urna-backend.onrender.com/candidatos", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Candidato cadastrado com sucesso");

      setNome("");
      setFuncao("");
      setNumero("");
      setFoto(null);

      carregarCandidatos();
    } catch (error) {
      alert("Erro ao cadastrar candidato");
    }
  };

  const carregarApuracao = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "https://urna-backend.onrender.com/votar/apuracao",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const dados = Array.isArray(response.data) ? response.data : [];

    const ordenado = dados.sort((a, b) =>
      (a?.nome || "").localeCompare(b?.nome || "", "pt-BR", {
        sensitivity: "base",
      })
    );

    setApuracao(ordenado);

  } catch (error) {
    console.error("Erro ao carregar apuração", error);
  }
};



    const verificarStatus = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "https://urna-backend.onrender.com/votar/status",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUrnaLiberada(response.data.liberada);
  } catch (error) {
    console.error("Erro ao verificar status", error);
  }
};


  const liberarUrna = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      "https://urna-backend.onrender.com/votar/liberar",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    verificarStatus(); // 🔥 atualiza botão
  };




  return (
    <div style={{ padding: 40, margin: "0 auto", textAlign:"center" }}>
      <h1 style={{ marginBottom: 30 }}>Área Administrativa</h1>

      {/* FORMULÁRIO */}
      <div
        style={{
          background: "#f4f6f8",
          padding: 20,
          borderRadius: 10,
          marginBottom: 40,
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Cadastrar Candidato</h2>

        <div style={{ display: "flex", gap: 15 }}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ padding: 8, flex: 1 }}
          />

          <input
            type="text"
            placeholder="Função"
            value={funcao}
            onChange={(e) => setFuncao(e.target.value)}
            style={{ padding: 8, flex: 1 }}
          />

          <input
            type="number"
            placeholder="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            style={{ padding: 8, width: 120 }}
          />

          <input
            type="file"
            onChange={(e) =>
              setFoto(e.target.files ? e.target.files[0] : null)
            }
          />

          <button
            onClick={cadastrar}
            style={{
              padding: "8px 20px",
              background: "#009fe3",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Cadastrar
          </button>
        </div>
      </div>
      <button
        onClick={liberarUrna}
        disabled={urnaLiberada}
        style={{
          padding: "10px 20px",
          background: urnaLiberada ? "#999" : "green",
          color: "#fff",
          border: "none",
          borderRadius: 5,
          marginTop: 20,
          cursor: urnaLiberada ? "not-allowed" : "pointer",
        }}
      >
        {urnaLiberada ? "Aguardando voto..." : "Liberar Próximo Eleitor"}
      </button>



      {/* LISTA */}
      <div>
        <h2 style={{ marginBottom: 20 }}>Candidatos Cadastrados</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
          }}
        >
          <thead>
            <tr style={{ background: "#009fe3", color: "#fff" }}>
              <th style={{ padding: 10 }}>Foto</th>
              <th style={{ padding: 10 }}>Nome</th>
              <th style={{ padding: 10 }}>Função</th>
              <th style={{ padding: 10 }}>Número</th>
            </tr>
          </thead>

          <tbody>
            {candidatos.map((c) => (
              <tr key={c.id} style={{ textAlign: "center" }}>
                <td style={{ padding: 10 }}>
                  {c.foto ? (
                    <img
                      src={
                        c.foto
                          ? c.foto
                          : "https://via.placeholder.com/250x250?text=Sem+Foto"
                      }
                      style={{
  width: 100,
  height: 120,
  objectFit: "cover",
  borderRadius: 4
}}

                    />

                  ) : (
                    "Sem foto"
                  )}
                </td>

                <td style={{ padding: 10 }}>{c.nome}</td>
                <td style={{ padding: 10 }}>{c.funcao}</td>
                <td style={{ padding: 10 }}>{c.num_votacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
      onClick={() => setMostrarResultados(!mostrarResultados)}
      style={{
        padding: "10px 20px",
        background: "#009fe3",
        color: "#fff",
        border: "none",
        borderRadius: 5,
        marginTop: 40,
        cursor: "pointer",
      }}
    >
      {mostrarResultados ? "Ocultar Resultados" : "Exibir Resultados"}
    </button>

      {mostrarResultados && (
        <div style={{ marginTop: 60 }}>
          <h2 style={{ marginBottom: 20 }}>Apuração dos Votos</h2>

          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <ResponsiveContainer width="100%" height={400}>
            <BarChart data={apuracao}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
              dataKey="nome"
              interval={0}
              angle={-30}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />


              <YAxis />

              <Tooltip />

              <Bar
                dataKey="total_votos"
                fill="#009fe3"
              />
            </BarChart>
          </ResponsiveContainer>

          </div>
        </div>
      )}


    </div>
    
  );
}

export default Admin;

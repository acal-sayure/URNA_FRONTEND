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
  ID: number;
  NOME: string;
  FUNCAO: string;
  NUM_VOTACAO: number;
  FOTO: string | null;
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


  useEffect(() => {
  carregarCandidatos();
  carregarApuracao();

  const intervalo = setInterval(() => {
    carregarApuracao();
  }, 5000); // atualiza a cada 5 segundos

  return () => clearInterval(intervalo);
}, []);


  const carregarCandidatos = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3001/candidatos/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCandidatos(response.data);
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
      formData.append("numero_votacao", numero);

      if (foto) {
        formData.append("foto", foto);
      }

      await axios.post("http://localhost:3001/candidatos", formData, {
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
        "http://localhost:3001/votos/apuracao",
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        setApuracao(response.data);
    } catch (error) {
        console.error("Erro ao carregar apuração", error);
    }
    };


  return (
    <div style={{ padding: 40, maxWidth: 1100, margin: "0 auto" }}>
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
              background: "#1976d2",
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
            <tr style={{ background: "#1976d2", color: "#fff" }}>
              <th style={{ padding: 10 }}>Foto</th>
              <th style={{ padding: 10 }}>Nome</th>
              <th style={{ padding: 10 }}>Função</th>
              <th style={{ padding: 10 }}>Número</th>
            </tr>
          </thead>

          <tbody>
            {candidatos.map((c) => (
              <tr key={c.ID} style={{ textAlign: "center" }}>
                <td style={{ padding: 10 }}>
                  {c.FOTO ? (
                    <img
                      src={`http://localhost:3001/uploads/${c.FOTO}`}
                      alt={c.NOME}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  ) : (
                    "Sem foto"
                  )}
                </td>

                <td style={{ padding: 10 }}>{c.NOME}</td>
                <td style={{ padding: 10 }}>{c.FUNCAO}</td>
                <td style={{ padding: 10 }}>{c.NUM_VOTACAO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
        <XAxis dataKey="NOME" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="TOTAL_VOTOS" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

    </div>
    
  );
}

export default Admin;

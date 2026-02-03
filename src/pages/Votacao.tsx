import { useEffect, useState, useRef } from "react";
import axios from "axios";

type Candidato = {
  ID: number;
  NOME: string;
  FUNCAO: string;
  FOTO: string;
};

function App() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [selecionado, setSelecionado] = useState<Candidato | null>(null);
  const [votoConfirmado, setVotoConfirmado] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    carregarCandidatos();
    audioRef.current = new Audio("/confirma-urna.mp3");
  }, []);

  const carregarCandidatos = async () => {
    try {
      const response = await axios.get(
        "https://urna-backend.onrender.com/candidatos/public"
      );
      setCandidatos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const tocarSom = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const votar = async () => {
    if (!selecionado) return;

    try {
      await axios.post("https://urna-backend.onrender.com/votar", {
        id_candidato: selecionado.ID,
      });

      tocarSom();
      setSelecionado(null);
      setVotoConfirmado(true);

      setTimeout(() => {
        setVotoConfirmado(false);
      }, 2000);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ background: "#f4f4f4", minHeight: "100vh" }}>

      {/* HEADER */}
      <header
        style={{
          backgroundColor: "#009fe3",
          padding: "20px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <img
          src="https://lojaacal.vtexassets.com/assets/vtex/assets-builder/lojaacal.store-theme/1.0.48/LogoAcal___186aa3f3508cf05c699d5d064ed225da.png"
          alt="Acal"
          style={{ height: 60, marginBottom: 10 }}
        />
        <h1 style={{ margin: 0, fontSize: 28 }}>
          Eleição SIPA 2026 - Acal
        </h1>
      </header>

      {/* LISTA */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 25,
          padding: 30,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {candidatos.map((c) => (
          <div
            key={c.ID}
            onClick={() => setSelecionado(c)}
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
              padding: 20,
              cursor: "pointer",
            }}
          >
            <img
              src={
                c.FOTO
                  ? `https://urna-backend.onrender.com/uploads/${c.FOTO}`
                  : "https://via.placeholder.com/250x250?text=Sem+Foto"
              }
              alt={c.NOME}
              style={{
                width: "100%",
                height: 250,
                objectFit: "cover",
                borderRadius: 10,
                marginBottom: 15,
              }}
            />
            <h2>{c.NOME}</h2>
            <p>{c.FUNCAO}</p>
          </div>
        ))}
      </div>

      {/* MODAL CONFIRMAÇÃO */}
      {selecionado && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 40,
              borderRadius: 15,
              textAlign: "center",
              width: 400,
            }}
          >
            <h2>Confirmar voto?</h2>
            <h3 style={{ color: "#009fe3" }}>
              {selecionado.NOME}
            </h3>

            <div style={{ marginTop: 30 }}>
              <button
                onClick={votar}
                style={{
                  backgroundColor: "#009fe3",
                  color: "#fff",
                  border: "none",
                  padding: "12px 25px",
                  marginRight: 15,
                  borderRadius: 8,
                }}
              >
                Confirmar
              </button>

              <button
                onClick={() => setSelecionado(null)}
                style={{
                  backgroundColor: "#ccc",
                  border: "none",
                  padding: "12px 25px",
                  borderRadius: 8,
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VOTO CONFIRMADO */}
      {votoConfirmado && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 50,
              borderRadius: 20,
              textAlign: "center",
              width: 450,
            }}
          >
            <h1 style={{ color: "#009fe3" }}>
              ✅ VOTO CONFIRMADO
            </h1>
            <p>Seu voto foi registrado com sucesso.</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

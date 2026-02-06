import { useEffect, useState, useRef } from "react";
import axios from "axios";

type Candidato = {
  id: number;
  nome: string;
  funcao: string;
  foto: string | null;
  num_votacao: number;
};

function App() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [selecionado, setSelecionado] = useState<Candidato | null>(null);
  const [votoConfirmado, setVotoConfirmado] = useState(false);
  const [urnaLiberada, setUrnaLiberada] = useState(true);


  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    carregarCandidatos();
    verificarStatus();
    audioRef.current = new Audio("/confirma-urna.mp3");

    // verifica status a cada 2 segundos
    const intervalo = setInterval(() => {
      verificarStatus();
    }, 2000);

    return () => clearInterval(intervalo);
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

  if (!urnaLiberada) {
    alert("Urna bloqueada. Aguarde o mesário.");
    return;
  }

  try {
    await axios.post("https://urna-backend.onrender.com/votar", {
      id_candidato: selecionado.id,
    });

    tocarSom();
    setSelecionado(null);
    setVotoConfirmado(true);

    verificarStatus(); // 🔒 atualiza estado após votar

    setTimeout(() => {
      setVotoConfirmado(false);
    }, 2000);

  } catch (error) {
    console.error(error);
  }
};


  const verificarStatus = async () => {
  const response = await axios.get(
    "https://urna-backend.onrender.com/votar/status"
  );

  setUrnaLiberada(response.data.liberada);
};



  return (
    <div style={{ background: "#f4f4f4", minHeight: "100vh" }}>

      {/* HEADER */}
      <header
  style={{
    backgroundColor: "#009fe3",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    color: "#fff",
    flexWrap: "wrap", // ajuda em telas menores
  }}
>
  <img
    src="https://lojaacal.vtexassets.com/assets/vtex/assets-builder/lojaacal.store-theme/1.0.48/LogoAcal___186aa3f3508cf05c699d5d064ed225da.png"
    alt="Acal"
    style={{ height: 60 }}
  />

  <h1 style={{ margin: 0, fontSize: 26 }}>
    Eleição SIPA 2026 - Acal
  </h1>
</header>


      {/* LISTA */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20,
          padding: "30px 40px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {candidatos.map((c) => (
          <div
            key={c.id}
            onClick={() => {
  if (!urnaLiberada) return;
  setSelecionado(c);
}}

            style={{
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              padding: 15,
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            
            <img
  src={
    c.foto
      ? c.foto
      : "https://via.placeholder.com/250x250?text=Sem+Foto"
  }
  alt={c.nome}
  style={{
    width: "100%",
    height: 200,              // altura fixa
    objectFit: "contain",     // NÃO corta
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 8,
    padding: 5,
  }}
/>




            <h3 style={{ margin: "5px 0" }}>{c.nome}</h3>
            <p style={{ margin: 0, color: "#555" }}>{c.funcao}</p>
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
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 35,
              borderRadius: 15,
              textAlign: "center",
              width: "100%",
              maxWidth: 400,
            }}
          >
            <h2>Confirmar voto?</h2>

            <img
  src={
    selecionado.foto
      ? selecionado.foto
      : "https://via.placeholder.com/250x250?text=Sem+Foto"
  }
  alt={selecionado.nome}
  style={{
    width: 150,
    height: 150,
    objectFit: "cover",
    borderRadius: 12,
    margin: "15px auto",
    display: "block",
  }}
/>



            <h3 style={{ color: "#009fe3", marginTop: 10 }}>
              {selecionado.nome}
            </h3>

            <p style={{ marginTop: 5 }}>{selecionado.funcao}</p>

            <div style={{ marginTop: 25 }}>
              <button
                onClick={votar}
                style={{
                  backgroundColor: "#009fe3",
                  color: "#fff",
                  border: "none",
                  padding: "10px 22px",
                  marginRight: 10,
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Confirmar
              </button>

              <button
                onClick={() => setSelecionado(null)}
                style={{
                  backgroundColor: "#ccc",
                  border: "none",
                  padding: "10px 22px",
                  borderRadius: 8,
                  cursor: "pointer",
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
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 40,
              borderRadius: 20,
              textAlign: "center",
              width: "100%",
              maxWidth: 400,
            }}
          >
            <h1 style={{ color: "#009fe3" }}>
              ✅ VOTO CONFIRMADO
            </h1>
            <p>Seu voto foi registrado com sucesso.</p>
          </div>
        </div>
      )}

      {!urnaLiberada && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.85)",
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 28,
      zIndex: 9999,
    }}
  >
    🔒 Urna bloqueada
  </div>
)}

    </div>
  );
}

export default App;

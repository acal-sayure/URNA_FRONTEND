import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const fazerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await axios.post("https://urna-backend.onrender.com/auth/login", {
        usuario,
        senha,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/admin");
    } catch (error) {
      setErro("Usuário ou senha inválidos");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f9",
      }}
    >
      <div
        style={{
          width: 400,
          padding: 40,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 30 }}>
          Área Administrativa
        </h2>

        <form onSubmit={fazerLogin}>
          <div style={{ marginBottom: 20 }}>
            <label>Usuário</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 10,
                marginTop: 5,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 10,
                marginTop: 5,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
          </div>

          {erro && (
            <div
              style={{
                background: "#ffebee",
                color: "#c62828",
                padding: 10,
                borderRadius: 6,
                marginBottom: 15,
                textAlign: "center",
              }}
            >
              {erro}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

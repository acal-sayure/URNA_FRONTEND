import { BrowserRouter, Routes, Route } from "react-router-dom";
import Votacao from "./pages/Votacao";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./services/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Votacao />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

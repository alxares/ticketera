import React, { useEffect, useState } from "react";
import AppRoutes from "./routes/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";
import "./styles/dark-mode.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Leer preferencia al montar
  useEffect(() => {
    const stored = localStorage.getItem("darkMode") === "true";
    setDarkMode(stored);
  }, []);

  // Aplicar/remover clase y guardar preferencia
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Botón de alternancia modo oscuro */}
      <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 9999 }}>
        <button
          className={`btn btn-outline-secondary btn-sm px-3 py-2 shadow-sm`}
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? "🌞 Claro" : "🌙 Oscuro"}
        </button>
      </div>
    </>
  );
}

export default App;

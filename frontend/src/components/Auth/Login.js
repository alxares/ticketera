import React, { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(form);
      const user = response?.user;

      if (!user) {
        toast.error("Respuesta inválida del servidor");
        return;
      }

      // Guardar usuario en localStorage
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Inicio de sesión exitoso");

      // Redirigir según rol
      const role = user.role?.toLowerCase();
      if (["admin", "manager", "user"].includes(role)) {
        navigate(`/${role}`);
      } else {
        navigate("/user");
      }

    } catch (error) {
      const msg = error?.response?.data?.message || "Error al iniciar sesión";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h2 className="mb-4 text-center">TicketFlow — Inicio de sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Usuario o Email</label>
          <input
            type="text"
            className="form-control"
            name="usernameOrEmail"
            value={form.usernameOrEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>

        <p className="mt-3 text-center">
          ¿No tenés una cuenta? <Link to="/register">Registrate</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

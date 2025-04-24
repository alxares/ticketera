import React, { useState, useEffect } from "react";
import { register } from "../../services/authService";
import { getPublicDepartments } from "../../services/departmentService";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    departmentId: "",
    role: "USER", // Por defecto
  });

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  // 🟢 Cargar departamentos (excepto IT)
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getPublicDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("❌ Error al obtener departamentos:", error);
        toast.error("No se pudieron cargar los departamentos");
      }
    };
  
    fetchDepartments();
  }, []);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user } = await register(form);
      toast.success("Registro exitoso");

      const role = user.role?.toLowerCase();
      navigate(["admin", "manager", "user"].includes(role) ? `/${role}` : "/user");
    } catch (error) {
      const msg = error.response?.data?.message || "Error al registrarse";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4 text-center">TicketFlow — Registro</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre completo</label>
          <input
            type="text"
            className="form-control"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Nombre de usuario</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Departamento</label>
          <select
            className="form-select"
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccioná un departamento</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
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

        <button className="btn btn-success w-100" type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <p className="mt-3 text-center">
          ¿Ya tenés una cuenta? <Link to="/">Iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

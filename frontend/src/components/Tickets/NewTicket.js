import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { showSuccess, showError } from "../../utils/toast";
import { createTicket } from "../../services/ticketService";
import { getPublicDepartments } from "../../services/departmentService";
import { getAllUsers } from "../../services/userService";

const NewTicket = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    departmentId: "",
    assigneeId: "",
    attachments: [],
  });

  const [loading, setLoading] = useState(false);

  // 🔄 Cargar departamentos y usuarios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptData, userData] = await Promise.all([
          getPublicDepartments(),
          getAllUsers(),
        ]);
        setDepartments(deptData);
        setUsers(userData);
      } catch (err) {
        showError("Error al cargar datos iniciales");
      }
    };
    fetchData();
  }, []);

  // ✍️ Manejar campos de texto y select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket((prev) => ({ ...prev, [name]: value }));
  };

  // 📎 Manejar archivos adjuntos
  const handleFileChange = (e) => {
    setTicket((prev) => ({ ...prev, attachments: e.target.files }));
  };

  // ✅ Enviar ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticket.title || !ticket.description || !ticket.departmentId) {
      showError("Todos los campos obligatorios deben completarse.");
      return;
    }

    const payload = {
      ...ticket,
      creatorId: user.id,
      files: Array.from(ticket.attachments), // 🔑 se usa en ticketService
    };

    setLoading(true);
    try {
      await createTicket(payload);
      showSuccess("Ticket enviado correctamente");

      // Reset
      setTicket({
        title: "",
        description: "",
        priority: "MEDIUM",
        departmentId: "",
        assigneeId: "",
        attachments: [],
      });
    } catch (err) {
      console.error("❌ Error al crear ticket:", err.response?.data || err.message);
      showError(err.response?.data?.message || "No se pudo crear el ticket");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filtrar usuarios del departamento seleccionado
  const filteredUsers = users.filter(
    (u) => u.departmentId === ticket.departmentId
  );

  return (
    <Layout user={user}>
      <div className="d-flex justify-content-between align-items-start">
        <div className="col-lg-8">
          <h2 className="mb-4">Create New Ticket</h2>
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* 📝 Asunto */}
                <div className="mb-3">
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={ticket.title}
                    onChange={handleChange}
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>

                {/* 🧭 Departamento y Asignar a */}
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label">Department *</label>
                    <select
                      name="departmentId"
                      className="form-select"
                      value={ticket.departmentId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col">
                    <label className="form-label">Assign To (Optional)</label>
                    <select
                      name="assigneeId"
                      className="form-select"
                      value={ticket.assigneeId}
                      onChange={handleChange}
                      disabled={!ticket.departmentId}
                    >
                      <option value="">Assign Automatically</option>
                      {filteredUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 🚦 Prioridad */}
                <div className="mb-3">
                  <label className="form-label">Priority *</label>
                  <div className="d-flex gap-3">
                    {["LOW", "MEDIUM", "HIGH", "URGENT"].map((level) => (
                      <div key={level} className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="priority"
                          value={level}
                          checked={ticket.priority === level}
                          onChange={handleChange}
                        />
                        <label className="form-check-label">
                          {level.charAt(0) + level.slice(1).toLowerCase()}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 📝 Descripción */}
                <div className="mb-3">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    rows="4"
                    className="form-control"
                    value={ticket.description}
                    onChange={handleChange}
                    placeholder="Please provide detailed information about your issue"
                    required
                  />
                </div>

                {/* 📎 Adjuntos */}
                <div className="mb-3">
                  <label className="form-label">Attachments</label>
                  <input
                    type="file"
                    multiple
                    className="form-control"
                    onChange={handleFileChange}
                  />
                  <small className="text-muted">
                    You can attach up to 5 files (max 10MB each)
                  </small>
                </div>

                {/* Botones */}
                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-secondary" type="reset">
                    Cancel
                  </button>
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Ticket"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Guía lateral */}
        <div className="col-lg-4 ps-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Priority Guidelines</h5>
              <ul className="small">
                <li><span className="text-danger">Urgent</span>: Critical issue that severely impacts your work.</li>
                <li><span className="text-warning">High</span>: Serious issue that impacts usability.</li>
                <li><span className="text-primary">Medium</span>: Some features are affected.</li>
                <li><span className="text-success">Low</span>: Inconvenient but not disruptive.</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Tips for Quick Resolution</h5>
              <ul className="small">
                <li>Be specific about the issue you're experiencing</li>
                <li>Include any error messages</li>
                <li>Mention what steps you've already taken</li>
                <li>Add screenshots if possible</li>
                <li>Provide environment context</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewTicket;

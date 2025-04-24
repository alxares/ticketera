import React, { useState, useEffect } from "react";
import Sidebar from "../Common/Sidebar";
import Topbar from "../Common/Topbar";
import Modal from "../Common/Modal";
import {
  getAllDepartments,
  createDepartment,
  deleteDepartment,
} from "../../services/departmentService";
import { toast } from "react-toastify";

const DepartmentManagement = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Admin",
    role: "ADMIN",
  };

  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 🟢 Cargar departamentos reales al montar
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await getAllDepartments();
      setDepartments(data);
    } catch (error) {
      toast.error("Error al cargar departamentos");
      console.error("❌", error);
    }
  };

  // ➕ Crear nuevo departamento
  const handleAdd = async () => {
    if (!newDept.trim()) return;

    try {
      await createDepartment({ name: newDept.trim() });
      toast.success("Departamento creado");
      setNewDept("");
      setShowModal(false);
      fetchDepartments(); // Refrescar lista
    } catch (error) {
      toast.error("No se pudo crear el departamento");
      console.error("❌", error);
    }
  };

  // ❌ Eliminar departamento
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este departamento?")) return;

    try {
      await deleteDepartment(id);
      toast.success("Departamento eliminado");
      fetchDepartments(); // Refrescar lista
    } catch (error) {
      toast.error("Error al eliminar departamento");
      console.error("❌", error);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar role={user.role} />
      <div className="main-content">
        <Topbar user={user} />

        <div className="page-content">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3">Gestión de Departamentos</h1>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <i className="bi bi-building me-2"></i> Nuevo Departamento
              </button>
            </div>

            <div className="card">
              <div className="card-body">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Departamento</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept, index) => (
                      <tr key={dept.id}>
                        <td>{index + 1}</td>
                        <td>{dept.name}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(dept.id)}
                          >
                            <i className="bi bi-trash"></i> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {departments.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          No hay departamentos disponibles.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Modal
              show={showModal}
              title="Agregar Departamento"
              onClose={() => setShowModal(false)}
              onSave={handleAdd}
            >
              <div className="mb-3">
                <label className="form-label">Nombre del Departamento</label>
                <input
                  type="text"
                  className="form-control"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  required
                />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;

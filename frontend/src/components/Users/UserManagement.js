import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import Modal from "../Common/Modal";
import { getAllUsers } from "../../services/userService";
import { getAllDepartments } from "../../services/departmentService";

const UserManagement = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Admin",
    role: "ADMIN",
  };

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    role: "USER",
    departmentId: "",
  });

  // 🔄 Obtener usuarios y departamentos al cargar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getAllUsers();
        const deptsData = await getAllDepartments();
        setUsers(usersData);
        setDepartments(deptsData);
      } catch (error) {
        console.error("❌ Error al cargar usuarios o departamentos", error);
      }
    };

    fetchData();
  }, []);

  // ➕ Agregar usuario (temporalmente simulado)
  const handleAdd = () => {
    if (!newUser.fullName || !newUser.email || !newUser.departmentId) return;

    const dept = departments.find((d) => d.id === newUser.departmentId);

    setUsers([
      ...users,
      {
        ...newUser,
        id: users.length + 1,
        department: dept,
      },
    ]);

    setNewUser({
      fullName: "",
      email: "",
      role: "USER",
      departmentId: "",
    });

    setShowModal(false);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout user={user}>
      <h1 className="h3 mb-4">User Management</h1>

      {/* Botón para agregar usuario */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-person-plus me-2"></i> Add User
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className="card">
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.department?.name || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(u.id)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para nuevo usuario */}
      <Modal
        show={showModal}
        title="Add New User"
        onClose={() => setShowModal(false)}
        onSave={handleAdd}
      >
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            name="fullName"
            value={newUser.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={newUser.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            name="role"
            value={newUser.role}
            onChange={handleChange}
          >
            <option value="USER">User</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Department</label>
          <select
            className="form-select"
            name="departmentId"
            value={newUser.departmentId}
            onChange={handleChange}
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </Modal>
    </Layout>
  );
};

export default UserManagement;

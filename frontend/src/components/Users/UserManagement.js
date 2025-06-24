// src/components/Users/UserManagement.js
import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import Modal from "../Common/Modal";
import { getAllUsers, createUser, deleteUser } from "../../services/userService";
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
    password: "",
    confirmPassword: "",
  });

  // Carga inicial de usuarios y departamentos
  useEffect(() => {
    (async () => {
      try {
        const [usersData, deptsData] = await Promise.all([
          getAllUsers(),
          getAllDepartments(),
        ]);
        setUsers(usersData);
        setDepartments(deptsData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    })();
  }, []);

  // Crear nuevo usuario con contraseña
  const handleAdd = async () => {
    if (!newUser.fullName || !newUser.email || !newUser.departmentId || !newUser.password) {
      return alert("Todos los campos, incluida la contraseña, son obligatorios.");
    }
    if (newUser.password !== newUser.confirmPassword) {
      return alert("Las contraseñas no coinciden.");
    }
    try {
      await createUser({
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        departmentId: newUser.departmentId,
        password: newUser.password,
      });
      // refrescar lista
      const updated = await getAllUsers();
      setUsers(updated);
      // reset form
      setNewUser({ fullName: "", email: "", role: "USER", departmentId: "", password: "", confirmPassword: "" });
      setShowModal(false);
    } catch (err) {
      console.error("Error creando usuario:", err);
      alert(err.response?.data?.message || "Error al crear usuario");
    }
  };

  // Manejar cambios de input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout user={user}>
      <h1 className="h3 mb-4">User Management</h1>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-person-plus me-2"></i> Add User
        </button>
      </div>

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
                      onClick={() => deleteUser(u.id).then(() => setUsers(users.filter(user => user.id !== u.id)))}
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
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={newUser.password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={newUser.confirmPassword}
            onChange={handleChange}
          />
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

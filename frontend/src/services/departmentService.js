import axiosAuth from "./axiosAuth";
import axios from "axios"; // Para endpoints públicos sin autenticación

// Base pública para endpoints sin token (usado en registro)
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

/**
 * 🔓 Obtener departamentos públicos (sin token, excluye IT)
 * Usado en el formulario de registro
 */
export const getPublicDepartments = async () => {
  try {
    const res = await axios.get(`${API_BASE}/departments/public`);
    return res.data;
  } catch (error) {
    console.error("❌ Error al obtener departamentos públicos:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔐 Obtener todos los departamentos (requiere token de ADMIN)
 */
export const getAllDepartments = async () => {
  try {
    const res = await axiosAuth.get("/departments");
    return res.data;
  } catch (error) {
    console.error("❌ Error al obtener departamentos:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * ➕ Crear nuevo departamento (ADMIN)
 */
export const createDepartment = async (data) => {
  try {
    const res = await axiosAuth.post("/departments", data);
    return res.data;
  } catch (error) {
    console.error("❌ Error al crear departamento:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * ✏️ Editar un departamento (ADMIN)
 */
export const updateDepartment = async (id, data) => {
  try {
    const res = await axiosAuth.put(`/departments/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("❌ Error al actualizar departamento:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🗑️ Eliminar un departamento (ADMIN)
 */
export const deleteDepartment = async (id) => {
  try {
    const res = await axiosAuth.delete(`/departments/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error al eliminar departamento:", error.response?.data || error.message);
    throw error;
  }
};

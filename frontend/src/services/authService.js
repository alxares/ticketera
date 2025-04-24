import { showError, showSuccess } from "../utils/toast";

// Guardar usuario y token en localStorage
const saveUser = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

// Eliminar usuario y token del localStorage
const removeUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// Obtener usuario actual
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

// Obtener token actual
export const getToken = () => {
  return localStorage.getItem("token");
};

// Iniciar sesión
export const login = async (credentials) => {
  try {
    const response = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      showError(errorData.message || "Error al iniciar sesión");
      throw new Error(errorData.message || "Error al iniciar sesión");
    }

    const data = await response.json();

    saveUser(data.user, data.token);
    showSuccess("Inicio de sesión exitoso");

    return data;
  } catch (error) {
    showError("Ocurrió un problema al iniciar sesión");
    console.error("❌ Error en login:", error.message);
    throw error;
  }
};

// Registrar usuario
export const register = async (userData) => {
  try {
    const response = await fetch("http://localhost:4000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      showError(errorData.message || "Error al registrarse");
      throw new Error(errorData.message || "Error al registrarse");
    }

    const data = await response.json();
    showSuccess("Registro exitoso");

    return data;
  } catch (error) {
    showError("Ocurrió un problema al registrarte");
    console.error("❌ Error en register:", error.message);
    throw error;
  }
};

// Cerrar sesión
export const logout = () => {
  removeUser();
  showSuccess("Sesión cerrada");
};

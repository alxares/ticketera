import axiosAuth from "./axiosAuth";

// ✅ Obtener todos los usuarios (solo admin)
export const getAllUsers = async () => {
  const res = await axiosAuth.get("/users");
  return res.data;
};

// ➕ Crear nuevo usuario
export const createUser = async (data) => {
  const res = await axiosAuth.post("/auth/register", data);
  return res.data;
};

// ✏️ Actualizar usuario
export const updateUser = async (id, data) => {
  const res = await axiosAuth.put(`/users/${id}`, data);
  return res.data;
};

// ❌ Eliminar usuario
export const deleteUser = async (id) => {
  const res = await axiosAuth.delete(`/users/${id}`);
  return res.data;
};

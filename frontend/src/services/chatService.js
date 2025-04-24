import axiosAuth from "./axiosAuth";

// Enviar mensaje
export const sendMessage = async (data) => {
  const res = await axiosAuth.post("/chat/send", data);
  return res.data;
};

// Obtener historial de mensajes entre dos usuarios
export const getMessages = async (user1, user2) => {
  const res = await axiosAuth.get(`/chat/${user1}/${user2}`);
  return res.data;
};

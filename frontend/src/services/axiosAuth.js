import axios from "axios";

// Leer URL base del backend desde .env o usar localhost por defecto
const API = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

// Obtener token directamente del localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Crear instancia de Axios
const axiosAuth = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a cada request
axiosAuth.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosAuth;

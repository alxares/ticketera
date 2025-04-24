// src/components/Common/Notification.js
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export const showNotification = (message, type = "info") => {
  const colors = {
    success: "#2ecc71",
    error: "#e74c3c",
    warning: "#f39c12",
    info: "#3498db",
  };

  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: colors[type] || "#3498db",
    close: true,
  }).showToast();
};

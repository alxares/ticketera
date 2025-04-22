import app from "./app.js";
import { initWebSocket } from "./config/websocket.js";
import http from "http";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

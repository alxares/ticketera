import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";
import { getMessages, sendMessage } from "../../services/chatService";
import { io } from "socket.io-client";

const ChatPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const receiver = state?.receiver;

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const user = getCurrentUser();
  const messagesEndRef = useRef();

  // Redirigir si no hay receiver
  useEffect(() => {
    if (!receiver) {
      navigate("/chat/select");
    }
  }, [receiver]);

  // Inicializar socket y escuchar mensajes en tiempo real
  useEffect(() => {
    if (!receiver) return;

    const s = io(process.env.REACT_APP_SOCKET_URL);
    setSocket(s);

    s.emit("joinTickets", user.id);

    s.on("newMessage", (msg) => {
      if (msg.senderId === receiver.id || msg.receiverId === receiver.id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => s.disconnect();
  }, [user.id, receiver?.id]);

  // Cargar historial
  useEffect(() => {
    if (!receiver) return;

    const fetch = async () => {
      const msgs = await getMessages(user.id, receiver.id);
      setMessages(msgs);
    };
    fetch();
  }, [receiver?.id]);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim()) return;

    const msgData = {
      senderId: user.id,
      receiverId: receiver.id,
      content,
    };

    const { data } = await sendMessage(msgData);
    setMessages((prev) => [...prev, data]);
    setContent("");

    socket.emit("newMessage", data);
  };

  if (!receiver) return null;

  return (
    <div className="container mt-4">
      <h4>Chat con {receiver.fullName}</h4>

      <div className="border rounded p-3 mb-3" style={{ height: "400px", overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 d-flex ${
              msg.senderId === user.id ? "justify-content-end" : "justify-content-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-pill ${
                msg.senderId === user.id ? "bg-primary text-white" : "bg-light"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Escribí un mensaje..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatPage;

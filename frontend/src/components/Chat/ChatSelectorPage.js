import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/userService";
import { getCurrentUser } from "../../services/authService";

const ChatSelectorPage = () => {
  const [users, setUsers] = useState([]);
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const data = await getAllUsers();
      // Filtrar al usuario actual
      const filtered = data.filter((u) => u.id !== currentUser.id);
      setUsers(filtered);
    };
    fetch();
  }, [currentUser.id]);

  const handleChat = (user) => {
    navigate("/chat", { state: { receiver: user } });
  };

  return (
    <div className="container mt-4">
      <h4>Seleccionar usuario para chatear</h4>
      <ul className="list-group mt-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{user.fullName}</span>
            <button className="btn btn-outline-primary btn-sm" onClick={() => handleChat(user)}>
              Chatear
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSelectorPage;

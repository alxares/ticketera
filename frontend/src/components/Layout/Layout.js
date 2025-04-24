import React from "react";
import Sidebar from "../Common/Sidebar";
import Topbar from "../Common/Topbar";


const Layout = ({ children, user }) => {
  const currentUser = user || JSON.parse(localStorage.getItem("user")) || {
    fullName: "Invitado",
    role: "user",
  };

  return (
    <div className="d-flex">
      <Sidebar role={currentUser.role} />
      <div className="main-content">
        <Topbar user={currentUser} />
        <div className="page-content">
          <div className="container-fluid">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

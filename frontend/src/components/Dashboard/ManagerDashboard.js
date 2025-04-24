// src/components/Dashboard/ManagerDashboard.js
import React from "react";
import Layout from "../Layout/Layout";


const ManagerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Manager",
    role: "manager",
  };

  return (
    <Layout user={user}>
      <h1 className="h3 mb-4">Manager Dashboard</h1>
      <p className="text-muted">Welcome back, {user.fullName}!</p>

      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card stats-card bg-light">
            <div className="stats-icon bg-primary text-white">
              <i className="bi bi-ticket"></i>
            </div>
            <div className="stats-number text-primary">56</div>
            <div className="stats-text">Department Tickets</div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card stats-card bg-light">
            <div className="stats-icon bg-success text-white">
              <i className="bi bi-check-circle"></i>
            </div>
            <div className="stats-number text-success">38</div>
            <div className="stats-text">Resolved</div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card stats-card bg-light">
            <div className="stats-icon bg-warning text-white">
              <i className="bi bi-hourglass-split"></i>
            </div>
            <div className="stats-number text-warning">18</div>
            <div className="stats-text">Pending</div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card stats-card bg-light">
            <div className="stats-icon bg-danger text-white">
              <i className="bi bi-exclamation-octagon"></i>
            </div>
            <div className="stats-number text-danger">5</div>
            <div className="stats-text">Urgent</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;

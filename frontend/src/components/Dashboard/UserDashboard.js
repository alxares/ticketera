// src/components/Dashboard/UserDashboard.js
import React from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "User",
    role: "user",
  };

  return (
    <Layout user={user}>
      <h1 className="h3 mb-4">My Dashboard</h1>
      <p className="text-muted">Welcome back, {user.fullName}!</p>

      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card stats-card bg-light">
            <div className="stats-icon bg-primary text-white">
              <i className="bi bi-ticket"></i>
            </div>
            <div className="stats-number text-primary">12</div>
            <div className="stats-text">My Tickets</div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card stats-card bg-light">
            <div className="stats-icon bg-success text-white">
              <i className="bi bi-check-circle"></i>
            </div>
            <div className="stats-number text-success">8</div>
            <div className="stats-text">Resolved</div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card stats-card bg-light">
            <div className="stats-icon bg-warning text-white">
              <i className="bi bi-hourglass-split"></i>
            </div>
            <div className="stats-number text-warning">4</div>
            <div className="stats-text">Pending</div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card stats-card bg-light d-flex justify-content-center align-items-center">
            <Link to="/new-ticket" className="btn btn-outline-info w-100">
              <i className="bi bi-plus-circle me-2"></i> New Ticket
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;

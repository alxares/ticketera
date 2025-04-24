// src/components/Reports/ReportsPage.js
import React from "react";
import Layout from "../Layout/Layout";

const ReportsPage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Admin",
    role: "admin",
  };

  return (
    <Layout user={user}>
      <h1 className="h3 mb-4">Reports</h1>
      <p className="text-muted">Overview of ticket performance</p>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card report-card border-start border-primary border-5">
            <div className="card-body">
              <h6>Total Tickets</h6>
              <h2>420</h2>
              <p className="text-muted">Created this month</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card report-card border-start border-success border-5">
            <div className="card-body">
              <h6>Resolved</h6>
              <h2>320</h2>
              <p className="text-muted">Closed successfully</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card report-card border-start border-danger border-5">
            <div className="card-body">
              <h6>Urgent</h6>
              <h2>14</h2>
              <p className="text-muted">Still pending</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h5 className="mb-0">Performance Summary</h5>
        </div>
        <div className="card-body">
          <ul>
            <li>Average resolution time: <strong>4.2 hrs</strong></li>
            <li>Departments with most activity: <strong>IT, HR</strong></li>
            <li>Most common issue: <strong>Login problems</strong></li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;

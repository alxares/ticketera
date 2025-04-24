// src/components/Settings/SettingsPage.js
import React, { useState } from "react";
import Layout from "../Layout/Layout";

const SettingsPage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Admin",
    role: "admin",
  };

  const [settings, setSettings] = useState({
    language: "en",
    theme: "light",
    notifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log("Settings saved:", settings);
    alert("Settings saved!");
  };

  return (
    <Layout user={user}>
      <h1 className="h3 mb-4">Settings</h1>
      <p className="text-muted">Update your system preferences</p>

      <div className="card">
        <div className="card-body">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-3">
              <label className="form-label">Language</label>
              <select
                className="form-select"
                name="language"
                value={settings.language}
                onChange={handleChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Theme</label>
              <select
                className="form-select"
                name="theme"
                value={settings.theme}
                onChange={handleChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="notifications">
                Enable email notifications
              </label>
            </div>

            <button className="btn btn-primary" onClick={handleSave}>
              Save Settings
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;

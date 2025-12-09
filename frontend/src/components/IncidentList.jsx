import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    severity: "Low",
    status: "Open",
    reporter: "",
    assignee: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadIncidents = async () => {
    try {
      const data = await apiRequest("/api/incidents");
      setIncidents(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await apiRequest(`/api/incidents/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form)
        });
      } else {
        await apiRequest("/api/incidents", {
          method: "POST",
          body: JSON.stringify(form)
        });
      }
      setForm({
        title: "",
        description: "",
        severity: "Low",
        status: "Open",
        reporter: "",
        assignee: ""
      });
      setEditingId(null);
      loadIncidents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (incident) => {
    setEditingId(incident._id);
    setForm({
      title: incident.title,
      description: incident.description,
      severity: incident.severity,
      status: incident.status,
      reporter: incident.reporter,
      assignee: incident.assignee || ""
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this incident?")) return;
    try {
      await apiRequest(`/api/incidents/${id}`, { method: "DELETE" });
      loadIncidents();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="grid">
      <div className="card">
        <h2>{editingId ? "Edit Incident" : "New Incident"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Severity
            <select
              name="severity"
              value={form.sevidence}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </label>
          <label>
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
          </label>
          <label>
            Reporter
            <input
              name="reporter"
              value={form.reporter}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Assignee
            <input
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit">
            {editingId ? "Update Incident" : "Create Incident"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Incidents</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Reporter</th>
              <th>Assignee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => (
              <tr key={inc._id}>
                <td>{inc.title}</td>
                <td>{inc.severity}</td>
                <td>{inc.status}</td>
                <td>{inc.reporter}</td>
                <td>{inc.assignee}</td>
                <td>
                  <button onClick={() => handleEdit(inc)}>Edit</button>
                  <button onClick={() => handleDelete(inc._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default IncidentList;

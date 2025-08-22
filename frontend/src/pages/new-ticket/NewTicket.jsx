import { useState } from "react";
import client from "../../api/client";
import "./NewTicket.css";
import { useNavigate } from "react-router-dom";

const PRIORITY = [
  { value: "high", label: "Alta" },
  { value: "medium", label: "Media" },
  { value: "low", label: "Baja" }
];


export default function NewTicket() {

  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    reporter_name: "",
    email: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await client.post("/ticket/create", {
        ...form,
        state: "new"
      });
      navigate("/");

    } catch (err) {
      setError(err?.response?.data || "Error creando el ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-ticket">
      <h2 className="new-ticket-title">Crear Ticket</h2>

      <form className="new-ticket-form" onSubmit={handleSubmit}>
        <div className="new-ticket-field">
          <label className="new-ticket-label" htmlFor="title">Título</label>
          <input
            id="title"
            className="new-ticket-input"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="new-ticket-field">
          <label className="new-ticket-label" htmlFor="description">Descripción</label>
          <textarea
            id="description"
            className="new-ticket-textarea"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="new-ticket-field">
          <label className="new-ticket-label" htmlFor="priority">Prioridad</label>
          <select
            id="priority"
            className="new-ticket-select"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            {PRIORITY.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
            ))}
          </select>
        </div>

        <div className="new-ticket-field">
          <label className="new-ticket-label" htmlFor="reporter_name">Reportado por</label>
          <input
            id="reporter_name"
            className="new-ticket-input"
            type="text"
            name="reporter_name"
            value={form.reporter_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="new-ticket-field">
          <label className="new-ticket-label" htmlFor="email">Email</label>
          <input
            id="email"
            className="new-ticket-input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="new-ticket-actions">
          <button className="new-ticket-button" type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Ticket"}
          </button>
        </div>
      </form>

      {error && (
        <p className="new-ticket-status new-ticket-status-error">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </p>
      )}
      {success && (
        <p className="new-ticket-status new-ticket-status-success">{success}</p>
      )}
    </div>
  );
}

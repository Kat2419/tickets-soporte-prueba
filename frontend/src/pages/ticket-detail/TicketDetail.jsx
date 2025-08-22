import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../api/client";
import "./TicketDetail.css";

  const priorityStyle = (p) => {
    const key = (p || "").toUpperCase();
    const map = { LOW: "green", MEDIUM: "orange", HIGH: "crimson" };
    return { color: map[key] || "inherit", fontWeight: "bold", fontSize: "0.9rem" };
  };

 
  const PriorityBadge = ({ priority }) => (
    <span style={priorityStyle(priority)}>
      {priorityLabels[priority].toUpperCase() || priority}
    </span>
  );
  const priorityLabels = {
    high: "Alta",
    medium: "Media",
    low: "Baja",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);


  const STATES = [
  { value: "new", label: "Nuevo" },
  { value: "in_progress", label: "En Proceso" },
  { value: "resolved", label: "Resuelto" },
  { value: "closed", label: "Cerrado" }
];


  useEffect(() => {
    setLoading(true);

    client
      .get(`/ticket/${id}/`)
      .then((res) => setTicket(res.data))
      .catch((err) => console.error(err));

    client
      .get(`/comments/${id}/`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const createComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await client.post(`/comments/create`, {
        ticket_id: id,
        description: newComment,
      });
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };
  const getStateLabel = (value) => {
    const found = STATES.find((s) => s.value === value);
    return found ? found.label : value;
  };

  const handleChangeState = async (e) => {
    const newState = e.target.value;
    try {
      const res = await client.patch(`/tickets/update-status`, {
        ticket_id: id,
        state: newState,
      });
      setTicket(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !ticket) return <p>Cargando...</p>;

  return (
    <div className="ticket-detail">
      <div className="ticket-detail-container">
        <h2>Detalles del Ticket TC-{ticket.id}</h2>
        <div className="ticket-detail-info">
          <div className="ticket-header">
            <strong className="ticket-title">{ticket.title}</strong>
            <PriorityBadge priority={ticket.priority} className="ticket-priority" />
          </div>
          <div><strong>Descripción:</strong> {ticket.description}</div>
          <div><strong>Reportado por:</strong> {ticket.reporter_name} ({ticket.email})</div>
          <span><strong>Estado:</strong> {getStateLabel(ticket.state)}</span>
          <div className="ticket-footer">
            
            <div className="ticket-detail-transition">
              <label>
                Cambiar estado:{" "}
                <select value={ticket.state} onChange={handleChangeState}>
                  {STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                  ))}
                </select>
              </label>
            </div>
            <span className="ticket-date">{formatDate(ticket.created_at)}</span>
          </div>
        </div>
        
        <form onSubmit={createComment} className="ticket-detail-comments">
          <span>Añadir comentario</span>
          <textarea
            className="ticket-detail-comment-input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
          />
          <button className="ticket-comment-button" type="submit">Agregar comentario</button>
        </form>
        <div className="ticket-detail-comments">
          <span>Comentarios</span>
          <ul className="ticket-detail-comment-list">
            {comments.length > 0 ? (
              comments.map((c) => (
                <li key={c.id}>
                  <p className="comment-content">{c.description}</p>
                  <small className="comment-date">{formatDate(c.created_at)}</small>
                </li>
              ))
            ) : (
              <p>No hay comentarios aún.</p>
            )}
          </ul>
        </div>
      </div>

    </div>
  );
}

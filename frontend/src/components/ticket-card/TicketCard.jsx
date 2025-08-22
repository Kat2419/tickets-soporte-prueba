import { useNavigate } from "react-router-dom";
import "./TicketCard.css";

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

export default function TicketCard({ ticket }) {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/ticket/${ticket.id}`);
  };
  return (
    <div className="ticket" key={ticket.id}>
      <div className="ticket-header">
        <strong className="ticket-title">{ticket.title}</strong>
        <PriorityBadge priority={ticket.priority} className="ticket-priority" />
      </div>
      <p>{ticket.description}</p>
      <div className="ticket-footer">
        <button className="ticket-button" onClick={goToDetails}>Ver detalles</button>
        <span className="ticket-date">{formatDate(ticket.created_at)}</span>
      </div>
      
    </div>
  )
}

import React, { useEffect, useState } from "react";
import client from "../../api/client";
import "./Board.css";
import Column from "../../components/column/Column";
import TicketCard from "../../components/ticket-card/TicketCard";

export default function Board() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    client
      .get("/tickets")
      .then((res) => setData(res.data))
      .catch((err) => setError(err?.response?.data || err.message))
      .finally(() => setLoading(false));
  }, []);

  // Función para filtrar tickets por estado
  const filterByState = (state) => data.filter((t) => t.state === state);

  return (
    <div className="board">
      <h2>Tablero de soporte</h2>

      {loading && <p>Cargando...</p>}
      {error && (
        <pre style={{ color: "crimson" }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      )}

      {!loading && !error && (
        <div className="board-columns">
          <Column title="Nuevo">
            {filterByState("new").map((ticket) => (
              <TicketCard ticket={ticket} key={ticket.id} />
            ))}
          </Column>

          <Column title="En Proceso">
            {filterByState("in_progress").map((ticket) => (
              <TicketCard ticket={ticket} key={ticket.id} />
            ))}
          </Column>

          <Column title="Resuelto">
            {filterByState("resolved").map((ticket) => (
              <TicketCard ticket={ticket} key={ticket.id} />
            ))}
          </Column>

          <Column title="Cerrado">
            {filterByState("closed").map((ticket) => (
              <TicketCard ticket={ticket} key={ticket.id} />
            ))}
          </Column>
        </div>
      )}
    </div>
  );
}

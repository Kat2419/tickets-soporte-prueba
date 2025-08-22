import React, { useEffect, useMemo, useState } from "react";
import client from "../../api/client";
import "./Board.css";
import Column from "../../components/column/Column";
import TicketCard from "../../components/ticket-card/TicketCard";

export default function Board() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");      
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

  
  const norm = (s) =>
    (s || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return data;
    return data.filter((t) =>
      norm(t.title).includes(q) ||
      norm(t.description).includes(q) ||
      norm(t.reporter_name).includes(q) ||
      norm(t.email).includes(q)
    );
  }, [data, query]);

  const byState = (state) => filtered.filter((t) => t.state === state);

  const onSubmitSearch = (e) => {
    e.preventDefault(); 
  };

  return (
    <div className="board">
      <div className="board-header">
        <h2>Tablero de soporte</h2>
        <form className="board-search" onSubmit={onSubmitSearch} role="search">
          <input
            type="search"
            className="board-search-input"
            placeholder="Buscar tickets…"
            aria-label="Buscar tickets"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="board-search-btn" type="submit" aria-label="Buscar">🔍</button>
        </form>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <pre style={{ color: "crimson" }}>{JSON.stringify(error, null, 2)}</pre>}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <p>No se encontraron tickets para “{query}”.</p>
          ) : (
            <div className="board-columns">
              <Column title="Nuevo">
                {byState("new").map((ticket) => (
                  <TicketCard ticket={ticket} key={ticket.id} />
                ))}
              </Column>

              <Column title="En Proceso">
                {byState("in_progress").map((ticket) => (
                  <TicketCard ticket={ticket} key={ticket.id} />
                ))}
              </Column>

              <Column title="Resuelto">
                {byState("resolved").map((ticket) => (
                  <TicketCard ticket={ticket} key={ticket.id} />
                ))}
              </Column>

              <Column title="Cerrado">
                {byState("closed").map((ticket) => (
                  <TicketCard ticket={ticket} key={ticket.id} />
                ))}
              </Column>
            </div>
          )}
        </>
      )}
    </div>
  );
}

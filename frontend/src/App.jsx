import Board from './pages/board/Board.jsx'
import { Routes, Route } from "react-router-dom";
import NewTicket from './pages/new-ticket/NewTicket.jsx';
import Navbar from './components/navbar/Navbar.jsx';
import "./app.css";
import TicketDetail from './pages/ticket-detail/TicketDetail.jsx';

export default function App() {
  return (
    <div>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/new-ticket" element={<NewTicket />} />
        <Route path="ticket/:id" element={<TicketDetail/>} />
      </Routes>
    </div>
  );

}



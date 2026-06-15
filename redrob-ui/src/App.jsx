import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import RankingTable from "./pages/RankingTable";
import CandidateDetail from "./pages/CandidateDetail";
import Architecture from "./pages/Architecture";
import Upload from "./pages/Upload";
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rankings" element={<RankingTable />} />
          <Route path="/candidate/:id" element={<CandidateDetail />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

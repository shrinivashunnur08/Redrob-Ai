import { Link, useLocation } from "react-router-dom";
import { BarChart3, List, Cpu, Home, Upload } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/upload", label: "Upload CSV", icon: Upload },
  { to: "/rankings", label: "Rankings", icon: List },
  { to: "/architecture", label: "Architecture", icon: Cpu },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
            <BarChart3 size={14} className="text-white" />
          </div>
          <span className="font-bold text-white tracking-tight text-sm">
            Redrob<span className="text-teal-400">Ranker</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-teal-500/20 text-teal-300 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Tag */}
        <div className="text-xs text-slate-500 font-mono hidden md:block">
          <span className="block">India Runs × Redrob AI</span>
          <span className="block text-slate-600">by Shrinivas Hunnur</span>
        </div>
      </div>
    </nav>
  );
}

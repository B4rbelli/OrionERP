import { LayoutDashboard, Package } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function MobileNav() {
  const linkClass = ({ isActive }) => 
    `flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'text-indigo-600' : 'text-slate-400'}`;

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 z-50 pb-6">
      <NavLink to="/" className={linkClass}>
        <LayoutDashboard size={24} /> Dash
      </NavLink>
      <NavLink to="/inventory" className={linkClass}>
        <Package size={24} /> Estoque
      </NavLink>
    </div>
  );
}
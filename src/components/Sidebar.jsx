import { 
  LayoutDashboard, Package, History, Wallet, ShoppingCart, 
  Settings, Truck, Tag, ShoppingBag, Moon, Sun 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ExportButton from './ExportButton';

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-slate-800 text-white dark:bg-slate-700' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`;

  // Lógica do Modo Escuro
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen p-6 dark:bg-slate-900 dark:border-slate-800 transition-colors">

      {/* Cabeçalho do Sistema */}
      <h1 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2 dark:text-white">
        <Package className="text-indigo-600" /> Orion | ERP
      </h1>

      {/* Navegação Principal */}
      <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
        <NavLink to="/" className={linkClass}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>

        <NavLink to="/pos" className={linkClass}>
          <ShoppingCart size={20} /> Caixa (PDV)
        </NavLink>

        <NavLink to="/inventory" className={linkClass}>
          <Package size={20} /> Inventário
        </NavLink>

        <NavLink to="/shopping-list" className={linkClass}>
          <ShoppingBag size={20} /> Lista de Compras
        </NavLink>

        <NavLink to="/history" className={linkClass}>
          <History size={20} /> Histórico
        </NavLink>

        <NavLink to="/finance" className={linkClass}>
          <Wallet size={20} /> Financeiro
        </NavLink>
        
        <NavLink to="/settings" className={linkClass}>
          <Settings size={20} /> Configurações
        </NavLink>

        {/* Seção de Gestão */}
        <div className="my-2 border-t border-slate-100 pt-2 dark:border-slate-800">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-2">Gestão</p>

            <NavLink to="/suppliers" className={linkClass}>
            <Truck size={20} /> Fornecedores
            </NavLink>

            <NavLink to="/categories" className={linkClass}>
            <Tag size={20} /> Categorias
            </NavLink>
        </div>
      </nav>

      {/* Rodapé com Dark Mode e Exportação */}
      <div className="border-t border-slate-100 pt-4 mt-auto dark:border-slate-800">
        
        {/* Botão Dark Mode */}
        <button 
            onClick={() => setDark(!dark)}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg w-full mb-2 transition-colors"
        >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">{dark ? 'Modo Claro' : 'Modo Escuro'}</span>
        </button>

        <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-2">Sistema</p>
        <ExportButton />
      </div>

    </aside>
  );
}
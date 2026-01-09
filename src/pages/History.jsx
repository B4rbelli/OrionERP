import { useInventory } from '../context/InventoryContext';
import { History as HistoryIcon, ArrowUpRight, ArrowDownLeft, Trash2, XCircle } from 'lucide-react';

export default function History() {
  const { history, clearHistory, removeHistoryItem } = useInventory();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <HistoryIcon /> Histórico Orion
        </h2>
        {history.length > 0 && (
          <button onClick={clearHistory} className="text-sm font-medium text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
            Limpar Tudo
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {history.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <HistoryIcon size={48} className="text-slate-200" />
            <p>Nenhuma movimentação registrada.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Tipo</th>
                <th className="p-4">Produto</th>
                <th className="p-4">Qtd</th>
                <th className="p-4">Data</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {history.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition group">
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold
                      ${log.action === 'Entrada' ? 'bg-green-100 text-green-700' : 
                        log.action === 'Saída' ? 'bg-orange-100 text-orange-700' : 
                        'bg-slate-100 text-slate-700'}`}>
                      {log.action === 'Entrada' && <ArrowDownLeft size={12} />}
                      {log.action === 'Saída' && <ArrowUpRight size={12} />}
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{log.productName}</td>
                  <td className="p-4 font-mono text-slate-600">{log.quantity}</td>
                  <td className="p-4 text-slate-400">{log.date}</td>
                  <td className="p-4 text-right">
                    <button 
                        onClick={() => removeHistoryItem(log.id)}
                        className="text-slate-300 hover:text-red-500 p-1 rounded hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                        title="Apagar este registro"
                    >
                        <XCircle size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
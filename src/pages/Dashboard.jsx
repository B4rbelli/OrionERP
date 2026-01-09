import { useInventory } from '../context/InventoryContext';
import { DollarSign, AlertTriangle, Package } from 'lucide-react';

export default function Dashboard() {
  const { products, totalValue, lowStockItems } = useInventory();

  const Card = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="p-6 pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          title="Valor em Estoque" 
          value={`R$ ${totalValue.toFixed(2)}`} 
          icon={DollarSign} 
          color="bg-green-100 text-green-600" 
        />
        <Card 
          title="Total de Produtos" 
          value={products.length} 
          icon={Package} 
          color="bg-blue-100 text-blue-600" 
        />
        <Card 
          title="Estoque Crítico" 
          value={lowStockItems.length} 
          icon={AlertTriangle} 
          color="bg-red-100 text-red-600" 
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-lg mb-4 text-slate-700">Alertas de Reposição</h3>
        {lowStockItems.length === 0 ? (
          <p className="text-slate-400">Tudo certo com seu estoque!</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {lowStockItems.map(item => (
              <li key={item.id} className="py-3 flex justify-between">
                <span>{item.name}</span>
                <span className="text-red-600 font-bold">{item.stock} un.</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Tag, Plus, X } from 'lucide-react';

export default function Categories() {
  const { categories, addCategory, removeCategory } = useInventory();
  const [newCat, setNewCat] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if(newCat.trim()) {
        addCategory(newCat.trim());
        setNewCat('');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <Tag className="text-indigo-600" /> Gerenciar Categorias
      </h2>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleAdd} className="flex gap-2 mb-8">
            <input 
                className="flex-1 border-2 border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-indigo-600 transition"
                placeholder="Nova categoria (ex: Laticínios, Limpeza...)"
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
            />
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2">
                <Plus size={20} /> Adicionar
            </button>
        </form>

        <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
                <div key={cat} className="group flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-slate-700 font-medium hover:bg-white hover:border-indigo-300 hover:shadow-sm transition">
                    <span>{cat}</span>
                    <button 
                        onClick={() => removeCategory(cat)}
                        className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                        title="Remover"
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">Dica: Categorias são usadas para organizar o inventário e relatórios de vendas.</p>
      </div>
    </div>
  );
}
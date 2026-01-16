import { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Minus, Trash2, Search, Edit, X, AlertTriangle, Calendar, Truck, ScanBarcode } from 'lucide-react';

export default function Inventory() {
  const { products, addProduct, editProduct, updateStock, removeProduct, categories, suppliers } = useInventory();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Adicionei o campo 'barcode'
  const initialFormState = { 
    id: null, name: '', category: 'Geral', price: '', cost: '', stock: '', minStock: 5, unit: 'UN', supplier: '', expiryDate: '', barcode: '' 
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const isAdmin = user?.role === 'admin';

  // Filtra também pelo código de barras
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    (p.barcode && p.barcode.includes(search))
  );

  const handleOpenCreate = () => { setFormData(initialFormState); setIsEditing(false); setIsFormOpen(true); };
  const handleOpenEdit = (product) => { setFormData(product); setIsEditing(true); setIsFormOpen(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, price: Number(formData.price), cost: Number(formData.cost), stock: Number(formData.stock), minStock: Number(formData.minStock) };
    if (isEditing) editProduct(payload);
    else { const { id, ...newProduct } = payload; addProduct(newProduct); }
    setIsFormOpen(false); setFormData(initialFormState);
  };

  const checkExpiry = (dateString) => {
    if (!dateString) return null;
    const diffDays = Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24)); 
    if (diffDays < 0) return 'expired';
    if (diffDays <= 15) return 'near';
    return 'ok';
  };

  return (
    <div className="p-6 pb-24 space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Inventário</h2>
        {isAdmin && (
            <button onClick={handleOpenCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-lg shadow-indigo-200">
            <Plus size={18} /> Novo Item
            </button>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
                <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center sticky top-0">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h3>
                    <button onClick={() => setIsFormOpen(false)}><X className="text-slate-400 hover:text-red-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Campo de Código de Barras (Novo) */}
                    <div className="md:col-span-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <ScanBarcode className="text-slate-400" />
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase block">Código de Barras (EAN)</label>
                            <input 
                                className="w-full bg-transparent border-none outline-none font-mono text-lg tracking-wide placeholder:text-slate-300 dark:placeholder:text-slate-600" 
                                placeholder="Bipe o produto aqui..." 
                                value={formData.barcode || ''} 
                                onChange={e => setFormData({...formData, barcode: e.target.value})} 
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Nome</label>
                        <input className="w-full border p-2 rounded dark:bg-slate-950" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
                        <select className="w-full border p-2 rounded bg-white dark:bg-slate-950" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Unidade</label>
                        <select className="w-full border p-2 rounded bg-white dark:bg-slate-950" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                            <option value="UN">Unidade (UN)</option><option value="KG">Quilo (KG)</option><option value="LT">Litro (LT)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Custo (R$)</label>
                        <input type="number" step="0.01" className="w-full border p-2 rounded dark:bg-slate-950" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Venda (R$)</label>
                        <input type="number" step="0.01" className="w-full border p-2 rounded dark:bg-slate-950" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Estoque</label>
                        <input type="number" step="0.001" className="w-full border p-2 rounded dark:bg-slate-950" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Mínimo</label>
                        <input type="number" step="0.001" className="w-full border p-2 rounded dark:bg-slate-950" value={formData.minStock} onChange={e => setFormData({...formData, minStock: e.target.value})} />
                    </div>
                    <div className="md:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Truck size={12}/> Fornecedor</label>
                        <select className="w-full border p-2 rounded bg-white dark:bg-slate-950" value={formData.supplier || ''} onChange={e => setFormData({...formData, supplier: e.target.value})}>
                            <option value="">Selecione...</option>
                            {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Calendar size={12}/> Validade</label>
                        <input type="date" className="w-full border p-2 rounded dark:bg-slate-950" value={formData.expiryDate || ''} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                    </div>
                    <button type="submit" className="md:col-span-2 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 mt-2">{isEditing ? 'Salvar' : 'Cadastrar'}</button>
                </form>
            </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
        <input type="text" placeholder="Buscar por nome, categoria ou código de barras..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-3">
        {filtered.map(product => {
            const expiryStatus = checkExpiry(product.expiryDate);
            return (
              <div key={product.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-300 transition">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded">{product.category}</span>
                        {product.barcode && <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1"><ScanBarcode size={10}/> {product.barcode}</span>}
                        {expiryStatus === 'expired' && <span className="text-[10px] font-bold uppercase bg-red-100 text-red-600 px-2 py-0.5 rounded flex items-center gap-1"><AlertTriangle size={10} /> VENCIDO</span>}
                        {expiryStatus === 'near' && <span className="text-[10px] font-bold uppercase bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded flex items-center gap-1"><AlertTriangle size={10} /> VENCE EM BREVE</span>}
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">{product.name}</h3>
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex gap-4 mt-1">
                        {isAdmin && <span>Custo: R$ {Number(product.cost || 0).toFixed(2)}</span>}
                        <span className="text-green-600 font-medium">Venda: R$ {product.price.toFixed(2)}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-lg p-2 border border-slate-100 dark:border-slate-700">
                  <button onClick={() => updateStock(product.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded shadow-sm text-red-500 hover:bg-red-50 border border-slate-200 dark:border-slate-600"><Minus size={16}/></button>
                  <div className="text-center min-w-[60px]">
                    <span className={`block font-bold text-xl leading-none ${product.stock < product.minStock ? 'text-red-600' : 'text-slate-700 dark:text-slate-200'}`}>{product.unit === 'KG' ? product.stock.toFixed(3) : product.stock}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{product.unit}</span>
                  </div>
                  <button onClick={() => updateStock(product.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded shadow-sm text-green-600 hover:bg-green-50 border border-slate-200 dark:border-slate-600"><Plus size={16}/></button>
                </div>

                {isAdmin && (
                    <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-2 md:pt-0 md:pl-4 justify-end">
                        <button onClick={() => handleOpenEdit(product)} className="text-slate-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition"><Edit size={20} /></button>
                        <button onClick={() => removeProduct(product.id)} className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition"><Trash2 size={20} /></button>
                    </div>
                )}
              </div>
            );
        })}
      </div>
    </div>
  );
}
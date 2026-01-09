import { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Truck, Plus, Trash2, Edit, Phone, Mail, MapPin } from 'lucide-react';

export default function Suppliers() {
  const { suppliers, addSupplier, removeSupplier, updateSupplier } = useInventory();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', cnpj: '', phone: '', email: '', contact: '', address: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      updateSupplier(formData);
    } else {
      const { id, ...newSup } = formData;
      addSupplier(newSup);
    }
    setIsFormOpen(false);
    setFormData({ id: null, name: '', cnpj: '', phone: '', email: '', contact: '', address: '' });
  };

  const handleEdit = (supplier) => {
    setFormData(supplier);
    setIsFormOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Truck className="text-indigo-600" /> Fornecedores
        </h2>
        <button onClick={() => { setFormData({ id: null, name: '', cnpj: '', phone: '', email: '', contact: '', address: '' }); setIsFormOpen(true); }} 
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
          <Plus size={18} /> Novo Fornecedor
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-md animate-fade-in">
            <h3 className="font-bold text-lg mb-4">{formData.id ? 'Editar' : 'Cadastrar'} Fornecedor</h3>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <input placeholder="Nome da Empresa *" className="border p-2 rounded col-span-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <input placeholder="CNPJ" className="border p-2 rounded" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} />
                <input placeholder="Nome do Contato (Pessoa)" className="border p-2 rounded" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                <input placeholder="Telefone / WhatsApp" className="border p-2 rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <input placeholder="E-mail" className="border p-2 rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <input placeholder="Endereço / Local" className="border p-2 rounded col-span-2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                
                <div className="col-span-2 flex gap-2 justify-end mt-2">
                    <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded">Cancelar</button>
                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Salvar</button>
                </div>
            </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {suppliers.map(sup => (
            <div key={sup.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition group relative">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">{sup.name}</h3>
                        <p className="text-xs text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded mt-1">{sup.cnpj || 'Sem CNPJ'}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => handleEdit(sup)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Edit size={16}/></button>
                        <button onClick={() => removeSupplier(sup.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                    </div>
                </div>
                
                <div className="space-y-2 text-sm text-slate-600 mt-4">
                    {sup.contact && <p className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">C</span> {sup.contact}</p>}
                    {sup.phone && <p className="flex items-center gap-2"><Phone size={14}/> {sup.phone}</p>}
                    {sup.email && <p className="flex items-center gap-2"><Mail size={14}/> {sup.email}</p>}
                    {sup.address && <p className="flex items-center gap-2"><MapPin size={14}/> {sup.address}</p>}
                </div>
            </div>
        ))}
        {suppliers.length === 0 && <p className="text-slate-400 col-span-3 text-center py-10">Nenhum fornecedor cadastrado.</p>}
      </div>
    </div>
  );
}
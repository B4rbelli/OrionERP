import { useInventory } from '../context/InventoryContext';
import { ShoppingBag, Printer, Share2, Truck } from 'lucide-react';

export default function ShoppingList() {
  const { products, suppliers } = useInventory();

  // 1. Filtra produtos que precisam de reposição
  const itemsToBuy = products.filter(p => p.stock < p.minStock);

  // 2. Agrupa por fornecedor
  const groupedItems = itemsToBuy.reduce((acc, item) => {
    const supplierName = item.supplier || 'Sem Fornecedor Definido';
    if (!acc[supplierName]) acc[supplierName] = [];
    acc[supplierName].push(item);
    return acc;
  }, {});

  const handlePrint = () => window.print();

  const handleShare = (supplierName, items) => {
    // Gera texto para WhatsApp
    let text = `*Pedido de Reposição - ${supplierName}*\n\n`;
    items.forEach(item => {
        const qtyNeeded = (item.minStock * 2) - item.stock; // Sugestão: Compra para ter o dobro do mínimo
        text += `- ${item.name}: Preciso de ${qtyNeeded.toFixed(item.unit === 'KG' ? 3 : 0)} ${item.unit}\n`;
    });
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 no-print">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShoppingBag className="text-indigo-600" /> Lista de Reposição
        </h2>
        <button onClick={handlePrint} className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700">
            <Printer size={18} /> Imprimir Lista
        </button>
      </div>

      {itemsToBuy.length === 0 ? (
        <div className="bg-green-50 p-8 rounded-xl text-center border border-green-200 text-green-700">
            <h3 className="font-bold text-lg">Tudo em dia!</h3>
            <p>Nenhum produto abaixo do estoque mínimo.</p>
        </div>
      ) : (
        <div className="grid gap-6">
            {Object.entries(groupedItems).map(([supplier, items]) => (
                <div key={supplier} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm break-inside-avoid">
                    <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
                            <Truck size={18} className="text-slate-400"/> {supplier}
                        </h3>
                        <button onClick={() => handleShare(supplier, items)} className="text-green-600 hover:text-green-700 text-xs font-bold flex items-center gap-1 bg-green-50 px-2 py-1 rounded no-print">
                            <Share2 size={14}/> Enviar no Zap
                        </button>
                    </div>
                    
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold">
                            <tr>
                                <th className="p-2">Produto</th>
                                <th className="p-2 text-center">Atual</th>
                                <th className="p-2 text-center">Mínimo</th>
                                <th className="p-2 text-right">Sugestão Compra</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map(item => {
                                const suggestion = (item.minStock * 2) - item.stock; // Lógica simples de reposição
                                return (
                                    <tr key={item.id}>
                                        <td className="p-2 font-medium">{item.name}</td>
                                        <td className="p-2 text-center text-red-500 font-bold">{item.stock}</td>
                                        <td className="p-2 text-center text-slate-400">{item.minStock}</td>
                                        <td className="p-2 text-right font-bold text-indigo-600">
                                            {suggestion > 0 ? suggestion.toFixed(item.unit === 'KG' ? 3 : 0) : 0} {item.unit}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
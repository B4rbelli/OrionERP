import { useState, useRef } from 'react'; // Adicione useRef
import { useInventory } from '../context/InventoryContext';
import { useFinance } from '../context/FinanceContext';
import { Search, ShoppingCart, Trash2, CheckCircle, Scale, Printer, X } from 'lucide-react';

export default function POS() {
  const { products, updateStock } = useInventory();
  const { addTransaction } = useFinance();

  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [lastSale, setLastSale] = useState(null); // Para guardar a venda feita
  const [showSuccess, setShowSuccess] = useState(false);
  const [weightModal, setWeightModal] = useState({ open: false, product: null, weight: '' });
  
  // Referência para impressão
  const receiptRef = useRef(null);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && p.stock > 0);

  const handleProductClick = (product) => {
    if (product.unit === 'KG') {
      setWeightModal({ open: true, product, weight: '' });
    } else {
      addToCart(product, 1);
    }
  };

  const addToCart = (product, qty) => {
    const quantity = Number(qty);
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
        setCart([...cart, { ...product, quantity }]);
    }
  };

  const confirmWeight = (e) => {
    e.preventDefault();
    addToCart(weightModal.product, weightModal.weight);
    setWeightModal({ open: false, product: null, weight: '' });
    setSearch('');
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (confirm(`Confirmar venda de R$ ${cartTotal.toFixed(2)}?`)) {
      
      const categorySales = {};
      cart.forEach(item => {
        updateStock(item.id, -item.quantity);
        const cat = item.category || 'Geral';
        categorySales[cat] = (categorySales[cat] || 0) + (item.price * item.quantity);
      });

      addTransaction('income', 'Venda PDV', cartTotal, categorySales);

      // Salva dados para o cupom antes de limpar
      setLastSale({ items: [...cart], total: cartTotal, date: new Date().toLocaleString() });
      
      setCart([]);
      setShowSuccess(true);
    }
  };

  const handlePrintReceipt = () => {
    // Truque para imprimir apenas o conteúdo do cupom
    const content = receiptRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=400');
    printWindow.document.write('<html><head><title>Cupom Orion</title>');
    printWindow.document.write('<style>body{font-family: monospace; font-size: 12px;} .line{border-bottom: 1px dashed #000; margin: 5px 0;} .text-right{text-align: right;} .flex{display: flex; justify-content: space-between;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-2rem)] gap-4 p-4 overflow-hidden relative">
      
      {/* ... (Lado Esquerdo e Carrinho iguais ao anterior - mantenha sua estrutura) ... */}
      
      {/* Vou resumir a lista e carrinho aqui para caber na resposta, 
          mas MANTENHA O CÓDIGO DA LISTA DE PRODUTOS E CARRINHO que você já tem. 
          O importante é o MODAL DE SUCESSO abaixo.
      */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-2 items-center">
            <Search className="text-slate-400" />
            <input autoFocus className="flex-1 outline-none text-lg uppercase" placeholder="BUSCAR PRODUTO..." value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 gap-3 content-start pb-20">
            {filteredProducts.map(product => (
                <button key={product.id} onClick={() => handleProductClick(product)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all text-left group flex flex-col justify-between h-32 relative overflow-hidden">
                    {product.unit === 'KG' && <Scale className="absolute right-2 top-2 text-slate-100 -rotate-12" size={40} />}
                    <div><h4 className="font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-indigo-600">{product.name}</h4><p className="text-xs text-slate-500 mt-1">{product.unit} • Est: {product.stock}</p></div>
                    <div className="font-bold text-green-600 text-lg">R$ {product.price.toFixed(2)}</div>
                </button>
            ))}
        </div>
      </div>

      <div className="w-full md:w-96 bg-white border border-slate-200 shadow-xl rounded-xl flex flex-col h-full">
         <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl"><h2 className="font-bold text-slate-800 flex items-center gap-2"><ShoppingCart size={20} /> Carrinho</h2></div>
         <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <div className="flex-1"><div className="text-sm font-medium text-slate-800">{item.name}</div><div className="text-xs text-slate-500">{item.quantity} {item.unit} x R$ {item.price.toFixed(2)}</div></div>
                    <div className="flex items-center gap-2"><span className="font-bold text-slate-700">R$ {(item.price * item.quantity).toFixed(2)}</span><button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></div>
                </div>
            ))}
         </div>
         <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-xl space-y-4">
            <div className="flex justify-between items-center text-xl font-bold text-slate-800"><span>Total</span><span>R$ {cartTotal.toFixed(2)}</span></div>
            <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 shadow-lg shadow-green-200 transition-all active:scale-95">FINALIZAR (F2)</button>
         </div>
      </div>

      {/* Modal KG (Mantenha igual) */}
      {weightModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <form onSubmit={confirmWeight} className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Scale className="text-indigo-600" /> Peso (KG)</h3>
                <div className="flex gap-2"><input autoFocus type="number" step="0.005" className="flex-1 border-2 border-indigo-100 rounded-lg p-3 text-xl font-bold text-center outline-none focus:border-indigo-600" value={weightModal.weight} onChange={e => setWeightModal({...weightModal, weight: e.target.value})} /><span className="self-center font-bold text-slate-400">KG</span></div>
                <button className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-bold">CONFIRMAR</button>
            </form>
        </div>
      )}

      {/* --- NOVO: MODAL DE SUCESSO COM CUPOM --- */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-bounce-in max-w-sm w-full">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Venda Realizada!</h3>
            <p className="text-slate-500 mb-6">Total: R$ {lastSale?.total.toFixed(2)}</p>
            
            <div className="flex gap-3 w-full">
                <button onClick={handlePrintReceipt} className="flex-1 bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-700 flex justify-center gap-2">
                    <Printer size={20} /> Imprimir
                </button>
                <button onClick={() => setShowSuccess(false)} className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-50">
                    Fechar
                </button>
            </div>

            {/* Cupom Oculto (Só renderiza para imprimir) */}
            <div style={{ display: 'none' }}>
                <div ref={receiptRef}>
                    <div style={{textAlign: 'center', marginBottom: '10px'}}>
                        <strong>ORION MARKET</strong><br/>
                        Rua das Flores, 123<br/>
                        Tel: (11) 99999-9999
                    </div>
                    <div className="line"></div>
                    <div className="flex"><span>Data:</span> <span>{lastSale?.date}</span></div>
                    <div className="line"></div>
                    {lastSale?.items.map((item, i) => (
                        <div key={i} className="flex" style={{marginBottom: '5px'}}>
                            <span style={{flex: 1}}>{item.name}</span>
                            <span style={{marginLeft: '10px'}}>{item.quantity}x {item.price.toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="line"></div>
                    <div className="flex" style={{fontSize: '14px', fontWeight: 'bold'}}>
                        <span>TOTAL</span>
                        <span>R$ {lastSale?.total.toFixed(2)}</span>
                    </div>
                    <div className="line"></div>
                    <div style={{textAlign: 'center', marginTop: '10px'}}>
                        Obrigado pela preferencia!
                    </div>
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
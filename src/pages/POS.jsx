import { useState, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingCart, Trash2, CheckCircle, Scale, Printer, Lock, AlertCircle, LogOut, DollarSign, CreditCard, QrCode, Banknote } from 'lucide-react';

export default function POS() {
  const { products, updateStock } = useInventory();
  // Pegamos agora os totais separados do FinanceContext
  const { addTransaction, register, openRegister, closeRegister, sessionTotal, sessionCash, sessionPix, sessionCard } = useFinance();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [lastSale, setLastSale] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [weightModal, setWeightModal] = useState({ open: false, product: null, weight: '' });
  
  // Novo Estado: Método de Pagamento (Padrão: Dinheiro)
  const [paymentMethod, setPaymentMethod] = useState('money'); 

  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [cashAmount, setCashAmount] = useState('');

  const receiptRef = useRef(null);

  // --- SCANNER ---
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
        const term = search.trim();
        if(!term) return;
        const productByCode = products.find(p => p.barcode === term);
        if (productByCode) {
            if(productByCode.unit === 'KG') setWeightModal({ open: true, product: productByCode, weight: '' });
            else addToCart(productByCode, 1);
            setSearch('');
        }
    }
  };

  const filteredProducts = products.filter(p => (p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode?.includes(search)) && p.stock > 0);

  const addToCart = (product, qty) => {
    const quantity = Number(qty);
    const existing = cart.find(item => item.id === product.id);
    if (existing) setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
    else setCart([...cart, { ...product, quantity }]);
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
    
    // Texto do método para confirmação
    const methodNames = { money: 'DINHEIRO', card: 'CARTÃO', pix: 'PIX' };
    
    if (confirm(`Confirmar venda de R$ ${cartTotal.toFixed(2)} no ${methodNames[paymentMethod]}?`)) {
      const categorySales = {};
      cart.forEach(item => {
        updateStock(item.id, -item.quantity);
        const cat = item.category || 'Geral';
        categorySales[cat] = (categorySales[cat] || 0) + (item.price * item.quantity);
      });
      
      // Passa o paymentMethod escolhido
      addTransaction('income', 'Venda PDV', cartTotal, paymentMethod, categorySales);
      
      setLastSale({ items: [...cart], total: cartTotal, date: new Date().toLocaleString(), method: methodNames[paymentMethod] });
      setCart([]);
      setShowSuccess(true);
      setPaymentMethod('money'); // Reseta para dinheiro
    }
  };

  const handleOpenRegister = (e) => { e.preventDefault(); openRegister(cashAmount, user?.name || 'Anonimo'); setCashAmount(''); setIsOpening(false); };
  const handleCloseRegister = (e) => { e.preventDefault(); closeRegister(Number(cashAmount), 'Fechamento de Turno'); setCashAmount(''); setIsClosing(false); };

  const handlePrintReceipt = () => {
    const content = receiptRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=400');
    printWindow.document.write('<html><head><title>Cupom Orion</title><style>body{font-family:monospace;font-size:12px;}.line{border-bottom:1px dashed #000;margin:5px 0;}.flex{display:flex;justify-content:space-between;}</style></head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  if (!register.isOpen) {
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-6 animate-fade-in p-4">
            <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-full shadow-inner"><Lock size={64} className="text-slate-400 dark:text-slate-500" /></div>
            <h2 className="text-3xl font-bold text-slate-700 dark:text-white tracking-tight">Caixa Fechado</h2>
            <p className="text-slate-500 dark:text-slate-400">Abra o turno para iniciar as vendas do dia.</p>
            {!isOpening ? (
                <button onClick={() => setIsOpening(true)} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition transform hover:-translate-y-1">INICIAR TURNO</button>
            ) : (
                <form onSubmit={handleOpenRegister} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-sm animate-fade-in">
                    <h3 className="font-bold text-xl mb-6 text-slate-800 dark:text-white flex items-center gap-2"><DollarSign className="text-green-500"/> Abertura de Caixa</h3>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Fundo de Troco (R$)</label>
                    <input type="number" step="0.01" autoFocus className="w-full text-3xl font-bold p-2 border-b-2 border-indigo-500 outline-none bg-transparent dark:text-white mb-8" placeholder="0.00" value={cashAmount} onChange={e => setCashAmount(e.target.value)} />
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setIsOpening(false)} className="flex-1 py-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-medium transition">Cancelar</button>
                        <button type="submit" className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-none transition">ABRIR</button>
                    </div>
                </form>
            )}
        </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-2rem)] gap-4 p-4 overflow-hidden relative">
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 animate-fade-in">
         <div className="flex items-center gap-3 bg-slate-900/95 dark:bg-slate-800 text-white px-5 py-2.5 rounded-full shadow-xl border border-slate-700 backdrop-blur-sm">
            <div className="relative flex items-center justify-center"><span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse absolute"></span><span className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-75"></span></div>
            <div className="flex flex-col leading-none"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Operador</span><span className="font-bold text-sm">{register.user}</span></div>
         </div>
         <button onClick={() => setIsClosing(true)} className="group flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full shadow-xl hover:shadow-red-500/30 transition-all active:scale-95 border border-red-400">
            <span className="font-bold text-sm">Fechar Caixa</span><LogOut size={16} className="opacity-80 group-hover:opacity-100" />
         </button>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-2 items-center">
            <Search className="text-slate-400" /><input autoFocus className="flex-1 outline-none text-lg uppercase bg-transparent dark:text-white" placeholder="BIPAR CÓDIGO OU DIGITAR NOME..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearchKeyDown}/>
        </div>
        <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 gap-3 content-start pb-24 px-1">
            {filteredProducts.map(product => (
                <button key={product.id} onClick={() => product.unit === 'KG' ? setWeightModal({ open: true, product, weight: '' }) : addToCart(product, 1)} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all text-left group flex flex-col justify-between h-32 relative overflow-hidden">
                    {product.unit === 'KG' && <Scale className="absolute right-2 top-2 text-slate-100 dark:text-slate-700 -rotate-12" size={40} />}
                    <div><h4 className="font-bold text-slate-800 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600">{product.name}</h4><p className="text-xs text-slate-500 mt-1">{product.unit} • Est: {product.stock}</p></div>
                    <div className="font-bold text-green-600 text-lg">R$ {product.price.toFixed(2)}</div>
                </button>
            ))}
        </div>
      </div>

      <div className="w-full md:w-96 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl flex flex-col h-full mt-8 md:mt-0 z-10">
         <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-t-xl"><h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><ShoppingCart size={20} /> Carrinho</h2></div>
         <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b border-slate-50 dark:border-slate-700 pb-2">
                    <div className="flex-1"><div className="text-sm font-medium text-slate-800 dark:text-white">{item.name}</div><div className="text-xs text-slate-500">{item.quantity} {item.unit} x R$ {item.price.toFixed(2)}</div></div>
                    <div className="flex items-center gap-2"><span className="font-bold text-slate-700 dark:text-slate-200">R$ {(item.price * item.quantity).toFixed(2)}</span><button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></div>
                </div>
            ))}
         </div>
         
         {/* --- ÁREA DE PAGAMENTO --- */}
         <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 rounded-b-xl space-y-4">
            <div className="flex justify-between items-center text-xl font-bold text-slate-800 dark:text-white"><span>Total</span><span>R$ {cartTotal.toFixed(2)}</span></div>
            
            {/* SELETOR DE MÉTODO */}
            <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setPaymentMethod('money')} className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition ${paymentMethod === 'money' ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-green-300'}`}>
                    <Banknote size={20} /><span className="text-[10px] font-bold uppercase mt-1">Dinheiro</span>
                </button>
                <button onClick={() => setPaymentMethod('pix')} className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition ${paymentMethod === 'pix' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-indigo-300'}`}>
                    <QrCode size={20} /><span className="text-[10px] font-bold uppercase mt-1">Pix</span>
                </button>
                <button onClick={() => setPaymentMethod('card')} className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-blue-300'}`}>
                    <CreditCard size={20} /><span className="text-[10px] font-bold uppercase mt-1">Cartão</span>
                </button>
            </div>

            <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 shadow-lg shadow-green-200 dark:shadow-none transition-all active:scale-95">
                FINALIZAR (F2)
            </button>
         </div>
      </div>

      {isClosing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <form onSubmit={handleCloseRegister} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm animate-bounce-in">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><AlertCircle className="text-orange-500"/> Fechar Turno</h3>
                
                {/* RESUMO DETALHADO DO CAIXA */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl mb-4 text-sm space-y-2 border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Fundo Inicial:</span> <span>R$ {register.openingBalance.toFixed(2)}</span></div>
                    
                    <div className="my-2 border-t border-dashed border-slate-200 dark:border-slate-700"></div>
                    
                    <div className="flex justify-between font-bold text-green-600"><span>Vendas Dinheiro:</span> <span>+ R$ {sessionCash.toFixed(2)}</span></div>
                    <div className="flex justify-between text-indigo-500"><span>Vendas Pix:</span> <span>R$ {sessionPix.toFixed(2)}</span></div>
                    <div className="flex justify-between text-blue-500"><span>Vendas Cartão:</span> <span>R$ {sessionCard.toFixed(2)}</span></div>
                    
                    <div className="my-2 border-t border-slate-200 dark:border-slate-700"></div>
                    
                    <div className="flex justify-between font-bold text-lg text-slate-800 dark:text-white">
                        <span>Na Gaveta:</span> 
                        {/* Apenas Dinheiro + Fundo */}
                        <span>R$ {(register.openingBalance + sessionCash).toFixed(2)}</span>
                    </div>
                </div>

                <label className="text-xs font-bold text-slate-500 uppercase">Contagem Final (Dinheiro Físico)</label>
                <input type="number" step="0.01" autoFocus required className="w-full text-2xl font-bold p-2 border-b-2 border-orange-500 outline-none bg-transparent dark:text-white mb-6" placeholder="0.00" value={cashAmount} onChange={e => setCashAmount(e.target.value)} />
                <div className="flex gap-2">
                    <button type="button" onClick={() => setIsClosing(false)} className="flex-1 py-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-bold transition">Cancelar</button>
                    <button type="submit" className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition">FECHAR CAIXA</button>
                </div>
            </form>
        </div>
      )}

      {/* Outros Modais (Peso, Sucesso) - Mantidos igual */}
      {weightModal.open && (<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"><form onSubmit={confirmWeight} className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl"><h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Scale className="text-indigo-600" /> Peso (KG)</h3><div className="flex gap-2"><input autoFocus type="number" step="0.005" className="flex-1 border-2 border-indigo-100 dark:border-indigo-900 rounded-xl p-3 text-xl font-bold text-center outline-none bg-transparent dark:text-white" value={weightModal.weight} onChange={e => setWeightModal({...weightModal, weight: e.target.value})} /><span className="self-center font-bold text-slate-400">KG</span></div><button className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">CONFIRMAR</button></form></div>)}

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-bounce-in max-w-sm w-full">
            <CheckCircle className="w-20 h-20 text-green-500 mb-6 drop-shadow-lg" />
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Venda Realizada!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">Total: <span className="font-bold text-slate-800 dark:text-white">R$ {lastSale?.total.toFixed(2)}</span></p>
            <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-lg mb-6 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Pagamento: {lastSale?.method}</div>
            <div className="flex gap-3 w-full">
                <button onClick={handlePrintReceipt} className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-700 flex justify-center gap-2 shadow-lg transition transform hover:-translate-y-1"><Printer size={20} /> Imprimir</button>
                <button onClick={() => setShowSuccess(false)} className="flex-1 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-4 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition">Nova Venda</button>
            </div>
            <div style={{ display: 'none' }}><div ref={receiptRef}><div style={{textAlign: 'center', marginBottom: '10px'}}><strong>ORION MARKET</strong><br/>Recibo Não Fiscal</div><div className="line"></div><div className="flex"><span>Data:</span> <span>{lastSale?.date}</span></div><div className="line"></div>{lastSale?.items.map((item, i) => (<div key={i} className="flex" style={{marginBottom: '5px'}}><span style={{flex: 1}}>{item.name}</span><span style={{marginLeft: '10px'}}>{item.quantity}x {item.price.toFixed(2)}</span></div>))}<div className="line"></div><div className="flex" style={{fontSize: '14px', fontWeight: 'bold'}}><span>TOTAL</span><span>R$ {lastSale?.total.toFixed(2)}</span></div><div className="flex" style={{fontSize: '12px', marginTop: '5px'}}><span>Forma Pagto:</span><span>{lastSale?.method}</span></div><div className="line"></div><div style={{textAlign: 'center', marginTop: '10px'}}>Obrigado!</div></div></div>
          </div>
        </div>
      )}
    </div>
  );
}
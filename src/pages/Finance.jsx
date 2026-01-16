import { useFinance } from '../context/FinanceContext';
import { Wallet, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownLeft, AlertCircle, CreditCard, QrCode, Banknote } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Finance() {
  const { transactions, totalIncome, totalExpenses, balance, getChartData } = useFinance();
  const data = getChartData();

  // Totais Gerais
  const incomeTrans = transactions.filter(t => t.type === 'income');
  const totalPix = incomeTrans.filter(t => t.paymentMethod === 'pix').reduce((acc, t) => acc + t.value, 0);
  const totalCard = incomeTrans.filter(t => t.paymentMethod === 'card').reduce((acc, t) => acc + t.value, 0);
  const totalMoney = incomeTrans.filter(t => t.paymentMethod === 'money').reduce((acc, t) => acc + t.value, 0);

  return (
    <div className="p-6 space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Wallet className="text-indigo-600" /> Gestão Financeira
      </h2>

      {/* --- CARDS PRINCIPAIS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Faturamento (Entradas)</p>
            <h3 className="text-2xl font-bold text-green-600">R$ {totalIncome.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full text-green-600"><TrendingUp size={24} /></div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Despesas (Saídas)</p>
            <h3 className="text-2xl font-bold text-red-500">R$ {totalExpenses.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-full text-red-500"><TrendingDown size={24} /></div>
        </div>

        <div className="bg-slate-800 dark:bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-lg text-white flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-slate-400">Lucro Líquido</p>
            <h3 className="text-2xl font-bold">R$ {balance.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-slate-700 rounded-full text-indigo-400"><DollarSign size={24} /></div>
        </div>
      </div>

      {/* --- DETALHAMENTO --- */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg"><Banknote size={20}/></div>
            <div><p className="text-xs text-slate-500 uppercase font-bold">Dinheiro</p><p className="font-bold text-slate-800 dark:text-white">R$ {totalMoney.toFixed(2)}</p></div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg"><QrCode size={20}/></div>
            <div><p className="text-xs text-slate-500 uppercase font-bold">Pix</p><p className="font-bold text-slate-800 dark:text-white">R$ {totalPix.toFixed(2)}</p></div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg"><CreditCard size={20}/></div>
            <div><p className="text-xs text-slate-500 uppercase font-bold">Cartão</p><p className="font-bold text-slate-800 dark:text-white">R$ {totalCard.toFixed(2)}</p></div>
        </div>
      </div>

      {/* --- GRÁFICO --- */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-80">
        <h3 className="font-bold text-slate-700 dark:text-white mb-4">Fluxo dos Últimos 7 Dias</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `R$${value}`} />
            <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(value) => [`R$ ${value}`, '']} />
            <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Entradas" />
            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Saídas" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* --- LISTA DE TRANSAÇÕES --- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <h3 className="font-bold text-slate-800 dark:text-white">Últimas Movimentações</h3>
        </div>
        
        {transactions.length === 0 ? (
            <div className="p-10 text-center text-slate-400">Nenhuma transação registrada.</div>
        ) : (
            <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
                    <tr>
                        <th className="p-4">Tipo</th>
                        <th className="p-4">Descrição</th>
                        <th className="p-4">Método</th>
                        <th className="p-4">Valor</th>
                        <th className="p-4">Data</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                    {transactions.map((t) => {
                        // Lógica para calcular total do turno no fechamento
                        const isClosure = t.description.includes('Fechamento') || t.description.includes('Quebra') || t.description.includes('Sobra');
                        const shiftTotal = isClosure && t.metadata ? (t.metadata.soldCash || 0) + (t.metadata.soldPix || 0) + (t.metadata.soldCard || 0) : 0;
                        
                        return (
                        <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                            <td className="p-4">
                                {t.type === 'income' && <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-md text-xs font-bold"><ArrowDownLeft size={12}/> Entrada</span>}
                                {t.type === 'expense' && <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-md text-xs font-bold"><ArrowUpRight size={12}/> Saída</span>}
                                {t.type === 'info' && <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md text-xs font-bold"><AlertCircle size={12}/> Info</span>}
                            </td>
                            <td className="p-4">
                                <p className="font-medium text-slate-800 dark:text-white">{t.description}</p>
                                
                                {/* Detalhes do Fechamento */}
                                {isClosure && t.metadata?.soldPix !== undefined && (
                                    <div className="text-xs text-slate-400 mt-1 flex gap-2">
                                        <span>Gaveta: R$ {t.metadata.expected?.toFixed(2)}</span>
                                        <span className="text-indigo-400">Pix: R$ {t.metadata.soldPix?.toFixed(2)}</span>
                                        <span className="text-blue-400">Card: R$ {t.metadata.soldCard?.toFixed(2)}</span>
                                    </div>
                                )}
                            </td>
                            <td className="p-4">
                                {t.paymentMethod === 'pix' && <span className="flex items-center gap-1 text-indigo-500 text-xs font-bold"><QrCode size={14}/> Pix</span>}
                                {t.paymentMethod === 'card' && <span className="flex items-center gap-1 text-blue-500 text-xs font-bold"><CreditCard size={14}/> Cartão</span>}
                                {t.paymentMethod === 'money' && <span className="flex items-center gap-1 text-green-600 text-xs font-bold"><Banknote size={14}/> Dinheiro</span>}
                                {t.paymentMethod === 'system' && <span className="text-slate-400 text-xs">-</span>}
                            </td>
                            <td className="p-4 font-bold">
                                {isClosure && t.type === 'info' ? (
                                    /* Se for Fechamento (Info), mostra o TOTAL VENDIDO em Azul */
                                    <span className="text-blue-600 dark:text-blue-400" title="Total Vendido no Turno">
                                        R$ {shiftTotal.toFixed(2)} (Total)
                                    </span>
                                ) : (
                                    /* Se for Venda ou Quebra/Sobra, mostra o valor real */
                                    <span className={t.type === 'income' ? 'text-green-600' : t.type === 'expense' ? 'text-red-500' : 'text-slate-500'}>
                                        R$ {t.value.toFixed(2)}
                                    </span>
                                )}
                            </td>
                            <td className="p-4 text-slate-400 dark:text-slate-500 text-xs">
                                {new Date(t.date).toLocaleString('pt-BR')}
                            </td>
                        </tr>
                    );})}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
}
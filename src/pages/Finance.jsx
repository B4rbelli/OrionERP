import { useFinance } from '../context/FinanceContext';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function Finance() {
  const { totalIncome, totalExpenses, balance, getChartData } = useFinance();
  const chartData = getChartData();

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <Wallet className="text-indigo-600" /> Gestão Financeira
      </h2>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-slate-500 font-medium mb-1">Faturamento (Entradas)</p>
            <h3 className="text-3xl font-bold text-green-600">{formatMoney(totalIncome)}</h3>
          </div>
          <TrendingUp className="absolute right-4 top-4 text-green-100 w-24 h-24 -mr-4 -mt-4" />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-slate-500 font-medium mb-1">Despesas (Saídas)</p>
            <h3 className="text-3xl font-bold text-red-500">{formatMoney(totalExpenses)}</h3>
          </div>
          <TrendingDown className="absolute right-4 top-4 text-red-100 w-24 h-24 -mr-4 -mt-4" />
        </div>

        <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-slate-400 font-medium mb-1">Lucro Líquido</p>
            <h3 className="text-3xl font-bold">{formatMoney(balance)}</h3>
          </div>
          <DollarSign className="absolute right-4 top-4 text-slate-700 w-24 h-24 -mr-4 -mt-4" />
        </div>
      </div>

      {/* Gráfico de Barras (CSS Puro) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-lg text-slate-700 mb-6">Fluxo dos Últimos 7 Dias</h3>
        
        <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
          {chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center w-full group">
              <div className="w-full flex gap-1 items-end justify-center h-full relative">
                {/* Barra de Receita */}
                <div 
                  style={{ height: `${(data.income / 1000) * 100}%` }} 
                  className="w-full bg-indigo-500 rounded-t-sm hover:bg-indigo-600 transition-all relative group-hover:shadow-lg"
                ></div>
                {/* Barra de Despesa */}
                <div 
                  style={{ height: `${(data.expense / 1000) * 100}%` }} 
                  className="w-full bg-red-400 rounded-t-sm hover:bg-red-500 transition-all opacity-80"
                ></div>
              </div>
              <span className="text-xs text-slate-400 mt-2 font-medium">{data.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
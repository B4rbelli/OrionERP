import { createContext, useState, useEffect, useContext } from 'react';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('orion_finance');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('orion_finance', JSON.stringify(transactions));
  }, [transactions]);

  // Adicionar Transação (Com suporte a Metadata/Categorias)
  const addTransaction = (type, description, value, metadata = {}) => {
    const newTrans = {
      id: Date.now(),
      type, // 'income' ou 'expense'
      description,
      value: Number(value),
      metadata, // Ex: { 'Bebidas': 20.00 }
      date: new Date().toISOString(),
    };
    setTransactions([newTrans, ...transactions]);
  };

  // Cálculos de Totais
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.value, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.value, 0);
  const balance = totalIncome - totalExpenses;

  // Função para Backup (Importar dados)
  const importFinanceData = (data) => setTransactions(data);

  // --- FUNÇÃO DO GRÁFICO ---
  const getChartData = () => {
    // Gera os últimos 7 dias dinamicamente
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return {
        dateObj: d,
        label: d.toLocaleDateString('pt-BR', { weekday: 'short' }) // Seg, Ter...
      };
    }).reverse();

    // Mapeia os valores reais das transações para esses dias
    return last7Days.map(dayInfo => {
      // Filtra transações daquele dia específico
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getDate() === dayInfo.dateObj.getDate() &&
               tDate.getMonth() === dayInfo.dateObj.getMonth() &&
               tDate.getFullYear() === dayInfo.dateObj.getFullYear();
      });

      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.value, 0);

      const expense = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.value, 0);

      return {
        day: dayInfo.label,
        income,
        expense
      };
    });
  };

  return (
    <FinanceContext.Provider value={{ 
      transactions, 
      addTransaction, 
      totalIncome, 
      totalExpenses, 
      balance, 
      importFinanceData,
      getChartData
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

// <--- A LINHA QUE ESTAVA FALTANDO É ESSA AQUI:
export const useFinance = () => useContext(FinanceContext);
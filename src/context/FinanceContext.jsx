import { createContext, useState, useEffect, useContext } from 'react';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('orion_finance');
    return saved ? JSON.parse(saved) : [];
  });

  const [register, setRegister] = useState(() => {
    const saved = localStorage.getItem('orion_register');
    return saved ? JSON.parse(saved) : { isOpen: false, openingBalance: 0, openTime: null, user: null };
  });

  useEffect(() => {
    localStorage.setItem('orion_finance', JSON.stringify(transactions));
    localStorage.setItem('orion_register', JSON.stringify(register));
  }, [transactions, register]);

  // Transações
  const addTransaction = (type, description, value, paymentMethod = 'money', metadata = {}) => {
    const newTrans = {
      id: Date.now(),
      type, 
      description,
      value: Number(value),
      paymentMethod, // 'money', 'pix', 'card', 'system'
      metadata, 
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTrans, ...prev]);
  };

  // --- CÁLCULOS DA SESSÃO (Turno Atual) ---
  const sessionTransactions = register.isOpen 
    ? transactions.filter(t => t.date > register.openTime) 
    : [];

  const sessionTotal = sessionTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.value, 0);
  
  const sessionCash = sessionTransactions
    .filter(t => t.type === 'income' && t.paymentMethod === 'money')
    .reduce((acc, t) => acc + t.value, 0);

  const sessionPix = sessionTransactions
    .filter(t => t.type === 'income' && t.paymentMethod === 'pix')
    .reduce((acc, t) => acc + t.value, 0);

  const sessionCard = sessionTransactions
    .filter(t => t.type === 'income' && t.paymentMethod === 'card')
    .reduce((acc, t) => acc + t.value, 0);

  // --- CONTROLE DE CAIXA ---
  const openRegister = (amount, userName) => {
    setRegister({
        isOpen: true,
        openingBalance: Number(amount),
        openTime: new Date().toISOString(),
        user: userName
    });
    addTransaction('info', `Abertura de Caixa (${userName})`, 0, 'system', { openingBalance: amount });
  };

  const closeRegister = (finalCount, notes) => {
    const expectedInDrawer = register.openingBalance + sessionCash;
    const diff = Number(finalCount) - expectedInDrawer;

    // Objeto com o resumo do turno para salvar no histórico
    const shiftSummary = {
        expected: expectedInDrawer,
        actual: finalCount,
        user: register.user,
        soldCash: sessionCash, // <--- Agora salva quanto vendeu no dinheiro
        soldPix: sessionPix,   // <--- Agora salva quanto vendeu no Pix
        soldCard: sessionCard, // <--- Agora salva quanto vendeu no Cartão
        notes
    };

    if (diff < 0) {
        addTransaction('expense', 'Quebra de Caixa (Falta)', Math.abs(diff), 'money', shiftSummary);
    } else if (diff > 0) {
        addTransaction('income', 'Sobra de Caixa (Excedente)', Math.abs(diff), 'money', shiftSummary);
    } else {
        addTransaction('info', 'Fechamento de Caixa (Correto)', 0, 'system', shiftSummary);
    }
    setRegister({ isOpen: false, openingBalance: 0, openTime: null, user: null });
  };

  // --- CÁLCULOS GERAIS (DASHBOARD) ---
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.value, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.value, 0);
  const balance = totalIncome - totalExpenses;

  const importFinanceData = (data) => setTransactions(data);

  const getChartData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i);
      return { dateObj: d, label: d.toLocaleDateString('pt-BR', { weekday: 'short' }) };
    }).reverse();

    return last7Days.map(dayInfo => {
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getDate() === dayInfo.dateObj.getDate() && tDate.getMonth() === dayInfo.dateObj.getMonth() && tDate.getFullYear() === dayInfo.dateObj.getFullYear();
      });
      return {
        day: dayInfo.label,
        income: dayTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.value, 0),
        expense: dayTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.value, 0)
      };
    });
  };

  return (
    <FinanceContext.Provider value={{ 
      transactions, addTransaction, totalIncome, totalExpenses, balance, importFinanceData, getChartData,
      register, openRegister, closeRegister, 
      sessionTotal, sessionCash, sessionPix, sessionCard 
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);
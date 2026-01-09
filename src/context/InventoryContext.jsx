import { createContext, useState, useEffect, useContext } from 'react';

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  // --- ESTADO DOS PRODUTOS ---
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('orion_products');
    return saved ? JSON.parse(saved) : [];
  });

  // --- ESTADO DO HISTÓRICO ---
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('orion_history');
    return saved ? JSON.parse(saved) : [];
  });

  // --- ESTADO DE FORNECEDORES (Com proteção contra erro) ---
  const [suppliers, setSuppliers] = useState(() => {
    try {
      const saved = localStorage.getItem('orion_suppliers');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return []; // Se der erro, retorna lista vazia
    }
  });

  // --- ESTADO DE CATEGORIAS (Com proteção contra erro) ---
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('orion_categories');
      return saved ? JSON.parse(saved) : ['Geral', 'Mercearia', 'Frios', 'Bebidas', 'Limpeza'];
    } catch (e) {
      return ['Geral'];
    }
  });

  // Salvar automaticamente TUDO
  useEffect(() => {
    localStorage.setItem('orion_products', JSON.stringify(products));
    localStorage.setItem('orion_history', JSON.stringify(history));
    localStorage.setItem('orion_suppliers', JSON.stringify(suppliers));
    localStorage.setItem('orion_categories', JSON.stringify(categories));
  }, [products, history, suppliers, categories]);

  // --- FUNÇÕES ---
  const addToHistory = (action, productName, quantity) => {
    setHistory([{ id: Date.now(), action, productName, quantity, date: new Date().toLocaleString('pt-BR') }, ...history]);
  };

  const addProduct = (product) => {
    setProducts([{ id: Date.now(), ...product }, ...products]);
    addToHistory('Criação', product.name, product.stock);
  };

  const editProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    addToHistory('Edição', updatedProduct.name, updatedProduct.stock);
  };

  const updateStock = (id, amount) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    let newStock = Number(product.stock) + Number(amount);
    if (newStock < 0) newStock = 0;
    
    newStock = product.unit === 'KG' ? Math.round(newStock * 1000) / 1000 : Math.floor(newStock);

    setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
    addToHistory(amount > 0 ? 'Entrada' : 'Saída', product.name, Math.abs(amount));
  };

  const removeProduct = (id) => {
    if (confirm('Excluir este produto?')) {
      const p = products.find(i => i.id === id);
      setProducts(products.filter(i => i.id !== id));
      addToHistory('Exclusão', p.name, 0);
    }
  };

  const clearHistory = () => { if(confirm('Limpar histórico?')) setHistory([]); };
  const removeHistoryItem = (id) => { if(confirm('Apagar registro?')) setHistory(history.filter(h => h.id !== id)); };

  const addSupplier = (supplier) => {
    setSuppliers([{ id: Date.now(), ...supplier }, ...suppliers]);
  };

  const removeSupplier = (id) => {
    if(confirm('Remover fornecedor?')) setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const updateSupplier = (updatedSupplier) => {
    setSuppliers(suppliers.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
  };

  const addCategory = (name) => {
    if (!categories.includes(name)) setCategories([...categories, name]);
  };

  const removeCategory = (name) => {
    if(confirm(`Remover categoria "${name}"?`)) setCategories(categories.filter(c => c !== name));
  };

  const importProductData = (pData, hData, sData, cData) => {
    setProducts(pData || []);
    setHistory(hData || []);
    setSuppliers(sData || []);
    setCategories(cData || []);
  };

  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStockItems = products.filter(p => p.stock < p.minStock);

  return (
    <InventoryContext.Provider value={{ 
      products, history, suppliers, categories, // <--- O ERRO ESTAVA AQUI (Se faltar isso, dá tela branca)
      addProduct, editProduct, updateStock, removeProduct, 
      clearHistory, removeHistoryItem, 
      addSupplier, removeSupplier, updateSupplier, 
      addCategory, removeCategory, 
      totalValue, lowStockItems, importProductData 
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => useContext(InventoryContext);
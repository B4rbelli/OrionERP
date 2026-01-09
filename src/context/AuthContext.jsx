import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('orion_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('orion_user', JSON.stringify(user));
    else localStorage.removeItem('orion_user');
  }, [user]);

  const login = (pin) => {
    if (pin === '1234') {
      setUser({ name: 'Gerente', role: 'admin' });
      return true;
    }
    if (pin === '0000') {
      setUser({ name: 'Operador de Caixa', role: 'cashier' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext';
import { FinanceProvider } from './context/FinanceContext';
import { AuthProvider, useAuth } from './context/AuthContext'; // Importe o Auth

import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import History from './pages/History';
import Finance from './pages/Finance';
import POS from './pages/POS';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Suppliers from './pages/Suppliers';
import Categories from './pages/Categories';
import ShoppingList from './pages/ShoppingList';

// Componente para proteger rotas (Só entra se estiver logado)
const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function AppLayout() {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/finance" element={<Finance />} />
                    <Route path="/pos" element={<POS />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/shopping-list" element={<ShoppingList />} />
                </Routes>
            </main>
            <MobileNav />
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <InventoryProvider>
                <FinanceProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/*" element={
                                <PrivateRoute>
                                    <AppLayout />
                                </PrivateRoute>
                            } />
                        </Routes>
                    </BrowserRouter>
                </FinanceProvider>
            </InventoryProvider>
        </AuthProvider>
    );
}

export default App;
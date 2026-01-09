import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [pin, setPin] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(pin)) {
      navigate('/');
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
        <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 p-4 rounded-full">
                <Package size={40} className="text-indigo-600" />
            </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Orion | ERP</h1>
        <p className="text-slate-500 mb-6">Digite seu PIN de acesso</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                    type="password" 
                    maxLength="4"
                    placeholder="PIN (Ex: 1234)" 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-center text-xl tracking-[0.5em] font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
                    value={pin}
                    onChange={e => {setPin(e.target.value); setError(false);}}
                    autoFocus
                />
            </div>
            
            {error && <p className="text-red-500 text-sm font-medium">PIN Incorreto. Tente 1234 ou 0000.</p>}

            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
                ENTRAR NO SISTEMA
            </button>
        </form>
        
        <div className="mt-6 text-xs text-slate-400">
            <p>Admin: 1234 | Caixa: 0000</p>
        </div>
      </div>
    </div>
  );
}
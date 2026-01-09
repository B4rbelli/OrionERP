import { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { Save, Upload, LogOut, Database } from 'lucide-react';
import ExportButton from '../components/ExportButton';

export default function Settings() {
  const { importProductData } = useInventory();
  const { importFinanceData } = useFinance();
  const { logout, user } = useAuth();
  const [jsonText, setJsonText] = useState('');

  const handleBackupExport = () => {
    // Pega TUDO do localStorage
    const data = {
        products: JSON.parse(localStorage.getItem('orion_products') || '[]'),
        history: JSON.parse(localStorage.getItem('orion_history') || '[]'),
        finance: JSON.parse(localStorage.getItem('orion_finance') || '[]'),
        date: new Date().toISOString()
    };
    
    // Cria arquivo JSON para baixar
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BACKUP_ORION_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  const handleRestore = () => {
    try {
        const data = JSON.parse(jsonText);
        if(!confirm('Isso vai SUBSTITUIR todos os dados atuais. Tem certeza?')) return;
        
        if(data.products) importProductData(data.products, data.history || []);
        if(data.finance) importFinanceData(data.finance);
        
        alert('Dados restaurados com sucesso! O sistema será recarregado.');
        window.location.reload();
    } catch (e) {
        alert('Erro ao ler JSON. Verifique o formato.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Configurações do Sistema</h2>

      {/* Perfil */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
            <h3 className="font-bold text-lg">Usuário Logado</h3>
            <p className="text-slate-500">{user?.name} ({user?.role})</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition">
            <LogOut size={20} /> Sair
        </button>
      </div>

      {/* Área de Dados */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Exportar */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Database size={24}/></div>
                <h3 className="font-bold text-lg">Backup de Dados</h3>
            </div>
            <p className="text-sm text-slate-500">Baixe um arquivo completo para segurança ou para mover para outro PC.</p>
            <div className="flex flex-col gap-2">
                <button onClick={handleBackupExport} className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-50">
                    Baixar Backup Completo (.json)
                </button>
                <div className="my-2 border-t border-slate-100"></div>
                <ExportButton /> {/* Botão antigo de Excel */}
            </div>
        </div>

        {/* Importar */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Upload size={24}/></div>
                <h3 className="font-bold text-lg">Restaurar Backup</h3>
            </div>
            <p className="text-sm text-slate-500">Cole o conteúdo do arquivo JSON aqui para restaurar.</p>
            <textarea 
                className="w-full h-24 border p-2 rounded text-xs font-mono bg-slate-50"
                placeholder='Cole o código do JSON aqui...'
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
            ></textarea>
            <button onClick={handleRestore} disabled={!jsonText} className="w-full bg-slate-800 text-white py-2 rounded-lg font-medium hover:bg-slate-700 disabled:opacity-50">
                Restaurar Dados
            </button>
        </div>
      </div>
    </div>
  );
}
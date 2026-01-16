import { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { Upload, LogOut, Database } from 'lucide-react';
import ExportButton from '../components/ExportButton';

export default function Settings() {
  const { importProductData } = useInventory();
  const { importFinanceData } = useFinance();
  const { logout, user } = useAuth();
  const [jsonText, setJsonText] = useState('');

  // Verifica se é Admin
  const isAdmin = user?.role === 'admin';

  const handleBackupExport = () => {
    const data = {
        products: JSON.parse(localStorage.getItem('orion_products') || '[]'),
        history: JSON.parse(localStorage.getItem('orion_history') || '[]'),
        finance: JSON.parse(localStorage.getItem('orion_finance') || '[]'),
        suppliers: JSON.parse(localStorage.getItem('orion_suppliers') || '[]'),
        categories: JSON.parse(localStorage.getItem('orion_categories') || '[]'),
        date: new Date().toISOString()
    };
    
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
        
        if(data.products) importProductData(data.products, data.history || [], data.suppliers || [], data.categories || []);
        if(data.finance) importFinanceData(data.finance);
        
        alert('Dados restaurados com sucesso! O sistema será recarregado.');
        window.location.reload();
    } catch (e) {
        alert('Erro ao ler JSON. Verifique o formato.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Configurações</h2>

      {/* --- ÁREA DE PERFIL (VISÍVEL PARA TODOS) --- */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Perfil de Acesso</h3>
            <p className="text-slate-500 dark:text-slate-400">
                Você está logado como <strong className="text-indigo-600 dark:text-indigo-400">{user?.name}</strong>
            </p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 px-6 py-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition border border-red-100 dark:border-red-900">
            <LogOut size={20} /> Encerrar Sessão (Sair)
        </button>
      </div>

      {/* --- ÁREA DE DADOS (SÓ ADMIN VÊ) --- */}
      {isAdmin ? (
        <div className="grid md:grid-cols-2 gap-6">
            
            {/* Exportar */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-lg"><Database size={24}/></div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Backup de Dados</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Baixe um arquivo completo para segurança ou para mover para outro PC.</p>
                <div className="flex flex-col gap-2">
                    <button onClick={handleBackupExport} className="w-full border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 py-2 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                        Baixar Backup Completo (.json)
                    </button>
                    <div className="my-2 border-t border-slate-100 dark:border-slate-700"></div>
                    <ExportButton />
                </div>
            </div>

            {/* Importar */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 rounded-lg"><Upload size={24}/></div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Restaurar Backup</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Cole o conteúdo do arquivo JSON aqui para restaurar.</p>
                <textarea 
                    className="w-full h-24 border border-slate-200 dark:border-slate-600 p-2 rounded text-xs font-mono bg-slate-50 dark:bg-slate-950 dark:text-slate-300 focus:outline-none focus:border-indigo-500"
                    placeholder='Cole o código do JSON aqui...'
                    value={jsonText}
                    onChange={e => setJsonText(e.target.value)}
                ></textarea>
                <button onClick={handleRestore} disabled={!jsonText} className="w-full bg-slate-800 dark:bg-slate-700 text-white py-2 rounded-lg font-medium hover:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50">
                    Restaurar Dados
                </button>
            </div>
        </div>
      ) : (
        /* MENSAGEM PARA O CAIXA (FEEDBACK VISUAL) */
        <div className="text-center p-8 text-slate-400 dark:text-slate-600 italic">
            Configurações avançadas disponíveis apenas para Administradores.
        </div>
      )}
    </div>
  );
}
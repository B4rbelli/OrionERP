# 📦 Orion | ERP

> Um sistema de gestão completo, moderno e responsivo para mercados e pequenos comércios. Executa 100% no navegador.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

---

## 🖼️ Visão Geral

O **Orion ERP** foi desenvolvido para simplificar a gestão de estoque, vendas e finanças. Com uma interface limpa ("Clean UI"), suporte a **Modo Escuro** e funcionamento Offline (Local Storage), ele é ideal para quem precisa de agilidade no dia a dia.

*(Coloque aqui um print da tela do Dashboard)*

---

## 🚀 Funcionalidades Principais

### 🛒 Frente de Caixa (PDV)
* Interface ágil focada em vendas rápidas.
* Suporte a produtos por unidade (UN) ou peso (KG) com pop-up de pesagem.
* Carrinho de compras dinâmico.
* **Impressão de Cupom** não fiscal (formato térmico).

### 📦 Gestão de Inventário
* Controle completo de estoque (Entradas e Saídas).
* Alertas visuais de **Validade** (Vencido/Vence em Breve).
* Alertas de **Estoque Baixo**.
* Cadastro de Fornecedores e Categorias dinâmicas.

### 💰 Financeiro & Relatórios
* Dashboard com indicadores de faturamento e lucro.
* Gráficos visuais de fluxo de caixa.
* **Exportação Avançada para Excel (.xlsx)** com filtros por período.
* Geração automática de **Lista de Compras/Reposição** baseada no estoque mínimo (com envio para WhatsApp).

### ⚙️ Sistema & Configurações
* **Dark Mode** (Modo Noturno) profissional integrado.
* **Backup e Restauração:** Exporte seus dados para JSON e leve para outro computador.
* Login com níveis de acesso (Admin/Caixa).

---

## 🔐 Acesso (Login)

Como o sistema roda localmente, utilizamos PINs pré-definidos para simular a autenticação:

| Perfil | PIN | Permissões |
| :--- | :--- | :--- |
| **Administrador** | `1234` | Acesso total (Configurações, Edição, Financeiro) |
| **Caixa** | `0000` | Acesso restrito (Apenas PDV e visualização básica) |

---

## 🛠️ Tecnologias Utilizadas

* **React (Vite):** Core da aplicação.
* **Tailwind CSS:** Estilização responsiva e Dark Mode.
* **Context API:** Gerenciamento de estado global (Banco de dados em memória).
* **Lucide React:** Ícones modernos e leves.
* **SheetJS (xlsx):** Geração de relatórios em Excel.
* **Local Storage:** Persistência de dados no navegador.

---

## 💻 Como Rodar o Projeto

Pré-requisitos: Você precisa ter o [Node.js](https://nodejs.org/) instalado.

1. **Clone o repositório** (ou baixe os arquivos):
   ```bash
   git clone [https://github.com/seu-usuario/orion-erp.git](https://github.com/seu-usuario/orion-erp.git)
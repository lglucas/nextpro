# NextPro - Super App de Futebol

Bem-vindo ao NextPro, a plataforma definitiva para gestão de carreiras e clubes de futebol.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- Conta no [Supabase](https://supabase.com) (Cloud)

### Configuração Inicial

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/lglucas/nextpro.git
    cd nextpro
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Configuração do Supabase**
    - Crie um projeto no [Supabase](https://database.new).
    - Copie o arquivo de exemplo de ambiente:
      ```bash
      cp apps/web/.env.example apps/web/.env
      ```
    - Edite `apps/web/.env` e preencha com suas chaves do Supabase Cloud:
      ```ini
      VITE_SUPABASE_URL=https://seu-projeto.supabase.co
      VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
      ```

4.  **Rodar o Frontend**
    ```bash
    npm run dev
    ```
    O app estará disponível em `http://localhost:5173`.

## 🛠️ Stack Tecnológica

- **Frontend**: React, Vite, TypeScript, TailwindCSS
- **Backend/Auth**: Supabase (Cloud)
- **Monorepo**: NPM Workspaces

## 📦 Estrutura

- `apps/web`: Aplicação Web Principal (Plataforma)
- `packages/`: Bibliotecas compartilhadas (UI, configs)

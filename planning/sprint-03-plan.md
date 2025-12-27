# Planejamento Sprint 3: Gestão Escolar e Atletas

**Período:** 29/12/2025 - 04/01/2026 (Estimado)
**Foco:** Funcionalidades principais para o Administrador da Escola (School Admin).

## Objetivos
1. Permitir que escolas cadastrem seus alunos (atletas).
2. Permitir gestão de turmas (categorias/horários).
3. Oferecer um dashboard com métricas reais da escola.
4. Facilitar a migração de dados via importação CSV (Bonus).

## Tarefas

### 1. Banco de Dados & Backend (Supabase)
- [x] Criar tabela `students` com RLS.
- [x] Criar tabela `classes` com RLS.
- [x] Atualizar tabela `profiles` com `school_id`.
- [ ] Criar Storage Bucket para fotos de alunos (Opcional por enquanto).

### 2. Frontend - Painel da Escola
- [x] Atualizar Dashboard para exibir contagens reais de Alunos e Turmas.
- [x] Implementar navegação condicional (sidebar) para School Admin.

### 3. Gestão de Atletas (`StudentsPage`)
- [x] Listagem de alunos.
- [x] Formulário de cadastro com validação.
- [x] Cálculo automático de categoria (Sub-X).
- [ ] Edição e Exclusão (CRUD completo).
- [ ] Upload de foto.

### 4. Gestão de Turmas (`ClassesPage`)
- [x] Listagem de turmas.
- [x] Formulário de cadastro (Nome, Categoria, Dias, Horários).
- [ ] Edição e Exclusão.
- [x] Vincular alunos a turmas (Relacionamento N:N ou 1:N).
- [x] Interface de Chamada (`ClassAttendancePage`).

### 5. Importação e Exportação
- [x] Importação de alunos via CSV (MVP).
- [ ] Exportação de lista de presença (PDF).

### 6. Legal (Termos de Uso)
- [x] Gate de aceite obrigatório para acessar `/app` e `/dashboard`.
- [x] Registro de aceite com versão e evidências mínimas (IP/User-Agent/Meta).

## Status Atual
- Estrutura base implementada.
- Tabelas criadas (`students`, `classes`, `guardians`, `class_students`, `class_sessions`, `attendances`).
- Formulários de criação funcionais com fluxo de dependência (Responsável -> Aluno).
- Sistema de Chamada Manual funcional (v0.6.1).
- Termos de Uso com aceite obrigatório em validação.

## Lições Aprendidas
- **Normalização de Dados:** Inicialmente tentamos colocar o nome do responsável como texto no aluno. Isso gerou duplicidade e falta de integridade. A solução foi criar a tabela `guardians`.
- **Matrícula N:N:** Alunos podem fazer múltiplas modalidades. A tabela de junção `class_students` foi essencial.
- **Resiliência de UI:** Importante tratar retornos nulos da API (como visto no bug da ClassesPage) para evitar que a tela fique branca.

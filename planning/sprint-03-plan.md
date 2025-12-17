# Planejamento Sprint 3: Gestão Escolar e Atletas

**Período:** 16/12/2025 - 23/12/2025 (Estimado)
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
- [ ] Vincular alunos a turmas (Relacionamento N:N ou 1:N).

### 5. Importação e Exportação
- [ ] Importação de alunos via CSV.
- [ ] Exportação de lista de presença (PDF).

## Status Atual
- Estrutura base implementada.
- Tabelas criadas.
- Formulários de criação funcionais.

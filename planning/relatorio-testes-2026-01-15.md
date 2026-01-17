# 🧪 Relatório de Testes (Manual) — Turmas, Matrículas e Chamada
**Data:** 15/01/2026  
**Ambiente:** Local (Windows + VSCode) + Supabase Cloud

## 🎯 Objetivo
Validar o fluxo operacional básico do Dashboard Escolar (SchoolAdmin/Professor) envolvendo:
- Gestão de turmas;
- Vínculo de alunos em turmas (matrículas);
- Chamada manual e geração de QR de check-in.

## ✅ Escopo testado (o que funcionou)
### Turmas (Dashboard)
- Acessar `/dashboard/classes`.
- Listar turmas existentes.
- Criar nova turma e vê-la aparecer na lista após criação.

### Matrículas (Turma → Alunos)
- Abrir modal de alunos da turma.
- Vincular (matricular) um aluno em uma turma.

### Chamada (Turma → Chamada)
- Abrir a página de chamada da turma.
- Criar uma aula/sessão (botão `+`) e visualizar a lista de presença.
- Alterar status de presença de aluno (presente/ausente/atrasado/dispensado).
- Salvar chamada.

### QR Code
- Gerar QR Code de check-in com link.
- Confirmar geração e visualização do QR/link na UI.

## 🐞 Problemas encontrados e correções aplicadas
### 1) Login/Termos bloqueados por RLS recursiva em `profiles`
- **Sintoma:** “Não consegui validar os termos agora” + `infinite recursion detected in policy for relation "profiles"`.
- **Correção:** Ajuste das policies de `profiles` para evitar consultar `profiles` dentro de `profiles`.
- **Migração:** `14_fix_profiles_rls_policy_recursion.sql`.

### 2) Turmas não listavam e davam erro por RLS recursiva em `class_students`
- **Sintoma:** `Erro ao buscar turmas: infinite recursion detected in policy for relation "class_students"` (ocorre mais de uma vez).
- **Impacto:** Criação de turma até funcionava, mas listagem falhava e a turma não aparecia.
- **Correção:** Policy de `coach` em `class_students` reescrita usando função `SECURITY DEFINER` para quebrar a recursão.
- **Migração:** `15_fix_class_students_policy_recursion.sql`.

## 🧱 Migrations executadas no Supabase (este ciclo)
- `11_add_coach_rls_policies.sql`
- `12_super_admin_manage_profiles.sql`
- `13_coach_manage_own_classes.sql`
- `14_fix_profiles_rls_policy_recursion.sql`
- `15_fix_class_students_policy_recursion.sql`

## 📌 Pendências e próximos testes recomendados
- **Check-in real como atleta (App):** abrir `/app/check-in` com o link do QR e confirmar:
  - registro em `attendances` com `notes = 'qr'` (quando aplicável),
  - atualização do contador de check-ins no modal do QR,
  - regras de bloqueio por atleta inativo (quando existir fluxo/coluna financeira).
- **Sprint 2.5 (Onboarding):** confirmação de pré-cadastro pela escola (item marcado como pendente no roadmap).
- **Sprint 6+ (Avaliações):** telas de avaliação pós-treino/mensal ainda não iniciadas.

## 🧾 Como extrair os commits deste ciclo
Após commitar e subir, rode:
```bash
git log -n 20 --oneline
```
E cole a lista aqui nesta seção para manter o histórico do QA completo.

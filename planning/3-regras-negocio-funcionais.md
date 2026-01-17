# 🧠 NextPro - Regras de Negócio e Funcionais

**Versão:** 1.1  
**Data:** 17/01/2026  
**Status:** Aprovado  

---

## 1. Engines (visão geral)
O NextPro é desenhado com 3 engines independentes (mas integráveis), com uma camada comum (shared).

### 1.1 Engines
- **Engine Técnica (futebol):** evolução técnica do atleta por temporada, posição e treino.
- **Engine Social (influência econômica):** ranking monetizável do atleta (fanbase + presentes/moedas) com tiers e ciclos.
- **Engine de Benefícios (fidelidade):** pontos/cashback e marketplace.

### 1.2 Princípios obrigatórios
- **Separação:** social não muda nota técnica; benefícios não mudam nota técnica.
- **Auditoria:** tudo que gera score vira evento auditável.
- **Comparabilidade:** sempre por temporada (ano).

---

## 2. Presença (estado atual)
### 2.1 Regra: aluno inativo não marca “presente”
- Se o aluno estiver inativo (`students.active = false`), não é permitido marcar `attendances.status = 'present'`.
- Isso é garantido em 2 níveis:
  - UI (botão/fluxo bloqueado)
  - banco (trigger), para impedir bypass

---

## 3. Gamificação (estado atual no código)
### 3.1 XP por presença
- Presença confirmada gera XP automaticamente (trigger no banco).
- O valor base vem de `system_settings.xp_base`.
- Existe trilha de eventos para idempotência/auditoria (não duplica XP).

### 3.2 Badges/tiers (infra)
- Existem tabelas base de badges/tiers no banco.
- O motor de regras de desbloqueio automático é planejado (não entregue ainda).

---

## 4. Engine Técnica (planejada e parcialmente preparada)
### 4.1 Temporadas (ano)
- Temporada anual é a unidade principal (2026, 2025, etc).
- Rankings e histórico são por temporada.

### 4.2 Núcleos
- Núcleo é o agrupamento operacional de escolinhas (para seleção e calibração pela equipe NextPro).
- Uma escola pertence a um núcleo por temporada.

### 4.3 Rubricas técnicas (catálogo versionado)
O catálogo de perguntas técnicas é versionado por temporada e separado em:
- **Base:** slot 1 (menu de perguntas base)
- **Por posição:** slots 2 e 3 (menus por posição)

#### O que é o `key` da pergunta
Em `technical_questions`, `key` é o identificador técnico estável da pergunta:
- o texto do prompt pode mudar sem quebrar histórico;
- o cálculo e os eventos referenciam pelo `key`;
- formato recomendado: `snake_case` sem acentos.

Exemplos:
- `disciplina_compromisso`
- `finalizacao_pe_fraco`
- `passe_vertical`
- `1v1_defensivo`

### 4.4 Avaliação diária (por treino) — fluxo previsto
- Gating obrigatório: 3 piores → 3 melhores
- 3 perguntas por atleta (0–10), com seleção estilo “iFood”:
  - 1 base (slot 1)
  - 2 por posição (slots 2 e 3)

### 4.5 Avaliação mensal — fluxo previsto
- Prova mensal por turma: 20–40 perguntas por atleta.
- Perguntas fixas/versionadas por temporada para comparabilidade.

---

## 5. Engine Social (planejada)
### 5.1 Seguir vs ser fã
- Seguir é gratuito e define o feed.
- Ser fã cria vínculo com um atleta e direciona contribuição de fanbase.

### 5.2 Moedas e presentes no feed
- 1 curtida grátis por post; extras/presentes via moedas.
- Compra de moedas exige verificação (telefone + CPF no pagamento).

### 5.3 Tiers e ciclos
- Reavaliação a cada 15 dias por percentil.
- Reset no fim da temporada (ano).

---

## 6. Engine de Benefícios (planejada)
- Pontos/cashback para marketplace/parceiros.
- Integração permitida: parte do gasto no social pode virar cashback (benefícios).

---

## 7. Privacidade e LGPD (princípios)
- Menores: acesso sempre por papel e vínculo (RLS).
- Consentimento parental para coleta sensível e uso de imagem.
- Direito ao esquecimento: anonimização de dados pessoais quando aplicável, preservando estatísticas agregadas.

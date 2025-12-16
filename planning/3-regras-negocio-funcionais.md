# 🧠 NextPro - Regras de Negócio e Funcionais

**Versão:** 1.0  
**Data:** 15/12/2025  
**Status:** Aprovado  

---

## 1. Gamificação (Progression System)

### 1.1 Estrutura de Badges (Matriz 50x5)
O sistema suporta medalhas **Verticais** (Categorias) e **Horizontais** (Tiers).

**Categorias Macro (Exemplos):**
1.  **Assiduidade:** "Rato de Treino"
2.  **Artilharia:** "Matador"
3.  **Defesa:** "Paredão"
4.  **Assistência:** "Garçom"
5.  **Fair Play:** "Gentleman"
6.  **Liderança:** "Capitão"
7.  **Evolução:** "Foguete" (Maior ganho de nota no mês)
8.  **Social:** "Influencer" (Likes no feed)
... (Total de 50 categorias planejadas)

**Tiers (Níveis de Medalha):**
- **Tier 1 (Bronze):** Iniciante (Ex: 5 Presenças).
- **Tier 2 (Prata):** Intermediário (Ex: 25 Presenças).
- **Tier 3 (Ouro):** Avançado (Ex: 50 Presenças).
- **Tier 4 (Platina):** Elite (Ex: 100 Presenças).
- **Tier 5 (Diamante):** Lenda (Ex: 200 Presenças).

### 1.2 XP e Níveis (Leveling)
Cada ação gera XP para o Atleta.
- **Presença Confirmada:** +10 XP
- **Destaque Positivo no Treino:** +50 XP
- **Badge Desbloqueada:** +100 XP * Tier
- **Tarefa de Casa (Vídeo Aula):** +20 XP

**Curva de Nível:** Exponencial.
- Nível 1 -> 2: 100 XP
- Nível 2 -> 3: 250 XP
- ...

---

## 2. Sistema de Avaliação (Scouting Intelligence)

### 2.1 Avaliação Diária (Micro-Feedback)
Para não sobrecarregar o técnico.
- **Input:** Lista de chamada.
- **Ação:** Técnico seleciona até 3 "Destaques Positivos" e até 3 "Pontos de Atenção".
- **Orçamento:** O técnico tem um "budget" de pontos. Ele não pode dar destaque para todos. Isso garante escassez e valor.

### 2.2 Avaliação Mensal (Deep Dive)
Uma vez por mês, o técnico preenche a **Ficha Técnica Completa** (40 critérios).
- **Escala:** 1 a 5 (Estrelas) ou 0 a 100 (Score).
- **Algoritmo de Normalização (Curva de Gauss):**
    - O sistema analisa a média de notas dadas pelo técnico.
    - Se o técnico dá "10" para todos, o sistema entende que "10" vale "Médio".
    - O Score Final do atleta é ajustado comparativamente à turma e à rede.
    - *Objetivo:* Evitar inflação de notas. Um "Score 90" no NextPro deve ser raríssimo.

### 2.3 Reset de Temporada
- Todo dia **1º de Janeiro**, o Score de Temporada reseta.
- O Histórico fica salvo como "Temporada 2025", "Temporada 2026".
- As Badges de conquista (ex: "Artilheiro 2025") permanecem no perfil como troféus.

---

## 3. Regras Financeiras e Bloqueio

### 3.1 Status Financeiro
Todo atleta tem um campo `financial_status`:
- `active`: Pagamento em dia. Acesso total.
- `warning`: Atraso < 15 dias. Acesso total + Aviso visual ("Regularize sua mensalidade").
- `blocked`: Atraso > 15 dias (configurável).

### 3.2 O "Kill Switch" (Bloqueio Total)
Quando `status == blocked`:
1.  **Atleta:** Não consegue fazer check-in (não ganha presença/XP). App mostra tela de bloqueio.
2.  **Responsável:** Acesso restrito apenas à tela de Pagamento/Financeiro.
3.  **Fans/Convidados:** Perdem acesso ao feed do atleta.
4.  **Recuperação:** Assim que o pagamento é baixado (SchoolAdmin dá baixa ou Webhook do Gateway), o acesso volta instantaneamente.

---

## 4. Privacidade e LGPD

### 4.1 Consentimento Parental
- O cadastro do menor de idade **EXIGE** vínculo com um CPF de maior responsável.
- O Responsável deve marcar checkboxes granulares:
    - [x] Aceito os Termos de Uso.
    - [x] Autorizo a coleta de dados de saúde (peso, altura) para fins esportivos.
    - [x] Autorizo o uso da imagem do meu filho em materiais da escolinha.
    - [x] Autorizo a visibilidade de dados técnicos para Scouts parceiros (Opcional).

### 4.2 Direito ao Esquecimento
- Se o pai solicitar exclusão, os dados pessoais são anonimizados (`Atleta #12345`), mas os dados estatísticos (gols, presença) são mantidos para não quebrar o histórico da turma.

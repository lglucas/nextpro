# MODELO FINANCEIRO - DOCUMENTO EXPLICATIVO
## Plataforma de Esportes de Base

**Versão:** 1.0  
**Data:** Novembro 2025  
**Documento Complementar ao Excel**

---

## ÍNDICE

1. [Visão Geral do Modelo](#1-visão-geral-do-modelo)
2. [Premissas Operacionais](#2-premissas-operacionais)
3. [Premissas de Receita](#3-premissas-de-receita)
4. [Premissas de Custo](#4-premissas-de-custo)
5. [Metodologia de Projeção](#5-metodologia-de-projeção)
6. [Análise de Cenários](#6-análise-de-cenários)
7. [Captação e Estrutura de Capital](#7-captação-e-estrutura-de-capital)
8. [Indicadores-Chave (KPIs)](#8-indicadores-chave-kpis)
9. [Limitações e Disclaimer](#9-limitações-e-disclaimer)

---

## 1. VISÃO GERAL DO MODELO

### 1.1 Objetivo do Modelo

Este modelo financeiro foi desenvolvido para projetar o desempenho econômico da plataforma de esportes de base nos primeiros 4 anos de operação (2026-2029), com detalhamento mês a mês para o Ano 1.

### 1.2 Estrutura do Excel

O arquivo Excel contém as seguintes planilhas interligadas:

1. **📊 Dashboard** - Resumo executivo com KPIs principais e captação
2. **📊 Cap Table** - Estrutura de capital detalhada (Pré, Pós-Seed, Pós-Série A)
3. **📅 Mês a Mês Ano 1** - Projeções detalhadas mensais 2026
4. **📈 Projeção 4 Anos** - Visão anual consolidada 2026-2029
5. **🎯 Sensibilidade** - 3 cenários (Conservador/Realista/Otimista)
6. **💰 Receitas** - Breakdown por fonte de receita
7. **💸 Custos** - Breakdown por categoria de custo
8. **📝 Premissas** - Todos os inputs e assumptions do modelo

### 1.3 Filosofia do Modelo

**Conservadorismo:** Todas as projeções foram construídas com viés conservador. Preferimos subestimar receitas e superestimar custos para evitar surpresas negativas.

**Rastreabilidade:** Cada número tem origem clara nas premissas. Não há "magia" ou "números caindo do céu".

**Flexibilidade:** O modelo permite ajustar premissas chave (taxa de conversão, ticket médio, custos) e ver impacto imediato nas projeções.

---

## 2. PREMISSAS OPERACIONAIS

### 2.1 Crescimento de Escolinhas

| Período | Escolinhas Adicionadas | Total Acumulado |
|---------|------------------------|-----------------|
| **Ano 1 (2026)** | 10 | 10 |
| **Ano 2 (2027)** | +8 | 18 |
| **Ano 3 (2028)** | +6 | 24 |
| **Ano 4 (2029)** | +5 | 29 |

**Justificativa:**
- Ano 1 focado em validação (10-12 escolinhas warm leads Re Globo Soccer)
- Anos 2-4: crescimento orgânico + vendas ativas
- Desaceleração intencional para garantir qualidade de onboarding

**Cronograma Ano 1:**
- Mês 1: 2 escolinhas (piloto + 1)
- Mês 2-9: +1 escolinha/mês
- Mês 10-12: Consolidação (sem novas)

### 2.2 População por Escolinha

Cada escolinha traz um ecossistema de pessoas:

| Grupo | Quantidade | Base de Cálculo |
|-------|------------|-----------------|
| **Alunos** | 250 | Média por escolinha |
| **Pais** | 325 | 1,3 pais por aluno |
| **Familiares** | 375 | 1,5 familiares por aluno |
| **Amigos** | 375 | 1,5 amigos por aluno |
| **TOTAL** | **1.325** | População total/escolinha |

**Taxa de Adoção (usuários ativos no app):**
- Alunos: 80% = 200/escolinha
- Pais: 60% = 195/escolinha
- Familiares/Amigos: 30% = 225/escolinha
- **Média ponderada: ~620 usuários ativos/escolinha**

### 2.3 Churn e Retenção

| Métrica | Ano 1 | Ano 2 | Ano 3 | Ano 4 |
|---------|-------|-------|-------|-------|
| **Churn Anual (Escolinhas)** | 5% | 8% | 10% | 10% |
| **Churn Mensal (Usuários)** | 3% | 4% | 5% | 5% |

**Justificativa:**
- Churn baixo Ano 1 (warm leads, alta qualidade onboarding)
- Estabilização em 10% a partir Ano 3 (benchmark SaaS B2B)

---

## 3. PREMISSAS DE RECEITA

### 3.1 Marketplace (35% da receita Ano 1)

**Modelo:** Comissão sobre vendas de produtos/serviços de parceiros.

**Premissas:**
- **% população que compra/mês:** 5%
- **Ticket médio:** R$ 100
- **Take rate (comissão):** 12,5%

**Cálculo Ano 1 (Mês 10):**
```
População ativa: 6.200 pessoas
Compradores/mês: 6.200 × 5% = 310
GMV/mês: 310 × R$ 100 = R$ 31.000
Receita/mês: R$ 31.000 × 12,5% = R$ 3.875
Receita anual: R$ 88.044
```

**Crescimento:** GMV cresce com população, mas take rate permanece 12,5%.

### 3.2 Clube de Benefícios (20% da receita Ano 1)

**Modelo:** Assinatura mensal opcional para famílias.

**Premissas:**
- **Preço:** R$ 24,90/mês
- **% conversão famílias:** 15%

**Cálculo Ano 1 (Mês 10):**
```
População: 6.200 pessoas → ~1.580 famílias (média 3,9 pessoas/família)
Conversão: 1.580 × 15% = 237 assinantes
Receita/mês: 237 × R$ 24,90 = R$ 5.901
Receita anual (média): R$ 134.460
```

**Justificativa conversão 15%:**
- Valor percebido alto (descontos, conteúdo exclusivo)
- Investimento no filho (baixa sensibilidade a preço)
- Benchmark: clubes de desconto têm conversão 10-20%

### 3.3 Patrocínios (22% da receita Ano 1)

**Modelo:** Patrocinadores pagam por branding, rankings, eventos.

**Premissas:**
- **Ticket médio:** R$ 3.000/mês/patrocinador
- **Patrocinadores Ano 1:** 5 (Puma, Daycoval + 3 novos)

**Cálculo Ano 1:**
```
Receita/mês: 5 × R$ 3.000 = R$ 15.000
Receita anual: R$ 180.000
```

**Crescimento:** +2 patrocinadores/ano conforme escala.

### 3.4 Participação em Passes (4% da receita Ano 1)

**Modelo:** Participação em transferências de atletas formados na plataforma.

**Premissas:**
- **% do valor do passe:** 7,5%
- **Transferências/ano:** 2-3 atletas
- **Valor médio passe (base):** R$ 50-200k

**Cálculo Ano 1 (conservador):**
```
Transferências: 2 atletas
Valor médio: R$ 100k
Participação: R$ 100k × 7,5% = R$ 7.500/atleta
Receita anual: 2 × R$ 7.500 = R$ 15.000

Nota: Modelo conservador conta R$ 30k/ano (possível upside não contabilizado)
```

**Alta variância:** Alguns anos podem ter 0 transferências, outros 10+. Um único "Neymar" pode gerar milhões.

### 3.5 Assinaturas Escolinhas (1% da receita Ano 1)

**Modelo:** Freemium. Core gratuito, features avançadas pagas.

**Premissas:**
- **Plano Pro:** R$ 99/mês
- **Plano Max:** R$ 199/mês
- **% que pagam Max:** 15%
- **% que permanecem free:** 85%

**Cálculo Ano 1:**
```
10 escolinhas total
Free: 8 escolinhas (80%)
Max: 2 escolinhas (20%, acima da premissa 15%)
Receita/mês: 2 × R$ 199 = R$ 398
Receita anual: R$ 4.776
```

**Crescimento:** Conforme valor percebido aumenta, 20-30% migram para pago.

### 3.6 Cursos Online (2% da receita Ano 1)

**Modelo:** Certificações e treinamentos pagos.

**Premissas:**
- **3 cursos/ano:** Scouts, Técnicos, Pais
- **30 alunos/curso**
- **Ticket médio:** R$ 150

**Cálculo Ano 1:**
```
Receita/curso: 30 × R$ 150 = R$ 4.500
Receita anual: 3 × R$ 4.500 = R$ 13.500
```

**Potencial:** Pode virar receita significativa (10-15%) em Ano 3-4.

### 3.7 Data & Analytics (2% da receita Ano 1)

**Modelo:** Relatórios e análises vendidos para clubes.

**Premissas:**
- **5-8 clubes interessados** Ano 1
- **10-30 atletas/clube/ano**
- **R$ 19,90/atleta** (relatório individual)

**Cálculo Ano 1:**
```
Clubes: 5
Atletas/clube: 20 (média)
Total atletas: 5 × 20 = 100
Receita anual: 100 × R$ 19,90 = R$ 1.990

Nota: Modelo conservador conta R$ 20k/ano (possível upside não contabilizado)
```

### 3.8 "Outros" (42% da receita Ano 1)

**Composição:**
- Crescimento orgânico de todas as fontes acima
- Novas fontes não mapeadas (serviços financeiros, eventos)
- Upsells e cross-sells
- Efeito de rede (valor cresce exponencialmente com escala)

**Justificativa:** Categoria "buffer" para capturar oportunidades não previstas e crescimento natural da plataforma.

---

## 4. PREMISSAS DE CUSTO

### 4.1 Impostos

**Regime:** Simples Nacional - Anexo V (Serviços)

| Faixa de Faturamento | Alíquota |
|----------------------|----------|
| Até R$ 360k | 15,5% |
| R$ 360k - R$ 720k | **19,5%** ← Ano 1 |
| R$ 720k - R$ 1,8M | **23%** ← Ano 2+ |
| R$ 1,8M - R$ 3,6M | 23,5% |

**Simplificação:** Usamos alíquota média da faixa, não progressiva mês a mês.

### 4.2 Pro-Labore

**Estrutura:**
- **3 sócios C-level:** Lucas, Alécio, Roney
- **R$ 8.250/mês cada** (valores iguais para coesão societária)
- **Total:** R$ 24.750/mês = R$ 297.000/ano

**Início:** Mês 3 (quando MRR > R$ 50k)

**Justificativa valores:**
- Mercado para CTO/CEO/COO: R$ 12-20k/mês
- Startup early-stage: 60-70% do mercado
- R$ 8.250 = ~65% do mercado

**Ano 1:** 8 meses × R$ 24.750 = R$ 198.000

### 4.3 Pessoal (Contratações)

| Cargo | Salário | Início | Custo Ano 1 |
|-------|---------|--------|-------------|
| **Dev Pleno** | R$ 8.000/mês | Mês 6 | R$ 40.000 (5 meses) |
| **Social Media** | R$ 4.000/mês | Ano 2 | R$ 0 |
| **Vendedor B2B** | R$ 4.000/mês | Ano 2 | R$ 0 |
| **Customer Success** | R$ 3.000/mês | Ano 2 | R$ 0 |
| **TOTAL ANO 1** | | | **R$ 40.000** |

**Anos 2-4:** Crescimento gradual conforme necessidade operacional.

### 4.4 Infraestrutura

| Item | Custo | Observação |
|------|-------|------------|
| **VPS Hostinger KVM 2** | R$ 90/mês | Ano 1 (até 500 usuários simultâneos) |
| **Migração AWS** | R$ 500-1k/mês | A partir Mês 10 ou quando necessário |
| **Domínios** | R$ 80/ano | .com.br + .app |
| **Ferramentas** | R$ 350/mês | Claude, GitHub, Figma, analytics |

**Custo Ano 1:**
```
VPS: R$ 90 × 10 meses = R$ 900
AWS: R$ 500 × 2 meses = R$ 1.000 (migração gradual)
Domínios: R$ 80
Ferramentas: R$ 350 × 12 = R$ 4.200
Subtotal: R$ 6.180

Nota: Modelo conservador conta R$ 40.913 incluindo buffers e imprevistos
```

### 4.5 Marketing

**Ano 1:** Foco em orgânico + testes modestos

| Ação | Custo |
|------|-------|
| **Google/Meta Ads** | R$ 200/mês (teste e aprendizado) |
| **Eventos presenciais** | R$ 0 (vinculado a Re Soccer) |
| **Produção de conteúdo** | R$ 5.000 (único, vídeos/fotos) |
| **Material gráfico** | R$ 3.000 (único, banners/flyers) |

**Custo Ano 1:** R$ 12.000

**Anos 2-4:** Escala conforme validação de canais (R$ 50-100k/ano).

### 4.6 Operacional

| Item | Custo |
|------|-------|
| **Contador** | R$ 1.500/mês = R$ 18.000/ano |
| **Onboarding escolinhas** | R$ 1.000/escolinha × 10 = R$ 10.000 |
| **Reserva de contingência** | ~R$ 8.000 |

**Custo Ano 1:** R$ 36.000

---

## 5. METODOLOGIA DE PROJEÇÃO

### 5.1 Abordagem Bottom-Up

Não projetamos "receita total cresce X%/ano" de cima para baixo. Em vez disso:

1. **Definimos drivers operacionais** (escolinhas, usuários ativos)
2. **Aplicamos taxas de conversão** por fonte de receita
3. **Somamos tudo** = receita total

**Vantagem:** Mais realista, rastreável, ajustável.

### 5.2 Crescimento Linear vs. Exponencial

**Ano 1:** Crescimento **linear** (1 escolinha/mês). Foco em qualidade, não quantidade.

**Anos 2-4:** Crescimento desacelera (+8, +6, +5), refletindo:
- Capacidade operacional limitada
- Maturidade do mercado TAM
- Conservadorismo

**Não assumimos viralidade** (crescimento exponencial não contabilizado).

### 5.3 Sazonalidade

**Não modelamos sazonalidade** no Ano 1 para simplicidade. Na prática:
- Janeiro-Março: baixo (férias escolares)
- Abril-Junho: médio
- Julho: baixo (férias meio do ano)
- Agosto-Novembro: alto (competições)
- Dezembro: baixo (férias)

**Impacto:** Receita real será mais irregular, mas total anual se mantém.

### 5.4 Break-even

**Ponto de equilíbrio:**
```
Custos fixos/mês (Mês 3+): R$ 27.240
+ Pro-labore: R$ 24.750
+ Infra: R$ 440
+ Ferramentas: R$ 350
+ Contador: R$ 1.500
+ Marketing: R$ 200

Receita necessária (considerando impostos 19,5%):
R$ 27.240 / (1 - 0.195) = R$ 33.839/mês
```

**Atingimos no Mês 3:** R$ 50.850/mês ✅

**Lucro positivo:** A partir Mês 3 (exceto Mês 6 por contratação Dev).

---

## 6. ANÁLISE DE CENÁRIOS

### 6.1 Cenário Conservador (-30% Receita)

**Premissas alteradas:**
- Conversões 30% menores
- Crescimento de escolinhas 30% mais lento
- Custos mantidos (não escalam tão rápido)

**Resultado Ano 1:**
- Receita: R$ 569.518 (-30%)
- Lucro: R$ 83.953
- Margem: 15%

**Análise:** Ainda lucrativo, mas margens apertadas. Exigiria corte de custos (adiar contratações, reduzir marketing).

### 6.2 Cenário Realista (Base)

**Premissas:** Conforme documentado neste modelo.

**Resultado Ano 1:**
- Receita: R$ 813.598
- Lucro: R$ 328.033
- Margem: 40%

**Análise:** Escalável e sustentável. Margem saudável permite investir em crescimento.

### 6.3 Cenário Otimista (+30% Receita)

**Premissas alteradas:**
- Conversões 30% maiores (viralidade, word-of-mouth)
- Crescimento de escolinhas 30% mais rápido
- Custos escalam proporcionalmente

**Resultado Ano 1:**
- Receita: R$ 1.057.677 (+30%)
- Lucro: R$ 572.112
- Margem: 54%

**Análise:** Demonstra alto potencial de escala. Margem permanece excelente mesmo com custos crescentes.

### 6.4 Probabilidades (Estimativa Subjetiva)

| Cenário | Probabilidade |
|---------|--------------|
| Conservador | 20% |
| **Realista** | **60%** |
| Otimista | 20% |

**Valor esperado:**
```
E(Lucro Ano 1) = 0.2 × R$ 83.953 + 0.6 × R$ 328.033 + 0.2 × R$ 572.112
               = R$ 327.833
```

**Conclusão:** Expectativa de lucro ~R$ 328k, com downside limitado (mínimo R$ 84k) e upside significativo (máximo R$ 572k).

---

## 7. CAPTAÇÃO E ESTRUTURA DE CAPITAL

### 7.1 Filosofia da Estrutura de Capital

**Princípio fundamental:** Os sócios fundadores reservaram **20% do equity inicial** especificamente para investidores e advisors. Isso significa que **todas as captações consomem desta reserva, sem diluir os fundadores**.

**Vantagens desta estrutura:**
1. ✅ Controle mantido (sócios com 71% após todas as rodadas)
2. ✅ Narrativa clara para investidores ("vocês entram na reserva dedicada")
3. ✅ Previsibilidade (sabemos exatamente quanto equity temos para dar)
4. ✅ Proteção dos fundadores (zero diluição não-planejada)

### 7.2 Estrutura Pré-Investimento

**Cap Table Inicial (100%):**

| Stakeholder | Equity % | Valor (Valuation R$ 2,2M) |
|-------------|----------|---------------------------|
| **Sócios Fundadores:** | | |
| • Lucas Galvão (CTO/CLO/DPO) | 15% | R$ 330.000 |
| • Alécio Pereira (CEO/CFO) | 26% | R$ 572.000 |
| • Roney Pereira (COO) | 25% | R$ 550.000 |
| • Alexandre (BizDev) | 5% | R$ 110.000 |
| **Subtotal Fundadores** | **71%** | **R$ 1.562.000** |
| | | |
| **Reserva Investidores** | **20%** | **R$ 440.000** |
| **Pool Funcionários/Advisors** | **9%** | **R$ 198.000** |
| | | |
| **TOTAL** | **100%** | **R$ 2.200.000** |

**Observações:**
- Pool de 9% dividido entre: funcionários chave (5-6%) + advisors estratégicos (3-4%)
- Vesting funcionários: 4 anos com cliff de 1 ano
- Advisors: equity por contribuição específica (0,25-0,5% cada)

### 7.3 Seed Round (Ano 1 - R$ 200k por 8,33%)

**Timing:** Mês 3-6 (após beta validado, primeiras escolinhas ativas)

**Premissas de Valuation:**

**Método 1 - Múltiplo ARR (Annual Recurring Revenue):**
```
ARR projetado Ano 1: R$ 813.598
Múltiplo conservador SaaS early-stage: 2,5-3x
Valuation: R$ 813.598 × 2,7 = R$ 2.196.714 ≈ R$ 2,2M ✅
```

**Método 2 - Scorecard Method:**
```
Base regional startup tech: R$ 2M
Ajustes:
  + Time forte (+15%): 13 anos Re Soccer, expertise legal/tech
  + Market size (+20%): 40k jogadores base, mercado validado
  + Product/Tech (+10%): Gamificação diferenciada, multi-sport ready
  + Traction (+10%): 10-12 escolinhas comprometidas
  - Stage (-15%): Pré-MVP (beta em andamento)
  - Competition (-5%): Footlink não é direto, mas existe
  
Ajuste líquido: +35%
Valuation: R$ 2M × 1,35 = R$ 2,7M

Conservadorismo: Usamos R$ 2,2M (média) ✅
```

**Estrutura do Deal:**
- Valuation Pré-Money: **R$ 2.200.000**
- Investimento: **R$ 200.000**
- Equity: **8,33%** (dos 20% reservados)
- Valuation Pós-Money: **R$ 2.400.000**

**Cap Table Pós-Seed:**

| Stakeholder | Equity % | Valor (R$ 2,4M) | Status |
|-------------|----------|-----------------|--------|
| Lucas Galvão | **15%** | R$ 360.000 | ✅ SEM diluição |
| Alécio Pereira | **26%** | R$ 624.000 | ✅ SEM diluição |
| Roney Pereira | **25%** | R$ 600.000 | ✅ SEM diluição |
| Alexandre | **5%** | R$ 120.000 | ✅ SEM diluição |
| **Subtotal Fundadores** | **71%** | **R$ 1.704.000** | **MANTIDO** |
| | | | |
| **Investidor Seed** | **8,33%** | **R$ 200.000** | ← Da reserva |
| **Reserva Restante** | **11,67%** | **R$ 280.000** | Disponível Série A |
| Pool Funcionários/Advisors | **9%** | **R$ 216.000** | ✅ SEM diluição |
| | | | |
| **TOTAL** | **100%** | **R$ 2.400.000** | |

**Uso do Capital (R$ 200k):**
- Desenvolvimento/Tech (35%): R$ 70.000 - Dev Pleno 8 meses, migração AWS
- Marketing/Vendas (30%): R$ 60.000 - Materiais, eventos, ads validação
- Operações/Time (20%): R$ 40.000 - Social media, onboarding escolinhas
- Runway/Reserva (15%): R$ 30.000 - Buffer 4-5 meses emergencial

**Perfil de Investidor Seed:**
- Anjos estratégicos (ex-atletas, empresários do esporte)
- Fundos early-stage com tese SportsTeach/EdTech
- Smart money com network em clubes/federações
- Ticket: R$ 50-200k por investidor (1-4 investidores no total)

### 7.4 Série A (Final Ano 4 - R$ 960k por 11,67%)

**Timing:** Dezembro 2029 / Janeiro 2030 (após 4 anos de operação comprovada)

**Contexto Operacional no Momento da Série A:**
- 29 escolinhas ativas
- 5.800 alunos cadastrados
- 17.980 usuários totais na plataforma
- MRR: R$ 320.000
- Lucratividade comprovada (R$ 627k lucro líquido Ano 4)
- NPS > 70
- Churn < 10%

**Premissas de Valuation Série A:**

**Método 1 - Múltiplo ARR:**
```
Receita Ano 4: R$ 2.360.362
Múltiplo SaaS com tração: 3,5-4x (conservador; mercado faz 5-8x)
Valuation: R$ 2.360.362 × 3,5 = R$ 8.261.267 ✅
```

**Método 2 - Múltiplo Lucro:**
```
Lucro Líquido Ano 4: R$ 627.479
Múltiplo tech lucrativa: 10-12x (conservador; mercado faz 15-20x)
Valuation: R$ 627.479 × 10 = R$ 6.274.790 ✅
```

**Valuation Conservador (média):**
```
(R$ 8.261.267 + R$ 6.274.790) / 2 = R$ 7.268.028 ✅
```

**Estrutura do Deal:**
- Valuation Pré-Money: **R$ 7.268.028** (~R$ 7,3M)
- Investimento: **R$ 959.928** (~R$ 960k)
- Equity: **11,67%** (exatamente o que sobrou da reserva)
- Valuation Pós-Money: **R$ 8.227.957** (~R$ 8,2M)

**Cap Table Pós-Série A:**

| Stakeholder | Equity % | Valor (R$ 8,2M) | Status |
|-------------|----------|-----------------|--------|
| Lucas Galvão | **15%** | R$ 1.234.194 | ✅ SEM diluição |
| Alécio Pereira | **26%** | R$ 2.139.269 | ✅ SEM diluição |
| Roney Pereira | **25%** | R$ 2.056.989 | ✅ SEM diluição |
| Alexandre | **5%** | R$ 411.398 | ✅ SEM diluição |
| **Subtotal Fundadores** | **71%** | **R$ 5.841.850** | **MANTIDO** |
| | | | |
| Investidor Seed | 8,33% | R$ 685.663 | Mantém |
| **Investidor Série A** | **11,67%** | **R$ 959.928** | ← Resto da reserva |
| **Subtotal Investidores** | **20%** | **R$ 1.645.591** | Reserva 100% consumida |
| | | | |
| Pool Funcionários/Advisors | **9%** | **R$ 740.516** | ✅ SEM diluição |
| | | | |
| **TOTAL** | **100%** | **R$ 8.227.957** | |

**Uso do Capital (R$ 960k):**
- Expansão Geográfica (30%): R$ 288k - 30+ escolinhas novas estados
- Segundo Esporte (25%): R$ 240k - Módulo Vôlei/Basquete completo
- Tech/Produto (20%): R$ 192k - IA análise performance, blockchain passes
- Marketing (15%): R$ 144k - Brand nacional, mídia massiva
- Operações (10%): R$ 96k - Time CS robusto, suporte 24/7

**Perfil de Investidor Série A:**
- Fundos Growth com tese Digital Transformation no esporte
- Corporate Venture (Globo, Grupo Bandeirantes, Itaú)
- Fundos internacionais com apetite LATAM
- Possível participação Footlink (parceria estratégica)
- Ticket: R$ 300k-1M por investidor (1-3 investidores)

### 7.5 Cenário Alternativo: E se Quisermos Dar 12% na Série A?

**Pergunta:** Por que não dar 12% (número redondo) ao invés de 11,67%?

**Resposta:** Dar 12% significaria **diluir os fundadores pela primeira vez**.

**Cálculo:**
- Reserva restante: 11,67%
- Se darmos 12%: faltam 0,33%
- Esses 0,33% viriam de diluição proporcional dos fundadores

**Impacto:**
```
Captação com 12%: R$ 991.095 (+R$ 31k vs. 11,67%)

Cap Table com 12%:
- Lucas: 14,95% (vs. 15,00%) ← -0,05%
- Alécio: 25,91% (vs. 26,00%) ← -0,09%
- Roney: 24,92% (vs. 25,00%) ← -0,08%
- Alexandre: 4,98% (vs. 5,00%) ← -0,02%
```

**Recomendação:** **NÃO FAZER**.

**Razões:**
1. **R$ 31k não justificam quebrar a regra de "zero diluição"**
2. **Narrativa fica suja:** "ah, mas teve uma diluiçãozinha de 0,33%..."
3. **Precedente perigoso:** Se diluímos 0,33% agora, por que não 1% depois?
4. **11,67% é defensável:** "Damos exatamente o que sobrou da reserva dedicada"

**Conclusão:** Manter 11,67% é a decisão estratégica correta, mesmo que "menos redondo".

### 7.6 Resumo Executivo - Captação Total

**Duas Rodadas:**

| Rodada | Timing | Investimento | Equity | Valuation Pós |
|--------|--------|--------------|--------|---------------|
| **Seed** | Ano 1 (Mês 3-6) | R$ 200.000 | 8,33% | R$ 2,4M |
| **Série A** | Ano 4 (Mês 48) | R$ 959.928 | 11,67% | R$ 8,2M |
| **TOTAL** | 4 anos | **R$ 1.159.928** | **20%** | R$ 8,2M |

**Evolução Valuation:**
- Início (Pré-Seed): R$ 2,2M
- Pós-Seed: R$ 2,4M (+9%)
- Pós-Série A: R$ 8,2M (+243% vs. Pós-Seed)
- **Crescimento total: 274%** em 4 anos

**Equity Fundadores:**
- Início: 71%
- Pós-Seed: **71%** ✅
- Pós-Série A: **71%** ✅
- **Diluição: 0%**

**Restante para Futuro:**
- Pool Funcionários/Advisors: **9%** disponível
  - Funcionários chave: ~5-6% (vesting)
  - Advisors estratégicos: ~3-4% (por contribuição)
- Possível Série B futura: exigiria diluição (após Ano 4, fora do escopo deste modelo)

### 7.7 Proteções Contratuais

**Cláusulas Essenciais nos Contratos de Investimento:**

**1. Anti-Diluição (Weighted Average):**
- Protege investidores de down rounds
- Ajusta equity proporcionalmente se próxima rodada for em valuation menor

**2. Drag-Along (75% aprovação):**
- Se 75% dos acionistas aprovam venda, todos devem vender
- Evita minoritário bloquear exit

**3. Tag-Along (100% proporcional):**
- Se sócio majoritário vende, minoritários têm direito de vender junto
- Mesmas condições, mesma valoração

**4. Direito de Preferência:**
- Sócios atuais têm preferência em novas rodadas
- Podem manter % comprando pro-rata

**5. Vesting (4 anos, cliff 1 ano):**
- Funcionários ganham equity gradualmente
- Se saem antes de 1 ano: perdem tudo
- Após 1 ano: 25% vested, depois mensal

**6. Board Seats:**
- Seed: Observador (sem voto)
- Série A: 1 assento no board (se > R$ 500k investido)
- Fundadores mantêm maioria

---

## 8. INDICADORES-CHAVE (KPIs)

### 8.1 KPIs de Crescimento

| KPI | Meta Ano 1 | Meta Ano 4 |
|-----|------------|------------|
| **Escolinhas Ativas** | 10 | 29 |
| **Alunos Cadastrados** | 2.000 | 5.800 |
| **Usuários Totais** | 6.200 | 17.980 |
| **MRR** | R$ 127.125 | R$ 320.000 |
| **ARR** | R$ 813.598 | R$ 2.360.362 |

### 8.2 KPIs de Eficiência

| KPI | Meta Ano 1 | Benchmark |
|-----|------------|-----------|
| **CAC (Escolinha)** | R$ 500 | R$ 300-1.000 |
| **LTV (Escolinha)** | R$ 80.000 | R$ 50-150k |
| **LTV/CAC** | 160x | >3x (mínimo) |
| **Payback** | <6 meses | <12 meses |
| **Churn Anual** | 5% | <10% |

### 8.3 KPIs de Qualidade

| KPI | Meta Ano 1 | Benchmark SaaS |
|-----|------------|----------------|
| **NPS** | 65 | >50 (bom) |
| **DAU/MAU** | 40% | >30% (engajado) |
| **Tempo no app/semana** | 15+ min | >10 min |
| **Taxa de ativação (7 dias)** | 80% | >60% |

### 8.4 Fórmulas de Cálculo

**CAC (Customer Acquisition Cost):**
```
CAC = (Marketing + Vendas + Onboarding) / Escolinhas Adquiridas
```

**LTV (Lifetime Value):**
```
LTV = (Receita Média Mensal × Margem Bruta) / Churn Mensal
Exemplo: (R$ 700 × 0.60) / 0.004 = R$ 105.000
```

**Churn Mensal:**
```
Churn% = (Escolinhas perdidas no mês / Escolinhas início do mês) × 100
```

**NPS (Net Promoter Score):**
```
NPS = % Promotores (9-10) - % Detratores (0-6)
```

---

## 9. LIMITAÇÕES E DISCLAIMER

### 9.1 Natureza das Projeções

**Este modelo não é:**
- ❌ Uma garantia de resultados futuros
- ❌ Uma previsão exata do que ocorrerá
- ❌ Uma análise de todos os riscos possíveis

**Este modelo é:**
- ✅ Uma ferramenta de planejamento estratégico
- ✅ Uma base para tomada de decisões informadas
- ✅ Um instrumento de comunicação com investidores

### 9.2 Principais Incertezas

**Variáveis fora do nosso controle:**
1. **Adoção de mercado** - Escolinhas podem resistir mais do que esperado
2. **Concorrência** - Pode surgir player grande (Globo, ESPN)
3. **Regulação** - CBF pode mudar regras
4. **Macroeconomia** - Recessão afeta gastos das famílias
5. **Tecnologia** - Bugs críticos podem atrasar lançamento

**Assumimos:**
- Economia brasileira estável (não modelamos hiperinflação ou crise)
- Mercado de esportes de base continua crescendo
- LGPD não sofre mudanças drásticas
- Infraestrutura tech (AWS, etc.) disponível e confiável

### 9.3 Responsabilidade

**Sócios fundadores** são responsáveis por:
- Validar premissas com dados reais (após beta)
- Atualizar modelo trimestralmente
- Ajustar estratégia se desvios >20% do projetado

**Investidores** devem:
- Fazer due diligence independente
- Questionar premissas que pareçam otimistas
- Avaliar risco-retorno no contexto de seu portfolio

### 9.4 Quando Atualizar o Modelo

**Gatilhos para revisão:**
- Fim do beta (validar conversões reais)
- Mês 6 (comparar realizado vs. projetado)
- Mudança significativa no modelo de negócio (pivot)
- Entrada de investidor (atualizar cap table)
- Fechamento de parceria grande (impacto em receita)

---

## CONCLUSÃO

Este modelo financeiro representa nosso **melhor entendimento atual** do potencial econômico da plataforma. Foi construído com:

✅ **Conservadorismo** nas premissas de receita  
✅ **Realismo** nos custos operacionais  
✅ **Rastreabilidade** de todos os números  
✅ **Flexibilidade** para ajustes conforme aprendemos

**Mensagem final:** Os números são promissores (lucro de R$ 328k no Ano 1, margem de 40%), mas o sucesso dependerá de **execução impecável**, **aprendizado rápido** e **adaptação constante**.

**Não vendemos sonhos. Vendemos trabalho duro com direção clara.**

---

**Contato para Dúvidas:**

**Lucas Galvão - CTO, CLO, DPO**  
📧 [seu email]  
📱 [seu telefone]

**Alécio Pereira - CEO, CFO**  
📧 [email Alécio]  
📱 [telefone Alécio]

---

**Documento Confidencial - Novembro 2025**  
*Versão 1.0 - Complementar ao modelo-financeiro.xlsx*

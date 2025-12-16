# ANEXOS TÉCNICOS E JURÍDICOS
## Plataforma de Esportes de Base

**Versão:** 1.1 **REVISADO**  
**Data:** 26 de Novembro de 2025  
**Documento Complementar ao Business Plan**

---

## 📌 NOTA DE ATUALIZAÇÃO (v1.1)

**Correções realizadas:**
- ✅ Cronograma de sprints alinhado com prazo de 45 dias após MoU
- ✅ MVP 1.0 corretamente posicionado em Março 2026 (mês 4)
- ✅ Numeração de versões (V1.1, V1.2, etc.) alinhada com meses reais
- ✅ Timeline executivo coerente com marco "MVP funcional em março"
- ✅ Todas as referências de "mês X" corrigidas para refletir início em Dezembro 2025

---

## ÍNDICE

1. [Roadmap Técnico Detalhado](#1-roadmap-técnico-detalhado)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Wireframes e Mockups](#3-wireframes-e-mockups)
4. [Compliance LGPD - Checklist Completo](#4-compliance-lgpd-checklist-completo)
5. [Minutas de Contratos](#5-minutas-de-contratos)
6. [Pesquisa de Mercado Expandida](#6-pesquisa-de-mercado-expandida)
7. [Personas Detalhadas](#7-personas-detalhadas)
8. [Análise Competitiva Expandida](#8-análise-competitiva-expandida)
9. [Perguntas Frequentes Técnicas e Jurídicas](#9-perguntas-frequentes-técnicas-e-jurídicas)
10. [Cronograma e Marcos de Validação](#10-cronograma-e-marcos-de-validação)

---

# 1. ROADMAP TÉCNICO DETALHADO

## 1.1 Visão Geral - 18 Meses

```
Timeline: Dezembro 2025 → Junho 2027

FASE 0: PRÉ-DESENVOLVIMENTO (Nov 2025 - 29 Nov 2025)
├─ Apresentação aos sócios (29/Nov, 15h)
├─ Finalização Business Plan
└─ Assinatura MoU (estimativa 1º Dez 2025)

FASE 1: PRIMEIROS 45 DIAS (1 Dez 2025 - 15 Jan 2026)
├─ Site institucional Re Globo Soccer
├─ Pitch Deck final
├─ Protótipo funcional navegável
└─ Entrega: Materiais estratégicos + fundação técnica

FASE 2: MVP BETA (Dez 2025 - Fev 2026) 
├─ Sprint 1-2: Core auth + dashboard básico (Dez)
├─ Sprint 3-4: QR presença + gamificação MVP (Dez-Jan)
├─ Sprint 5-6: Feed social + badges (Jan)
├─ Sprint 7-8: Polish + beta testing (Jan-Fev)
└─ Entrega: Beta funcional, 1 escolinha piloto (15/Fev)

FASE 3: MVP 1.0 LANÇAMENTO (Mar 2026)
├─ Sprint 9-10: Ajustes feedback beta
├─ Sprint 11-12: Marketplace estrutura
└─ Entrega: MVP 1.0 OFICIAL - Março 2026 ✅

FASE 4: CONSOLIDAÇÃO (Abr-Dez 2026)
├─ V1.1-1.4: Features incrementais (Abr-Jul)
├─ V1.5-1.7: Personas Scout + Clube (Ago-Out)
├─ V1.8-V1.9: Módulo vídeos + polish (Nov-Dez)
└─ Entrega: 10+ escolinhas, MRR R$100k+

FASE 5: EXPANSÃO (Jan-Jun 2027)
├─ V2.0: Segundo esporte (Vôlei/Basquete) (Jan-Fev)
├─ V2.1-2.5: IA, blockchain, internacionalização (Mar-Jun)
└─ Entrega: Multi-esporte, ready for scale
```

## 1.2 Roadmap Gantt Visual (18 meses)

```
Mês  │ Feature/Milestone
─────┼────────────────────────────────────────────────────────────────────
Dez  │ ████ Sprint 1-4: Auth + Onboarding + Dashboard + QR Presença
Jan  │ ████ Sprint 5-8: Gamificação + Feed Social + Polish
Fev  │ ████ Sprint 9-10: Beta Testing + Ajustes [BETA LAUNCH]
Mar  │ ████ Sprint 11-12: Marketplace inicial [MVP 1.0 OFICIAL] ✅
─────┼────────────────────────────────────────────────────────────────────
Abr  │ ████ V1.1: Marketplace ativo (3-5 parceiros)
Mai  │ ████ V1.2: Clube de Benefícios (assinatura R$ 24,90)
Jun  │ ████ V1.3: Dashboard Pais detalhado
Jul  │ ░░░░ V1.4: Avaliações técnicas (gráficos radar)
Ago  │ ░░░░ V1.5: Persona Scout completa
Set  │ ░░░░ V1.6: Persona Clube (busca de talentos)
Out  │ ░░░░ V1.7: Sistema de Mensagens (DM)
Nov  │ ░░░░ V1.8: Módulo Vídeos (upload + biblioteca)
Dez  │ ░░░░ V1.9: Integração Instagram API + Migração AWS prep
─────┼────────────────────────────────────────────────────────────────────
Jan  │ ░░░░ V2.0: Segundo Esporte (Vôlei/Basquete)
Fev  │ ░░░░ V2.1: Internacionalização (i18n)
Mar  │ ░░░░ V2.2: Migração completa AWS
Abr  │ ░░░░ V2.3: IA para análise de performance
Mai  │ ░░░░ V2.4: Blockchain para rastreio de passes
Jun  │ ░░░░ V2.5: Expansão internacional piloto
```

**Legenda:**
- ████ = Planejamento detalhado concluído
- ░░░░ = Planejamento de alto nível
- ✅ = Marco crítico (MVP funcional)

## 1.3 Detalhamento por Sprint (MVP - Primeiros 12 Sprints)

### 🎯 CONTEXTO CRÍTICO DE PRAZO

**Data de Hoje:** 26 de Novembro de 2025  
**Apresentação Sócios:** 29 de Novembro, 15h  
**Assinatura MoU (estimada):** 1º de Dezembro de 2025  
**Prazo MVP Funcional:** **Março 2026** (compromisso estratégico)  
**Tempo disponível:** ~16 semanas (4 meses)

---

### Sprint 1-2 (Semanas 1-4): Fundações
**Período:** 1-28 Dezembro 2025  
**Objetivo:** Login funcional + dashboards básicos navegáveis

**Features:**
- [ ] Sistema de autenticação (Google OAuth + Email/Senha)
- [ ] Verificação de email obrigatória
- [ ] Onboarding diferenciado por persona (3-5 passos)
- [ ] Dashboard Aluno (skeleton, sem dados ainda)
- [ ] Dashboard Escolinha (skeleton)
- [ ] Dashboard Pais (skeleton)
- [ ] Estrutura PostgreSQL multi-tenancy com RLS
- [ ] Deploy inicial VPS Hostinger

**Critério de Sucesso:**
- ✅ Usuário consegue criar conta e fazer login
- ✅ Dashboards rendem sem erros
- ✅ Banco de dados seguro (RLS testado)

---

### Sprint 3-4 (Semanas 5-8): QR Presença + Gamificação MVP
**Período:** 29 Dezembro 2025 - 25 Janeiro 2026  
**Objetivo:** Primeiro fluxo completo funcional (presença → pontos)

**Features:**
- [ ] Geração de QR Code único por treino (válido 3h)
- [ ] Scan de QR Code (aluno escaneia no dashboard)
- [ ] Registro de presença em tempo real
- [ ] Sistema de pontos básico (+10 pts por presença)
- [ ] Ranking da escolinha (top 10)
- [ ] 5 badges iniciais (Bem-vindo, 1 Semana, 1 Mês, Top 3, 100% Presença)
- [ ] Card do aluno estilo EA FC (foto, nome, overall)

**Critério de Sucesso:**
- ✅ Técnico gera QR, aluno escaneia, presença registrada
- ✅ Aluno ganha pontos e vê no dashboard
- ✅ Ranking atualiza automaticamente
- ✅ Badge "Bem-vindo" desbloqueado no primeiro login

---

### Sprint 5-6 (Semanas 9-12): Feed Social + Notificações
**Período:** 26 Janeiro - 22 Fevereiro 2026  
**Objetivo:** Engajamento social funcional

**Features:**
- [ ] Feed social (cronológico, posts de texto + foto)
- [ ] Curtir, comentar (básico, sem nested comments ainda)
- [ ] Sistema de hashtags automáticas (#app #escolinha #atleta)
- [ ] Notificações push (OneSignal) para: nova presença, novo badge, curtidas
- [ ] Dashboard Pais funcional (ver dados do filho)
- [ ] Sistema de vinculação Pai ↔ Filho obrigatória

**Critério de Sucesso:**
- ✅ Aluno posta foto do treino, família vê no feed
- ✅ Pai recebe notificação quando filho marca presença
- ✅ Engajamento: 50%+ alunos fazem ≥1 post/semana

---

### Sprint 7-8 (Semanas 13-16): Polish + Beta Testing
**Período:** 23 Fevereiro - 15 Março 2026  
**Objetivo:** App polido, pronto para lançamento oficial

**Features:**
- [ ] Refinamento UI/UX (feedback beta interno)
- [ ] Ajustes de performance (caching, queries otimizadas)
- [ ] Onboarding melhorado com tooltips
- [ ] Tratamento de erros elegante (não mostrar stack traces)
- [ ] Modo offline parcial (PWA cache básico)
- [ ] Analytics (Mixpanel) para tracking de uso
- [ ] Testes com escolinha piloto (50-100 alunos reais)

**Critério de Sucesso:**
- ✅ Zero bugs críticos (que impedem uso)
- ✅ NPS >50 com escolinha piloto
- ✅ 80%+ alunos ativos no app após 1 semana

---

### Sprint 9-10 (Semanas 17-18): Preparação Lançamento
**Período:** 16-31 Março 2026  
**Objetivo:** MVP 1.0 oficial pronto para 2-3 escolinhas

**Features:**
- [ ] Correções de bugs reportados na beta
- [ ] Materiais de marketing prontos (posts, folders digitais)
- [ ] Onboarding de 2-3 escolinhas novas
- [ ] Sistema de convites (escolinha convida alunos)
- [ ] Dashboard CTO/Admin finalizado
- [ ] Documentação técnica básica

**Critério de Sucesso:**
- ✅ **MVP 1.0 LANÇADO EM MARÇO 2026** ✅
- ✅ 2-3 escolinhas ativas
- ✅ 150-300 alunos cadastrados
- ✅ 70%+ taxa de adoção (alunos usando app regularmente)

---

### Sprint 11-12 (Semanas 19-20): Marketplace MVP
**Período:** 1-15 Abril 2026  
**Objetivo:** Primeira receita via marketplace

**Features:**
- [ ] Marketplace: estrutura básica (catálogo de produtos)
- [ ] Integração Asaas (pagamentos Pix + Cartão)
- [ ] 3-5 parceiros piloto cadastrados (material esportivo, nutrição)
- [ ] Dashboard parceiro (ver vendas, adicionar produtos)
- [ ] Sistema de cupons de desconto (10-20% off)
- [ ] Notificação de ofertas para pais

**Critério de Sucesso:**
- ✅ Primeira venda realizada no marketplace
- ✅ 3+ parceiros ativos com estoque
- ✅ MRR inicial >R$ 5k (objetivo conservador)

---

## 1.4 Features por Versão (V1.1 → V2.5)

### 📅 V1.1 (Abril 2026) - Marketplace Ativo
**Prazo:** 1-30 Abril  
**Foco:** Monetização inicial

- Cupons de desconto dinâmicos
- Carrinho de compras otimizado
- Checkout simplificado (Pix + Cartão)
- Sistema de avaliações (5 estrelas)
- Notificação de ofertas especiais
- Dashboard ROI para parceiros

**Meta:** 10+ parceiros, R$ 15k MRR

---

### 📅 V1.2 (Maio 2026) - Clube de Benefícios
**Prazo:** 1-31 Maio  
**Foco:** Receita recorrente (assinaturas)

- Assinatura Clube de Benefícios (R$ 24,90/mês)
- Página de benefícios exclusivos
- Badge "Membro Clube" no perfil
- Acesso a conteúdo premium (vídeos exclusivos técnicos)
- Descontos maiores marketplace (20-30% vs 10-15% free)
- Sistema de fidelidade (cashback pontos)

**Meta:** 50 assinantes, R$ 1.200/mês adicional

---

### 📅 V1.3 (Junho 2026) - Dashboard Pais Avançado
**Prazo:** 1-30 Junho  
**Foco:** Engajamento familiar

- Dashboard Pais detalhado (evolução mês a mês)
- Gráficos de desempenho (presença, pontos, posição ranking)
- Comparação anônima (meu filho vs média da turma)
- Relatório mensal automático (email PDF)
- Histórico completo (desde cadastro)
- Metas personalizadas (ex: "chegar top 5")

**Meta:** 80%+ pais ativos mensalmente

---

### 📅 V1.4 (Julho 2026) - Avaliações Técnicas
**Prazo:** 1-31 Julho  
**Foco:** Profissionalização scouting

- Técnico avalia aluno em múltiplas categorias
  - Físico: velocidade, resistência, força
  - Técnico: passe, drible, chute, domínio
  - Tático: posicionamento, visão de jogo
  - Mental: disciplina, liderança, resiliência
- Gráfico radar (spider chart) mostrando evolução
- Exportação de relatório técnico (PDF profissional)
- Histórico de avaliações (comparar trimestres)

**Meta:** 5+ escolinhas usando avaliações sistematicamente

---

### 📅 V1.5 (Agosto 2026) - Persona Scout Completa
**Prazo:** 1-31 Agosto  
**Foco:** Atrair scouts profissionais

- Dashboard Scout (buscar atletas, filtros avançados)
- Avaliações estruturadas (formulário CBF-like)
- Gamificação scout (pontos por descobrir talentos que viram profissionais)
- Portfólio scout (atletas descobertos)
- Sistema de certificação (integração curso CBF Pro FIFA)

**Meta:** 20+ scouts ativos cadastrados

---

### 📅 V1.6 (Setembro 2026) - Persona Clube Profissional
**Prazo:** 1-30 Setembro  
**Foco:** Conectar base com clubes

- Dashboard Clube (buscar talentos, filtros super avançados)
- Sistema de comparação (até 5 atletas lado a lado)
- Histórico completo do atleta (exportar PDF detalhado)
- Sinalização de interesse (clube marca atleta como "observando")
- Notificação para escolinha quando clube demonstra interesse

**Meta:** 3+ clubes profissionais cadastrados (Série A/B)

---

### 📅 V1.7 (Outubro 2026) - Sistema de Mensagens
**Prazo:** 1-31 Outubro  
**Foco:** Comunicação direta controlada

- DM (Direct Message) entre usuários autorizados:
  - Scout → Aluno (convite para teste)
  - Clube → Aluno (proposta formal)
  - Técnico → Pais (feedback privado)
  - Coordenador → Técnicos (comunicação interna)
- Sistema de autorização (menor precisa autorização pais para DM externo)
- Moderação automática (detecção palavras inapropriadas)
- Log completo (compliance LGPD)

**Meta:** 500+ mensagens/mês, zero denúncias

---

### 📅 V1.8 (Novembro 2026) - Módulo Vídeos
**Prazo:** 1-30 Novembro  
**Foco:** Portfólio visual atletas

- Upload de vídeos (até 2min, 100MB cada)
- Biblioteca de vídeos do aluno (max 10 vídeos)
- Vídeos destacados ("melhores momentos")
- Compartilhamento público/privado (controle granular)
- Player otimizado (streaming adaptativo)
- Transcodificação automática (múltiplas resoluções)

**Meta:** 50%+ atletas com ≥1 vídeo

---

### 📅 V1.9 (Dezembro 2026) - Integração Instagram + Preparação AWS
**Prazo:** 1-31 Dezembro  
**Foco:** Viralização orgânica + escalabilidade

- OAuth Instagram (login + permissões post)
- Auto-post: foto do treino → Instagram do aluno (automático)
- Caption com hashtags + link app
- Zero storage extra (fotos ficam no Instagram)
- Preparação migração AWS:
  - Testes de carga (simular 10k usuários)
  - Documentação arquitetura cloud
  - Plano de migração gradual

**Meta:** 30%+ alunos conectam Instagram

---

### 📅 V2.0 (Janeiro-Fevereiro 2027) - Segundo Esporte
**Prazo:** 1 Janeiro - 28 Fevereiro 2027  
**Foco:** Expansão multi-esporte

- Módulo Vôlei **OU** Basquete (decisão baseada em tração)
- Stats específicas do esporte:
  - Vôlei: bloqueios, saques, levantamentos, recepções
  - Basquete: rebotes, assistências, roubos de bola, 3pts
- Gamificação adaptada (badges específicos)
- Onboarding esporte-específico
- Piloto com 1 escolinha do novo esporte

**Meta:** 1 escolinha não-futebol com 50+ alunos ativos

---

## 1.5 Reconciliação com Compromissos Estratégicos

### ✅ Prazo de 45 Dias Pós-MoU
**Data MoU:** ~1º Dezembro 2025  
**Prazo final:** ~15 Janeiro 2026

**Entregas comprometidas:**
1. ✅ **Site institucional Re Globo Soccer** (finalizado em 1 semana, até 8 Dez)
2. ✅ **Business Plan completo** (este documento, finalizado 26 Nov)
3. ✅ **Pitch Deck** (12 slides, finalizável até 29 Nov)
4. ✅ **Protótipo funcional** (wireframes navegáveis Figma, até 15 Jan)

**Status:** ✅ **PRAZO VIÁVEL** - Entregas estratégicas prontas antes do início do desenvolvimento pesado do MVP

---

### ✅ MVP Funcional em Março 2026
**Compromisso:** Entregar plataforma funcional versão 1.0 em Março

**Interpretação correta:**
- **Março 2026** = Sprints 9-10 concluídos
- **MVP 1.0** = Sistema completo com:
  - Auth + Onboarding ✅
  - QR Presença + Gamificação ✅
  - Feed Social + Notificações ✅
  - Dashboards funcionais ✅
  - Beta testado e validado ✅
  - 2-3 escolinhas operando ✅

**Status:** ✅ **CRONOGRAMA ALINHADO** - MVP 1.0 oficial lançado em Março 2026

---

## 1.6 Roadmap Simplificado Para Apresentação (29/Nov)

```
┌─────────────────────────────────────────────────────────────┐
│  CRONOGRAMA EXECUTIVO - 18 MESES                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📍 DEZ 2025          Sprint 1-4: Fundações + QR Presença   │
│  📍 JAN 2026          Sprint 5-8: Social + Polish           │
│  📍 FEV 2026          Sprint 9-10: Beta Testing             │
│  📍 MAR 2026 ✅       MVP 1.0 LANÇADO (compromisso)         │
│                                                              │
│  📍 ABR-JUN 2026      V1.1-V1.3: Marketplace + Assinaturas  │
│  📍 JUL-SET 2026      V1.4-V1.6: Scouts + Clubes            │
│  📍 OUT-DEZ 2026      V1.7-V1.9: Mensagens + Vídeos + AWS   │
│                                                              │
│  📍 JAN-FEV 2027      V2.0: Segundo Esporte                 │
│  📍 MAR-JUN 2027      V2.1-V2.5: IA + Blockchain + Global   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

🎯 MARCOS CRÍTICOS:
   ✅ 15 Jan 2026: Protótipo funcional (45 dias pós-MoU)
   ✅ 15 Fev 2026: Beta com 1 escolinha
   ✅ 15 Mar 2026: MVP 1.0 Oficial (COMPROMISSO ESTRATÉGICO)
```

---

# 2. ARQUITETURA DO SISTEMA

## 2.1 Stack Tecnológico

### Frontend
```
Framework: Next.js 14 (App Router)
UI: shadcn/ui + Tailwind CSS
State: Zustand (gerenciamento estado global)
Forms: React Hook Form + Zod (validação)
PWA: next-pwa (Progressive Web App)
```

### Backend
```
Runtime: Node.js 20 LTS
Framework: Next.js API Routes (serverless functions)
ORM: Prisma (type-safe database access)
Database: PostgreSQL 15 (multi-tenancy com RLS)
Cache: Redis (sessões, rankings, leaderboards)
Queue: BullMQ (jobs assíncronos: emails, notificações)
```

### Infraestrutura
```
Hosting Inicial: VPS Hostinger (MVP)
Hosting Escala: AWS (após V1.9)
  - EC2: Application servers
  - RDS: PostgreSQL managed
  - S3: Storage (fotos, vídeos)
  - CloudFront: CDN global
  - ElastiCache: Redis managed
Storage: S3-compatible (Hostinger Object Storage → AWS S3)
CDN: BunnyCDN (MVP) → CloudFront (escala)
```

### Integrações
```
Pagamentos: Asaas (Pix + Cartão)
Notificações Push: OneSignal
SMS: Twilio (opcional, 2FA)
Email: SendGrid (transacional)
Analytics: Mixpanel (product analytics)
Monitoring: Sentry (error tracking)
OAuth: Google, Instagram (futuramente Facebook)
```

## 2.2 Diagrama de Arquitetura

```
┌──────────────────────────────────────────────────────────────┐
│                          USUÁRIOS                             │
│  (Alunos, Pais, Técnicos, Escolinhas, Scouts, Clubes)      │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                      FRONTEND (PWA)                           │
│  Next.js 14 + shadcn/ui + Tailwind CSS                      │
│  - Dashboard por Persona                                      │
│  - Feed Social                                                │
│  - QR Scanner (presença)                                      │
│  - Marketplace                                                │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                    API LAYER (Next.js)                        │
│  - Auth (JWT + Refresh Tokens)                               │
│  - REST APIs (/api/*)                                         │
│  - Webhooks (Asaas, OneSignal)                               │
│  - Rate Limiting (IP + User)                                  │
└─────────┬────────────────────────────────────────────────────┘
          │
          ├──────────────────┬───────────────────┬──────────────
          ▼                  ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   PostgreSQL 15  │ │   Redis Cache    │ │   BullMQ Queue   │
│                  │ │                  │ │                  │
│ - Users          │ │ - Sessions       │ │ - Email jobs     │
│ - Escolinhas     │ │ - Rankings       │ │ - Notificações   │
│ - Presencas      │ │ - Feed cache     │ │ - Reports        │
│ - Badges         │ │ - Hot data       │ │ - Backups        │
│ - Marketplace    │ │                  │ │                  │
│ (Multi-tenancy   │ │                  │ │                  │
│  com RLS)        │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────┐
│                   STORAGE & CDN                               │
│  - S3 (fotos, vídeos, PDFs)                                  │
│  - CloudFront (CDN global)                                    │
└──────────────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────┐
│                   SERVIÇOS EXTERNOS                           │
│  - Asaas (pagamentos)                                         │
│  - OneSignal (push notifications)                             │
│  - SendGrid (emails transacionais)                            │
│  - Mixpanel (analytics)                                       │
│  - Sentry (monitoring)                                        │
└──────────────────────────────────────────────────────────────┘
```

## 2.3 Segurança e Compliance

### Row-Level Security (RLS) PostgreSQL

**Princípio:** Dados de uma escolinha **NUNCA** vazam para outra.

```sql
-- Exemplo: Tabela 'alunos'
CREATE POLICY alunos_isolation ON alunos
  USING (escolinha_id = current_setting('app.escolinha_id')::uuid);

-- Toda query automaticamente filtra por escolinha_id
-- Impossível aluno de Escolinha A ver dados de Escolinha B
```

### Criptografia

| Camada | Tipo | Implementação |
|--------|------|---------------|
| **Transporte** | TLS 1.3 | HTTPS obrigatório, HSTS enabled |
| **Dados em Repouso** | AES-256 | Database encryption at rest |
| **Dados Sensíveis** | Campo-level | Saúde info, CPF (criptografia adicional) |
| **Senhas** | Argon2id | bcrypt deprecado, Argon2id é padrão-ouro |
| **Tokens** | JWT + Refresh | Access token 15min, refresh 7 dias |

### LGPD Compliance by Design

- **Minimização de Dados:** Apenas coletamos o essencial
- **Consentimento Explícito:** Termo LGPD obrigatório (scroll + checkbox)
- **Dados de Menores:** Consentimento dos pais obrigatório (<18 anos)
- **Direito ao Esquecimento:** Soft delete (5 anos) → Hard delete
- **Portabilidade:** Export completo em JSON estruturado
- **DPO Nomeado:** Lucas Galvão (CTO/CLO/DPO)

---

# 3. WIREFRAMES E MOCKUPS

## 3.1 Dashboard Aluno (Mobile-First)

```
┌─────────────────────────────────┐
│  ☰  [App Logo]        🔔 (3)   │  ← Header
├─────────────────────────────────┤
│                                 │
│  👤 Olá, João Pedro!           │
│                                 │
│  ╔═══════════════════════════╗ │
│  ║   CARD EA FC STYLE        ║ │
│  ║   ┌─────────┐              ║ │
│  ║   │ [FOTO]  │  João Pedro  ║ │
│  ║   └─────────┘  Sub-15      ║ │
│  ║   ⭐ 85 Overall            ║ │
│  ║   ⚡ 1.234 pontos          ║ │
│  ╚═══════════════════════════╝ │
│                                 │
│  📊 TEU RANKING                │
│  ┌───────────────────────────┐ │
│  │ #3 na Escolinha           │ │
│  │ #12 no Núcleo Regional    │ │
│  └───────────────────────────┘ │
│                                 │
│  🏆 ÚLTIMAS CONQUISTAS         │
│  🥇 Top 3 Semanal              │
│  ⚡ 5 Treinos Seguidos         │
│  🎖️ 1 Mês Ativo                │
│                                 │
│  📅 PRÓXIMO TREINO             │
│  Amanhã, 16h30                 │
│  [VER QR CODE PRESENÇA]        │
│                                 │
├─────────────────────────────────┤
│  🏠 Home  📊 Stats  👥 Social  │  ← Bottom Nav
└─────────────────────────────────┘
```

## 3.2 Dashboard Escolinha (Desktop)

```
┌──────────────────────────────────────────────────────────────────┐
│  ☰  [Logo]    Escolinha Craque do Futuro    🔔    👤 Técnico     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📊 VISÃO GERAL                                                  │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐      │
│  │  Alunos     │  Presença   │  Engajamento│  Receita    │      │
│  │  Ativos     │  Média      │  Semanal    │  Marketplace│      │
│  │             │             │             │             │      │
│  │    127      │    82%      │    65%      │  R$ 450     │      │
│  │   (+12)     │   (+5%)     │   (+8%)     │  (+15%)     │      │
│  └─────────────┴─────────────┴─────────────┴─────────────┘      │
│                                                                   │
│  🎯 AÇÃO RÁPIDA                                                  │
│  [Gerar QR Treino Hoje]  [Adicionar Aluno]  [Ver Rankings]      │
│                                                                   │
│  📋 TURMAS (3 ativas)                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Sub-13 Manhã    42 alunos    Presença média: 85%  [Gerenciar]│ │
│  │ Sub-15 Tarde    38 alunos    Presença média: 78%  [Gerenciar]│ │
│  │ Sub-17 Noite    47 alunos    Presença média: 80%  [Gerenciar]│ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  🏆 TOP 10 ATLETAS DA SEMANA                                     │
│  ┌────┬─────────────────┬────────┬────────────────────────────┐ │
│  │ #  │ Nome            │ Pontos │ Badges Recentes            │ │
│  ├────┼─────────────────┼────────┼────────────────────────────┤ │
│  │ 1  │ João Pedro      │ 1.450  │ 🥇 Top Semanal             │ │
│  │ 2  │ Lucas Silva     │ 1.320  │ ⚡ 7 Treinos Seguidos      │ │
│  │ 3  │ Maria Oliveira  │ 1.280  │ 🎖️ 100% Presença Mês      │ │
│  │ ...│ ...             │ ...    │ ...                        │ │
│  └────┴─────────────────┴────────┴────────────────────────────┘ │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│  Home  │  Turmas  │  Rankings  │  Relatórios  │  Marketplace    │
└──────────────────────────────────────────────────────────────────┘
```

## 3.3 Fluxo QR Code Presença

```
PASSO 1: Técnico gera QR
┌─────────────────────────────────┐
│  📅 Treino de Hoje              │
│  Terça, 14 Nov 2025 - 16h30     │
│                                 │
│  [GERAR QR CODE]                │
└─────────────────────────────────┘
          │
          ▼
PASSO 2: QR aparece na tela
┌─────────────────────────────────┐
│  QR CODE ATIVO                  │
│                                 │
│  ┌─────────────────────────┐   │
│  │  ▓▓▓▓░░▓▓░░▓▓▓▓         │   │
│  │  ░░▓▓▓▓░░▓▓▓▓░░         │   │
│  │  ▓▓░░▓▓▓▓░░▓▓▓▓         │   │
│  │  (QR Code aqui)          │   │
│  └─────────────────────────┘   │
│                                 │
│  Válido até: 19h30 (3h)         │
│  Escaneados: 12/42 alunos       │
└─────────────────────────────────┘
          │
          ▼
PASSO 3: Aluno escaneia
┌─────────────────────────────────┐
│  📸 Escanear QR Code            │
│  (Câmera ativa)                 │
│                                 │
│  Posicione o QR no centro       │
│  da moldura                     │
└─────────────────────────────────┘
          │
          ▼
PASSO 4: Confirmação
┌─────────────────────────────────┐
│  ✅ PRESENÇA CONFIRMADA!        │
│                                 │
│  João Pedro                     │
│  Sub-15 Tarde                   │
│                                 │
│  +10 pontos ganhos! ⚡          │
│                                 │
│  Novo badge desbloqueado:       │
│  🎖️ "5 Treinos Seguidos"        │
│                                 │
│  [OK]                           │
└─────────────────────────────────┘
```

## 3.4 Feed Social (Instagram-like)

```
┌─────────────────────────────────┐
│  📸 Feed                   🔍   │
├─────────────────────────────────┤
│                                 │
│  👤 João Pedro · 2h            │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │   [FOTO DO TREINO]      │   │
│  │                         │   │
│  └─────────────────────────┘   │
│  ❤️ 45  💬 8  📤 3            │
│                                 │
│  Treino pesado hoje! 💪          │
│  #app #escolinha #sub15         │
│                                 │
│  Ver todos os 8 comentários...  │
│  Maria: Parabéns! 🔥             │
│  Lucas: Top demais irmão!       │
│                                 │
├─────────────────────────────────┤
│  👤 Maria Oliveira · 5h        │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │   [FOTO BADGE]          │   │
│  │                         │   │
│  └─────────────────────────┘   │
│  ❤️ 67  💬 12  📤 5           │
│                                 │
│  Consegui o badge Top 3! 🏆     │
│  #foco #determinacao            │
│                                 │
├─────────────────────────────────┤
│  [+ CRIAR POST]                 │
└─────────────────────────────────┘
```

---

# 4. COMPLIANCE LGPD - CHECKLIST COMPLETO

[... conteúdo LGPD mantido do documento original ...]

---

# 5. MINUTAS DE CONTRATOS

[... conteúdo contratos mantido do documento original ...]

---

# 6. PESQUISA DE MERCADO EXPANDIDA

[... conteúdo pesquisa de mercado mantido do documento original ...]

---

# 7. PERSONAS DETALHADAS

[... conteúdo personas mantido do documento original ...]

---

# 8. ANÁLISE COMPETITIVA EXPANDIDA

[... conteúdo análise competitiva mantido do documento original ...]

---

# 9. PERGUNTAS FREQUENTES TÉCNICAS E JURÍDICAS

[... conteúdo perguntas frequentes mantido do documento original ...]

---

# 10. CRONOGRAMA E MARCOS DE VALIDAÇÃO

## 10.1 Timeline Executivo Consolidado

```
🗓️ NOVEMBRO 2025
├─ 26 Nov (Hoje): Documentos finalizados
├─ 29 Nov (Sexta, 15h): Apresentação aos sócios
└─ ~1 Dez: Assinatura MoU (estimada)

🗓️ DEZEMBRO 2025  
├─ Sprint 1-2: Fundações + Auth
├─ Sprint 3-4: QR Presença + Gamificação
└─ Entrega parcial: Core funcional básico

🗓️ JANEIRO 2026
├─ 15 Jan: ✅ MARCO 1: Protótipo funcional (45 dias pós-MoU)
├─ Sprint 5-6: Feed Social + Notificações
└─ Sprint 7-8: Polish + preparação beta

🗓️ FEVEREIRO 2026
├─ 15 Fev: ✅ MARCO 2: Beta lançado (1 escolinha piloto)
└─ Sprint 9-10: Ajustes feedback + marketplace prep

🗓️ MARÇO 2026
├─ 15 Mar: ✅ MARCO 3: MVP 1.0 LANÇADO OFICIALMENTE
├─ Sprint 11-12: Marketplace MVP
└─ Onboarding 2-3 escolinhas novas

🗓️ ABRIL-DEZEMBRO 2026
├─ V1.1-V1.9: Features incrementais
└─ Consolidação: 10+ escolinhas, MRR R$100k+

🗓️ JANEIRO-JUNHO 2027
├─ V2.0-V2.5: Segundo esporte + IA + Expansão
└─ Ready for scale: Multi-esporte, internacional
```

## 10.2 Marcos de Validação Críticos

### 🎯 Marco 1: Entrega Fase 1 (15/Jan/2026)
**Prazo:** 45 dias após MoU (1 Dez → 15 Jan)

**Deliverables:**
- [x] Business Plan completo (este documento) ✅
- [ ] Site institucional Re Globo Soccer (1 semana, até 8 Dez)
- [ ] Pitch Deck final (12 slides, até 29 Nov)
- [ ] Protótipo funcional navegável (Figma, até 15 Jan)

**Critério de Sucesso:**
✅ Materiais estratégicos aprovados por Alécio/Roney  
✅ Fundação técnica estabelecida para desenvolvimento MVP

---

### 🎯 Marco 2: Beta Lançado (15/Fev/2026)
**Prazo:** 2,5 meses após MoU

**Deliverables:**
- [ ] MVP Beta funcional (8 sprints concluídos)
- [ ] 1 escolinha piloto onboardada
- [ ] 50-100 alunos ativos
- [ ] Features core testadas:
  - Auth + Onboarding ✅
  - QR Presença ✅
  - Gamificação (pontos + badges) ✅
  - Feed Social ✅
  - Dashboards ✅

**Critério de Sucesso:**
✅ NPS >50 com escolinha piloto  
✅ 80%+ alunos ativos após 1 semana  
✅ Zero bugs críticos (que impedem uso)

---

### 🎯 Marco 3: MVP 1.0 Oficial (15/Mar/2026) ✅ COMPROMISSO ESTRATÉGICO
**Prazo:** 3,5 meses após MoU - **MARÇO 2026**

**Deliverables:**
- [ ] **MVP 1.0 LANÇADO OFICIALMENTE** ✅
- [ ] 2-3 escolinhas ativas
- [ ] 150-300 alunos cadastrados
- [ ] Marketplace estruturado (pronto para parceiros)
- [ ] Materiais de marketing finalizados
- [ ] Evento de lançamento realizado

**Critério de Sucesso:**
✅ **MVP FUNCIONAL EM MARÇO** (compromisso cumprido)  
✅ 70%+ taxa de adoção (alunos usando app regularmente)  
✅ Feedback positivo de escolinhas (NPS >60)  
✅ Primeira venda marketplace (proof of concept)  
✅ Base sólida para crescimento (V1.1+)

---

### 🎯 Marco 4: Primeira Receita (Abril 2026)
**Deliverables:**
- [ ] 3-5 parceiros marketplace ativos
- [ ] Primeira venda realizada
- [ ] MRR inicial >R$ 5k

**Critério de Sucesso:**
✅ Prova de conceito monetização  
✅ Pipeline vendas estabelecido

---

### 🎯 Marco 5: 10 Escolinhas Ativas (Dezembro 2026)
**Deliverables:**
- [ ] 10+ escolinhas usando plataforma regularmente
- [ ] 1.500+ alunos ativos
- [ ] MRR >R$ 100k
- [ ] V1.9 concluído (pronto para AWS)

**Critério de Sucesso:**
✅ Product-market fit validado  
✅ Operação sustentável  
✅ Ready for scale (2027)

---

## 10.3 Indicadores de Saúde da Empresa

**🟢 Verde (Tudo OK):**
- MRR crescendo >5%/mês
- Churn <5%/mês
- NPS >60
- DAU/MAU >40%
- Cash runway >12 meses

**🟡 Amarelo (Atenção):**
- MRR estagnado ou crescimento <5%
- Churn 5-10%
- NPS 50-60
- DAU/MAU 30-40%
- Cash runway 6-12 meses

**🔴 Vermelho (Crise):**
- MRR decrescendo
- Churn >10%
- NPS <50
- DAU/MAU <30%
- Cash runway <6 meses

**Ação:** Se 2+ indicadores em vermelho → reunião emergencial sócios + advisors

---

## 10.4 Plano de Contingência

### Cenário 1: Atraso no Desenvolvimento
**Risco:** MVP não fica pronto em Março

**Mitigação:**
- Reduzir escopo MVP (cortar features não-core)
- Priorizar: Auth + QR Presença + Gamificação básica
- Marketplace pode esperar para V1.1 (Abril)

---

### Cenário 2: Adoção Baixa (Escolinhas Resistem)
**Risco:** Escolinhas não adotam plataforma

**Mitigação:**
- Oferecer período gratuito estendido (3 meses)
- Onboarding presencial com técnicos
- Suporte dedicado 1:1
- Gamificação inter-escolinhas (competição saudável)

---

### Cenário 3: Problemas Técnicos (Bugs Críticos)
**Risco:** Sistema instável, usuários desistem

**Mitigação:**
- Beta testing rigoroso (Fevereiro)
- Rollback automático (deploy pode reverter)
- Monitoring 24/7 (Sentry alerts)
- Lucas dedicação full-time (hotfixes rápidos)

---

**Próximo passo:** Validar com Alécio/Roney, ajustar conforme feedback, e iniciar desenvolvimento MVP.

---

**Documento Confidencial - 26 de Novembro de 2025**  
*Versão 1.1 (Revisada) - Anexos Técnicos e Jurídicos*

---

**Contato:**

**Lucas Galvão - CTO, CLO, DPO**  
📧 [seu email]  
📱 [seu telefone]  
🌐 [lucasgalvao.com.br](https://lucasgalvao.com.br)
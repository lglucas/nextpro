# 🤖 Regras de Desenvolvimento AI - SuperAppFutebol
**Versão:** 0.0.1  
**Data:** 15/12/2025  
**Baseado nas regras originais do Lucas Galvão**

## 📋 **Regras de Versionamento do Projeto**
- **Major (0.x.0):** Mudanças significativas de sprint (ex: 0.1 → 0.2)
- **Minor (0.x.y):** Mudanças dentro do sprint atual (ex: 0.2.0 → 0.2.1)
- **Versão 1.0.0:** Apenas quando tivermos mudanças maiores, que estejam acima do Major.

> Prompt de AI com 25 regras essenciais para desenvolvimento eficiente e seguro

---

## 📋 **PROMPT PARA AI ASSISTANTS**
Trae


Siga RIGOROSAMENTE estas regras em TODAS as interações:

## 🔍 VERIFICAÇÃO E ANÁLISE (Regras 1-5)
1. 
   NUNCA suponha nada sobre arquivos - Sempre abra e examine o arquivo completo antes de sugerir qualquer mudança, bug fix ou melhoria.
2. 
   Consulte a documentação primeiro - Verifique SEMPRE os arquivos da pasta docs/ e planning/ para entender o contexto, plano e funcionamento antes de fazer alterações.
3. 
   Analise dependências - Examine como o arquivo se relaciona com outros arquivos do sistema antes de modificar, verificando imports, exports e chamadas de função.
4. 
   Compreenda o sistema completo - Entenda o funcionamento geral, o que está conectado ao quê, e como suas mudanças podem impactar outras partes.
5. 
   Valide implementações - Sempre verifique se as modificações solicitadas foram implementadas corretamente e se não causaram bugs.


## 🎯 EXECUÇÃO E COMUNICAÇÃO (Regras 6-10)

6. 
   Análise antes da ação - Sempre forneça uma análise clara do que será feito antes de executar qualquer modificação.
7. 
   Explicação única e clara - Explique as alterações apenas UMA vez, de forma objetiva e completa, sem repetições.
8. 
   Instruções precisas - Indique EXATAMENTE onde fazer mudanças: "abaixo da linha X que contém Y, acima da linha Z que contém W".
9. 
   Ações específicas - Deixe claro se deve ADICIONAR, SUBSTITUIR ou DELETAR código, nunca deixe dúvidas.
10. 
    Verificação pós-implementação - Sempre confirme se as mudanças foram aplicadas corretamente após a implementação.

## ⚙️ CONFIGURAÇÃO E AMBIENTE (Regras 11-15)
11. 
    Versionamento obrigatório - Atualize a versão no cabeçalho do arquivo modificado conforme o CHANGELOG atual.
12. 
    Priorize .env - Sempre verifique o arquivo .env primeiro para configurações, NUNCA hardcode valores que deveriam estar lá.
13. 
    Analise .env completamente - Verifique se não há configurações duplicadas ou conflitantes no arquivo de ambiente.
14. 
    Configurações centralizadas - Mantenha todas as configurações no .env, nunca espalhe pelo código.
15. 
    Ambiente consistente - Garanta que as configurações funcionem em desenvolvimento e produção.

## 📚 DOCUMENTAÇÃO E VERSIONAMENTO (Regras 16-20)
16. 
    Documentação sempre atualizada - Atualize OBRIGATORIAMENTE os arquivos da pasta docs/ após mudanças significativas.
17. 
    CHANGELOG rigoroso - Mantenha o CHANGELOG.md sempre atualizado com versionamento semântico correto.
18. 
    Commits estruturados - Use conventional commits: feat:, fix:, docs:, style:, refactor:, test:, chore:.
19. 
    README atualizado - Mantenha o README.md sempre sincronizado com as funcionalidades atuais.
20. 
    Versionamento coordenado - Coordene versões entre arquivos, CHANGELOG e tags Git sem se perder.

## 🧪 TESTES E QUALIDADE (Regras 21-25)
21. 
    Testes obrigatórios - Sempre forneça comandos de teste específicos para validar as modificações realizadas.
22. 
    Qualidade do código - Mantenha código limpo, modular, eficiente e bem comentado em português.
23. 
    Performance sempre - Considere impacto na performance em todas as mudanças, otimize quando necessário.
24. 
    Segurança - Mantenha o código seguro contra vulnerabilidades, siga boas práticas.
25. 
    Documentação - Documente todas as mudanças significativas, APIs, configurações e fluxos de trabalho.

26. 
    ARQUITETURA POR FEATURES (NÃO POR LAYERS)
    **Justificativa:**
- Cada feature é autocontida (fácil encontrar código)
- Reduz acoplamento entre módulos
- Facilita trabalho paralelo de múltiplos devs
- Delete de feature não quebra outras partes
- Testes isolados por feature

27. 
    SEPARATION OF CONCERNS
    **REGRA DE OURO: Evite arquivos grandes, com mais de 200 linhas (por exemplo).**
    Se um arquivo ultrapassar 200 linhas, DEVE ser quebrado em múltiplos arquivos, de forma que faça sentido essa quebra, deixando em cada arquivo uma responsabilidade central.

    **Benefícios:**
- Código fácil de entender (cada arquivo = 1 responsabilidade)
- Fácil de testar (mock de dependências)
- Fácil de reusar (componentes pequenos)
- Code review rápido (arquivos pequenos)

28. 
    STACK TECNOLÓGICA

### **VERSÕES ESTÁVEIS (LTS ou Stable Release -1)**

**Filosofia:** Usar versões **estáveis comprovadas**, NÃO versões bleeding-edge.  
**Critério:** Versão deve ter no mínimo 6 meses de lançamento e >10K downloads/semana.

29. 
    Nas interações com o usuário, entenda que eçe é um Dev Jr, e precisa de instruções claras, porém não se repita. Seja específico e direto.
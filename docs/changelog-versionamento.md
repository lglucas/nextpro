# Changelog e Versionamento

Este projeto usa SemVer (0.x.y) e mantém um changelog no formato Keep a Changelog.

## Regras práticas (como vamos operar)
- `0.x.0` (major): mudança de sprint/ciclo (um pacote coerente de entrega).
- `0.x.y` (minor): ajustes e incrementos dentro do sprint/ciclo atual.
- `Unreleased`: apenas o que ainda não foi “lançado” (não pode virar depósito de tudo).

## Fluxo recomendado por entrega
1) Escolha a versão antes de começar (ex.: `0.7.0` para o sprint, `0.7.1` para incrementos).
2) Ao finalizar uma entrega, mova as entradas do `Unreleased` para a versão correspondente.
3) Faça o commit com conventional commit (ex.: `feat:`, `fix:`, `docs:`).
4) Não reescreva histórico antigo: changelog é log (corrigir pode, apagar não).

## Como agrupar commits no changelog
- Um item no changelog pode representar vários commits, desde que descreva a entrega real.
- Sempre prefira linguagem de produto (o que mudou para o usuário) + referência técnica quando necessário.


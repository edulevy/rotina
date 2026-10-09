# Roadmap · App Rotina

App de celular pessoal (PWA) com o plano de treino de 12 semanas, academia, nutrição e a grade da semana.
Online em https://edulevy.github.io/rotina/ · código em `edulevy/rotina` (público).

**Próximo passo:** fazer o login do Garmin neste PC (comando no roadmap do Garmin) pra os 76 treinos da semana nova chegarem no relógio.

## Feito

| Data | O quê |
|---|---|
| 09/10/2026 | Nutrição: dias e tipos de dia (leve, moderado, duro, véspera, longo) fixos no topo; tocar num tipo mostra a alimentação dele |
| 08/10/2026 | Semana nova: corrida 2 na sexta, pedal Z2 no sábado, longão no domingo (app, grade e nutrição) |
| 08/10/2026 | Nutrição calculada pelo treino de cada dia, trocas de alimentos, card "Comer hoje" que abre as refeições |
| 08/10/2026 | Agenda do Hoje só com os treinos |
| 08/10/2026 | Aba Nutrição (a partir do InBody de 27/08/2025 e da estimativa de 75 kg e 20%) |
| 08/10/2026 | App sempre busca a versão nova (não mistura arquivo novo com velho) |
| 07/10/2026 | Jeito de app: sem zoom, abas fixas, cards que abrem e fecham |
| 07/10/2026 | Primeira versão: plano de treino + grade, instalável e offline |

## Por fazer

- [ ] Garmin: login neste PC e reenviar os treinos (ver `backup-levy/garmin/ROADMAP.md`)
- [ ] InBody na semana 1 (12 a 18/10) e trocar `ATUAL` (peso e %) no `dados.js`
- [ ] Registrar o peso semanal no app
- [ ] Refeições no modo "com trabalho à tarde"
- [ ] Marcar refeição feita, igual aos treinos
- [ ] Validar o plano alimentar com nutricionista
- [ ] Semana 12 (28/12 a 03/01): retestes e InBody final
- [ ] Próximo ciclo a partir de janeiro de 2027

## Onde mexer

| Quero mudar | Arquivo |
|---|---|
| Treino, academia, feriado, horário da grade, metas de comida | `dados.js` |
| O que cada aba faz | `app.js` |
| Cores e tamanhos | `app.css` |
| Publicar versão nova no celular | subir `VERSAO` no `sw.js` |

Mudou treino ou dia? Mudar também `backup-levy/garmin/plano_treino.py` e reenviar pro Garmin.

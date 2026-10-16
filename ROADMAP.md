# Roadmap · App Rotina

App de celular pessoal (PWA) com o plano de treino de 12 semanas, academia, nutrição e a grade da semana.
Online em https://edulevy.github.io/rotina/ · código em `edulevy/rotina` (público).

**Próximo passo:** seguir a semana 2 do plano. Cada troca de treino que o Levy fizer entra em `AJUSTES` (dados.js) + `MUDOU` (plano_treino.py) + reagendar a semana no Garmin.

## Feito

| Data | O quê |
|---|---|
| 16/10/2026 | Botão de tema no topo (Automático / Claro / Escuro), salvo em cada aparelho: no PC fica no escuro azul mesmo com o Windows claro |
| 16/10/2026 | Atalho ABRIR CLAUDE PELO CELULAR.bat na pasta da rotina (sessão "Rotina" no celular; fica fora do git, é só deste PC) |
| 16/10/2026 | Nota no Hoje: academia B como extra (não rolou na segunda, feriado). Sáb 17: se chover, academia A no lugar do Z2 (só nota, rotina igual) |
| 16/10/2026 | Conferido: pasta do C: idêntica ao GitHub (nada perdido na mudança do F:). InBody saiu do próximo passo: o de 27/08/2025 fica só como referência |
| 16/10/2026 | Registrado o real da semana 1: qua 14 pedal não rolou (chuva) · qui 15 foi academia C (no relógio como Cardio) · sex 16 só corrida 2. Grade e Garmin sem mudança |
| 13/10/2026 | Ajustes do dia a dia (`AJUSTES` no dados.js): a troca vale no Hoje, nos Treinos, na Academia e na Nutrição. 1ª troca: ter 13 só academia D · qua 14 pedal 3×8' + A · qui 15 só Z2 · sex 16 corrida + C |
| 09/10/2026 | Cada treino diz se precisa de LAP (só o teste e o reteste de subida) ou se o relógio vai sozinho, no app e no Garmin |
| 09/10/2026 | Teste de subida (semanas 2 e 12) na Estrada do Joá por dentro da Barrinha (rua, não a ciclovia): a ida de casa é o aquecimento (sem tempo, termina no LAP), subida de ~2 km e 8–9', volta soltando. App e Garmin atualizados |
| 09/10/2026 | Acompanhamento feito x plano no PC (ver `backup-levy/garmin`): pedir "como foi minha semana" |
| 09/10/2026 | Login do Garmin feito e os 76 treinos da semana nova enviados pro relógio |
| 09/10/2026 | Nutrição: dias e tipos de dia (leve, moderado, duro, véspera, longo) fixos no topo; tocar num tipo mostra a alimentação dele |
| 08/10/2026 | Semana nova: corrida 2 na sexta, pedal Z2 no sábado, longão no domingo (app, grade e nutrição) |
| 08/10/2026 | Nutrição calculada pelo treino de cada dia, trocas de alimentos, card "Comer hoje" que abre as refeições |
| 08/10/2026 | Agenda do Hoje só com os treinos |
| 08/10/2026 | Aba Nutrição (a partir do InBody de 27/08/2025 e da estimativa de 75 kg e 20%) |
| 08/10/2026 | App sempre busca a versão nova (não mistura arquivo novo com velho) |
| 07/10/2026 | Jeito de app: sem zoom, abas fixas, cards que abrem e fecham |
| 07/10/2026 | Primeira versão: plano de treino + grade, instalável e offline |

## Por fazer

- [ ] (Opcional, se fizer um dia) InBody novo e trocar `ATUAL` (peso e %) no `dados.js`
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

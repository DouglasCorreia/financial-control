---
name: Save money
colors:
  background: 'oklch(1 0 0)'
  foreground: 'oklch(0.145 0 0)'
  card: 'oklch(1 0 0)'
  primary: 'oklch(0.205 0 0)'
  secondary: 'oklch(0.97 0 0)'
  muted: 'oklch(0.97 0 0)'
  accent: 'oklch(0.97 0 0)'
  destructive: 'oklch(0.577 0.245 27.325)'
  border: 'oklch(0.922 0 0)'
  success: '#27ae60'
  warning: '#f1c40f'
  info: '#2980b9'
  overdue: '#e35e50'
typography:
  primary: Geist Variable
  legacy-reference: Montserrat
  base-size: 18px
  responsive-base-size: 16px
  body-line-height: 1.45
rounded:
  theme-default: 0.625rem
  buttons: 0.5rem
  cards: 0.75rem
spacing:
  unit: 4px
  common: 16px
breakpoints:
  xs: 480px
  sm: 768px
  md: 992px
  lg: 1024px
  xl: 1200px
---

# Design System — Save Money

## Produto e personalidade

O Save Money é uma aplicação web em português para organizar salário, despesas, categorias e pagamentos. A interface deve transmitir clareza, controle e segurança: mostrar rapidamente quanto entrou, quanto foi gasto e o que ainda precisa de atenção.

O visual existente combina componentes administrativos compactos com cartões de resumo e gráficos. Priorize leitura rápida e ações previsíveis. Evite ornamentos, cores decorativas sem significado e mudanças visuais amplas dentro de tarefas funcionais.

## Cores

A folha principal é `src/index.css`. Ela combina tokens semânticos do tema shadcn/Tailwind em OKLCH com quatro paletas nomeadas próprias. Use os tokens semânticos para superfícies, texto, bordas, foco e estados gerais dos componentes; use as paletas de estado para os significados abaixo.

- **Neutros semânticos:** `background`, `foreground`, `card`, `popover`, `muted`, `border`, `input` e `ring` estruturam fundos, conteúdo e controles. O tema claro é a base; há valores escuros no seletor `.dark`.
- **Verde `chateau-green`:** sucesso e ações positivas. O status `pago` usa tons claros com texto verde escuro.
- **Amarelo `corn`:** atenção. O status `a_pagar` usa fundo amarelo claro e texto escuro.
- **Vermelho `mojo`:** erro, ação destrutiva e atraso. O status `atrasado` usa fundo vermelho claro; mensagens e botões destrutivos usam os tokens/variantes existentes quando aplicável.
- **Azul `lochmara`:** ações de edição e informação.
- **Cores de categoria:** cada categoria pode ter uma cor definida pelo usuário. Preserve esse dado nas listas e visualizações e mantenha um fallback apenas para categorias sem cor.

Há usos pontuais de cores literais em páginas e gráficos (incluindo azul e cores de série). Ao alterar essas áreas, prefira tokens ou paletas existentes e não mude a associação entre cor e significado sem necessidade. Não reporte inconsistência visual como bug funcional sem impacto demonstrável.

A folha também possui variáveis de tema claro/escuro de origem shadcn. Os tokens legados `--text`, `--bg` e afins têm valores controlados por `prefers-color-scheme`, enquanto a família semântica usa `.dark`; verifique qual família e seletor afetam o componente antes de ajustar suporte a tema.

## Tipografia

`@fontsource-variable/geist` é importada em `src/index.css` e o README identifica Geist como fonte principal. A folha define Geist para `--font-sans`, mas ainda contém tokens e aplicações de Montserrat (`--font-montserrat`, `--font-heading`, `--sans` e regra no `:root`). Essa coexistência é uma inconsistência existente: não amplie o uso de Montserrat nem adicione outra fonte. Se uma tarefa envolver tipografia, confira a cascata aplicada e limite a correção ao escopo solicitado.

A base declarada no `:root` é 18px, reduzida para 16px até 1024px; utilitários e componentes também usam escala Tailwind (`text-xs`, `text-sm`, `text-base`). Preserve hierarquia e legibilidade, sobretudo para valores monetários, datas e descrições secundárias.

## Layout e espaçamento

O layout usa Tailwind CSS 4, utilitário `.container` e breakpoints definidos no `@theme`: `xs` 480px, `sm` 768px, `md` 992px, `lg` 1024px e `xl` 1200px. A interface deve continuar utilizável em telas pequenas e grandes; use as classes responsivas já adotadas no projeto e evite criar breakpoints paralelos.

O espaçamento segue a escala de 4px do Tailwind. `16px` é o espaçamento interno comum em cartões; mantenha agrupamento consistente entre cabeçalhos, conteúdo, formulários e ações. A navegação atual abre em um painel lateral sobre o conteúdo. Não substitua esse padrão por uma navegação diferente sem requisito explícito.

## Superfícies e formas

- O raio global é `0.625rem`; os cartões existentes usam `rounded-xl` (12px), e botões usam geralmente `rounded-lg` (8px).
- Os cartões usam fundo semântico `card`, anel/borda sutil e espaçamento interno definido pelo componente local. Reutilize `Card`, `CardHeader`, `CardContent` e componentes associados em vez de criar cartões divergentes.
- Diálogos, alertas, campos e botões têm wrappers locais baseados em Base UI/shadcn. Prefira esses componentes e suas variantes para preservar comportamento, acessibilidade e estados de foco.
- Não introduza sombras, raios, alturas mínimas ou densidade de layout como novos padrões globais sem justificativa de produto.

## Componentes e padrões de interação

- **Ações:** use `Button` e variantes existentes (`default`, `outline`, `secondary`, `ghost`, `destructive`, `link`). Ações destrutivas devem permanecer visualmente distintas e usar confirmação quando o fluxo existente já exigir.
- **Formulários:** mantenha os padrões existentes de label, mensagem de erro e integração React Hook Form/Zod. Campos monetários usam formatação apropriada para Real brasileiro.
- **Status de pagamento:** mantenha os rótulos em português (`A pagar`, `Pago`, `Atrasado`) e as associações amarelo, verde e vermelho, respectivamente. Cor não deve ser o único meio de comunicar o estado; preserve o texto.
- **Dados financeiros:** exiba moeda com `pt-BR` e `BRL`; datas e meses também seguem a localização brasileira. Não altere cálculos ou agrupamentos ao fazer ajustes meramente visuais.
- **Ícones:** use Lucide React, como nos componentes existentes, com tamanho e alinhamento coerentes com o texto e o controle.
- **Gráficos:** mantenha legendas, tooltips e cores coerentes com a série/categoria representada. Garanta que gráficos e valores continuem compreensíveis em larguras menores.

## Acessibilidade e estados

Preserve elementos semânticos, rótulos associados aos campos, foco visível, estados desabilitados, mensagens de validação e affordances de diálogo já fornecidas pelos componentes. Não remova texto de estado em favor apenas de cor ou ícone. Mantenha contraste suficiente ao escolher tons de texto e fundo.

## Orientação para mudanças

Este documento descreve o sistema observado e orienta novas alterações. Quando o código e esta documentação divergirem, confirme o comportamento real nos componentes e em `src/index.css`; atualize o documento quando uma mudança autorizada alterar o padrão. Não faça uma limpeza visual ou correção de inconsistências preexistentes como parte incidental de outra tarefa.

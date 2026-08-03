# Financial Control

Aplicação web para controle financeiro pessoal. O usuário pode cadastrar seu salário, organizar despesas por categorias, acompanhar pagamentos e visualizar um resumo da sua vida financeira por meio de cards e gráficos.

## 🌐 Link de visualização

[https://financial-control-nine-woad.vercel.app/](https://financial-control-nine-woad.vercel.app/)

## Funcionalidades

### Autenticação e perfil

- Cadastro de novos usuários.
- Login com e-mail e senha.
- Logout.
- Proteção das rotas privadas.
- Loading global durante a inicialização da sessão.
- Atualização do nome do usuário.
- Alteração da senha.

### Controle financeiro

- Cadastro e atualização do salário mensal.
- Cadastro, edição e exclusão de categorias.
- Definição de nome e cor para cada categoria.
- Cadastro, edição e exclusão de despesas.
- Associação de despesas às categorias.
- Status de pagamento: `A pagar`, `Pago` e `Atrasado`.
- Máscara de moeda brasileira nos campos de valor.
- Exclusão de todas as despesas do usuário com confirmação.
- Paginação da listagem de despesas, com até 30 itens por página.
- Bloqueio dos botões durante operações de criação, edição e exclusão.

### Dashboard

- Card com o salário do mês.
- Card com o total gasto no mês.
- Card com o saldo restante.
- Gráfico comparando salário, gastos e saldo disponível.
- Gráfico de gastos por mês.
- Comparação dos gastos do ano atual com o ano anterior.
- Gráfico de gastos por categoria.
- Acesso rápido às páginas de salário e despesas pelos cards.

## Stack utilizada

### Front-end

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://zustand.docs.pmnd.rs/) para gerenciamento de estado

### Interface e componentes

- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Base UI](https://base-ui.com/) para componentes acessíveis
- [Lucide React](https://lucide.dev/) para ícones
- Geist como fonte principal

### Formulários e validação

- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- `@hookform/resolvers`
- [React Number Format](https://s-yadav.github.io/react-number-format/) para máscaras monetárias

### Dados e visualização

- [Supabase](https://supabase.com/) para autenticação e banco PostgreSQL
- Row Level Security (RLS) para isolamento dos dados por usuário
- [Recharts](https://recharts.org/) para gráficos do dashboard

## Estrutura de dados

O projeto utiliza as seguintes tabelas principais no Supabase:

- `auth.users`: usuários gerenciados pelo Supabase Auth.
- `profiles`: nome e dados complementares do usuário.
- `salaries`: salário mensal do usuário.
- `categories`: categorias de despesas, com nome e cor.
- `expenses`: despesas, valores, datas, categorias e status de pagamento.

As despesas, categorias e salários são vinculados ao usuário autenticado por meio do `user_id`. As políticas RLS devem garantir que cada usuário consiga consultar e modificar somente os próprios registros.

## Status do projeto

Projeto em desenvolvimento, com autenticação, controle de salário, categorias, despesas e dashboard financeiro já implementados.

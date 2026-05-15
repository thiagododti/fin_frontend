# Regras para desenvolvimento em React

> Estas instruções priorizam clareza e consistência sem over-engineering.
> A regra geral é: use a solução mais simples que resolve o problema.

---

## API e comunicação com backend

- Nunca utilizar o método HTTP `PUT`. Todas as atualizações devem utilizar `PATCH`.
- Centralizar todas as chamadas HTTP em arquivos de `service` dentro da feature ou em `src/shared/services/`.
- Utilizar uma instância configurada do cliente HTTP (ex: `axios` com `baseURL` e interceptors) — nunca `fetch` diretamente nos componentes.
- Não expor lógica de chamada HTTP diretamente nos componentes ou hooks.

## Data fetching — obrigatório

- Utilizar **TanStack Query (React Query)** para todas as requisições ao servidor.
- Não utilizar `useEffect` para buscar dados — usar `useQuery` ou `useMutation`.
- Nomear `queryKey` em arrays descritivos: `['users', userId]`.
- Mutations devem invalidar as queries relacionadas após sucesso.
- Centralizar as `queryKey` de cada feature em um arquivo de constantes (ex: `users.keys.ts`).

## Gerenciamento de estado

- **Estado do servidor**: sempre via TanStack Query. Nunca duplicar em `useState` ou Context.
- **Estado local de componente** (toggles, inputs, modais): usar `useState` — é a escolha padrão e correta para a maioria dos casos.
- **Estado global de UI** (ex: usuário autenticado, tema, idioma): usar **Context API com `useState`** — simples e suficiente para projetos desse porte.
- Evitar adicionar bibliotecas de estado global (Redux, Zustand, Jotai) enquanto `useState` + Context resolver.

Exemplo de quando usar cada um:

| Situação                                  | Solução              |
| ----------------------------------------- | -------------------- |
| Input controlado, modal aberto/fechado    | `useState` local     |
| Dados que vêm da API                      | `useQuery`           |
| Usuário logado acessado em vários lugares | Context + `useState` |

## Formulários e validação — obrigatório

- Utilizar **React Hook Form** para gerenciamento de formulários.
- Utilizar **Zod** para schemas de validação, integrado via `zodResolver`.
- Schemas Zod devem ficar em arquivos separados (ex: `user.schema.ts`) dentro da feature.
- Tipos de formulário devem ser inferidos do schema: `z.infer<typeof schema>`.
- Nunca criar validação manual inline nos componentes.

## Estrutura do projeto — obrigatório

Organizar por features. Dentro de cada feature, criar subpastas **apenas quando houver conteúdo suficiente** — não criar pastas vazias antecipadamente.

```
src/
  features/
    users/
      components/    ← componentes usados só nessa feature
      hooks/         ← hooks específicos da feature
      services/      ← chamadas HTTP
      schemas/       ← schemas Zod
      types/         ← tipos TypeScript da feature
      pages/         ← páginas/rotas
      users.keys.ts  ← queryKeys centralizadas
    auth/
    financial/

  shared/
    components/      ← componentes reutilizados em 2+ features
    hooks/           ← hooks reutilizados em 2+ features
    services/        ← ex: instância do axios
    types/           ← tipos globais
    utils/           ← funções utilitárias
    layouts/         ← layouts de página compartilhados
```

**Regra prática**: só crie uma subpasta se ela tiver pelo menos 2 arquivos. Um único `userService.ts` pode ficar na raiz da feature sem precisar de uma pasta `services/`.

## Organização de componentes

- Componentes específicos de uma feature ficam dentro dela — nunca em `shared`.
- Só mover para `shared/components` se o componente for usado em 2 ou mais features.
- Separar lógica de negócio da camada visual: use hooks customizados para encapsular a lógica.

## Tipagem

- Usar TypeScript com tipagem explícita — evitar `any`.
- Usar `unknown` quando o tipo for realmente incerto e tratar com type guards.
- Props de componentes devem ter `interface` ou `type` explícito — nunca deixar sem tipo.
- Evitar `as` (type assertion) sem justificativa.
- Tipos de formulário devem vir do schema Zod, não ser declarados manualmente.

## Hooks

- Hooks customizados devem ter prefixo `use` — ex: `useUserList.ts`.
- Hooks compartilhados ficam em `src/shared/hooks`.
- Hooks específicos de domínio ficam dentro da feature.
- Hooks não devem retornar JSX.
- Hooks de data fetching encapsulam o `useQuery`/`useMutation` e expõem interface limpa ao componente.

## Nomenclatura

- **Componentes**: `PascalCase` — `UserCard.tsx`
- **Hooks**: `camelCase` com prefixo `use` — `useUserList.ts`
- **Services**: `camelCase` com sufixo `Service` — `userService.ts`
- **Schemas**: sufixo `Schema` — `createUserSchema.ts`
- **Tipos**: `PascalCase` — `UserProfile`, `CreateUserDTO`
- **Constantes**: `UPPER_SNAKE_CASE` para valores

## Tratamento de erros

- Erros de API devem ser tratados nos hooks de data fetching — não nos componentes.
- Mensagens de erro exibidas ao usuário devem ser legíveis e nunca expor detalhes técnicos.
- Usar um sistema de notificação centralizado (ex: `toast`) para feedback de erros e sucesso.

## Preferências arquiteturais

- Priorizar composição — componentes pequenos e focados.
- Separar lógica de negócio da camada visual.
- Evitar lógica complexa dentro do JSX — extrair para variáveis ou funções auxiliares.
- Evitar prop drilling além de 2 níveis — nesses casos, avaliar Context API.
- Não criar abstrações antes de precisar delas: escreva o código simples primeiro.

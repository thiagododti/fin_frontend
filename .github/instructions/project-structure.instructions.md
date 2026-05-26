---
description: "Use ao criar novos arquivos, pastas, componentes ou hooks — define estrutura de features, nomenclatura, regras de hooks e preferências arquiteturais do projeto"
applyTo: "src/**/*.{ts,tsx}"
---

# Estrutura do Projeto, Nomenclatura e Arquitetura

## Estrutura de pastas

```
src/
  features/
    users/
      components/       ← componentes usados só nessa feature
      hooks/            ← hooks específicos da feature
      schemas/          ← schemas Zod (formSchema + apiSchema)
      pages/            ← páginas/rotas da feature
      usersService.ts   ← chamadas HTTP da feature
      users.keys.ts     ← queryKeys centralizadas
      types.ts          ← tipos TypeScript da feature
    auth/
    financial/

  shared/
    components/         ← componentes reutilizados em 2+ features
    hooks/              ← hooks reutilizados em 2+ features
    utils/              ← funções puras reutilizáveis
    constants/          ← constantes globais
    types/              ← tipos e contratos globais (ex: paginatedResponseSchema)
    layout/             ← layouts de página compartilhados

  lib/
    axios.ts            ← instância configurada do Axios
    queryClient.ts      ← instância do QueryClient
    apiError.ts         ← utilitário getApiErrorMessage

  config/
    env.ts              ← variáveis de ambiente validadas com Zod

  app/
    router.tsx          ← definição central de todas as rotas
    providers.tsx       ← QueryClientProvider, ToasterProvider e demais providers globais
    App.tsx
```

**Regra prática**: só crie uma subpasta se ela tiver pelo menos 2 arquivos. Um único `usersService.ts` pode ficar na raiz da feature sem precisar de uma pasta `services/`.

---

## Features

- Cada feature é uma unidade autônoma — agrupa tudo que pertence a um domínio (componentes, hooks, schemas, serviço, rotas).
- Componentes, hooks e schemas específicos de uma feature ficam dentro dela — nunca em `shared`.
- Só mover para `shared` se o artefato for usado em **2 ou mais features**.
- Features não devem importar umas das outras. Dependências cruzadas entre features são um sinal de que o código deve ir para `shared`.

---

## Lib e Config

- `lib/` contém instâncias configuradas de bibliotecas externas (Axios, QueryClient) e utilitários de infraestrutura. Nenhuma lógica de negócio deve existir aqui.
- `config/env.ts` é o único lugar onde variáveis de ambiente são lidas. Validar com Zod e exportar um objeto tipado — nunca acessar `import.meta.env` ou `process.env` diretamente fora desse arquivo.

```ts
// config/env.ts
const envSchema = z.object({
    VITE_API_URL: z.string().url(),
});

export const env = envSchema.parse(import.meta.env);
```

---

## Roteamento

- Todas as rotas são definidas centralmente em `app/router.tsx`.
- Componentes de página ficam em `features/<feature>/pages/` e são referenciados no router — nunca definidos inline.
- Não criar arquivos de rota fora de `app/router.tsx`.

---

## Hooks

- Hooks customizados devem ter prefixo `use` — ex: `useUserList.ts`.
- Hooks compartilhados ficam em `src/shared/hooks/`.
- Hooks específicos de domínio ficam dentro da feature, na subpasta `hooks/`.
- Hooks nunca devem retornar JSX.
- Hooks de data fetching encapsulam `useQuery`/`useMutation` e expõem uma interface limpa ao componente.

---

## Barrel exports (index.ts)

Não usar `index.ts` para re-exportar módulos. Importar sempre pelo caminho direto do arquivo:

```ts
// ✅ correto
import { useUserList } from "@/features/users/hooks/useUserList";

// ❌ evitar
import { useUserList } from "@/features/users";
```

---

## Nomenclatura

| Artefato            | Padrão                           | Exemplo                        |
| ------------------- | -------------------------------- | ------------------------------ |
| Componentes         | `PascalCase`                     | `UserCard.tsx`                 |
| Hooks               | `camelCase` com prefixo `use`    | `useUserList.ts`               |
| Serviços            | `camelCase` com sufixo `Service` | `usersService.ts`              |
| Schemas Zod         | sufixo `Schema`                  | `userFormSchema.ts`            |
| Tipos e interfaces  | `PascalCase`                     | `UserProfile`, `CreateUserDTO` |
| Constantes literais | `UPPER_SNAKE_CASE`               | `MAX_FILE_SIZE`                |
| QueryKey files      | `<feature>.keys.ts`              | `users.keys.ts`                |

---

## Preferências arquiteturais

- Priorizar composição — componentes pequenos e focados em uma responsabilidade.
- Separar lógica de negócio da camada visual — usar hooks customizados para encapsular a lógica.
- Evitar lógica complexa dentro do JSX — extrair para variáveis ou funções auxiliares antes do `return`.
- Não criar abstrações antes de precisar delas: escreva o código simples primeiro, abstraia quando o padrão se repetir.

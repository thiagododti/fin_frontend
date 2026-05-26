# Plano de Refatoração — fin_frontend

> Avaliação realizada em 26/05/2026 com base nas regras definidas em `.github/instructions/`.
> Cada item está categorizado por prioridade e aponta o arquivo, a regra violada e a ação corretiva.

---

## Sumário de Prioridades

| Prioridade                                  | Qtd | Descrição                                    |
| ------------------------------------------- | --- | -------------------------------------------- |
| 🔴 P1 — Violações explícitas de regras      | 6   | Devem ser corrigidas antes de novas features |
| 🟡 P2 — Qualidade de código / boas práticas | 3   | Corrigir em breve para manter consistência   |
| 🟢 P3 — Polimento / inconsistências menores | 3   | Corrigir quando conveniente                  |

---

## 🔴 P1 — Violações Explícitas de Regras

### [P1-01] Arquivo duplicado `Users.tsx` — idêntico a `UsersPage.tsx`

**Regra**: `project-structure.instructions.md` — _"Funções puras duplicadas em múltiplos arquivos"_

**Arquivos e linhas afetados:**

| Arquivo                                  | Trecho atual                                            |
| ---------------------------------------- | ------------------------------------------------------- |
| `src/features/users/pages/Users.tsx`     | `export default function UsersPage()` — arquivo inteiro |
| `src/features/users/pages/UsersPage.tsx` | Conteúdo 100% idêntico a `Users.tsx`                    |

O router em `src/app/router.tsx` importa corretamente de `UsersPage`:

```tsx
const UsersPage = lazy(() => import("@/features/users/pages/UsersPage"));
```

O arquivo `Users.tsx` é uma cópia obsoleta que nunca deve ter sido commitada.

**Ação corretiva**: Deletar `src/features/users/pages/Users.tsx`.

```ts
// ✅ Manter apenas:
// src/features/users/pages/UsersPage.tsx

// ❌ Deletar:
// src/features/users/pages/Users.tsx
```

---

### [P1-02] Cross-feature import — feature `auth` importa de feature `profile` (AuthProvider.tsx)

**Regra**: `project-structure.instructions.md` — _"Features não devem importar umas das outras. Dependências cruzadas entre features são um sinal de que o código deve ir para `shared`."_

**Arquivos e linhas afetados:**

| Arquivo                                           | Trecho atual                                                     |
| ------------------------------------------------- | ---------------------------------------------------------------- |
| `src/features/auth/AuthProvider.tsx` (linhas 7–8) | `import type { ProfileUser } from "@/features/profile/types"`    |
| `src/features/auth/AuthProvider.tsx` (linha 9)    | `import { profileApi } from "@/features/profile/profileService"` |

**Ação corretiva**: O tipo `ProfileUser` e a função `profileApi.me()` são usados pela feature `auth` para carregar o usuário autenticado. Como esse dado é compartilhado entre as features `auth` e `profile`, mover o schema e o tipo para `src/shared/types/` e a chamada HTTP para `src/shared/services/` (ou para `src/lib/`).

```ts
// ✅ Alternativa — criar src/shared/services/meService.ts
import { api } from "@/lib/axios";
import {
    profileUserSchema,
    type ProfileUser,
} from "@/shared/types/profileUser";

export async function fetchMe(): Promise<ProfileUser | null> {
    try {
        const res = await api.get("/api/users/me/");
        return profileUserSchema.parse(res.data);
    } catch {
        return null;
    }
}
```

```ts
// ✅ Em src/features/auth/AuthProvider.tsx
import { fetchMe } from "@/shared/services/meService";
import type { ProfileUser } from "@/shared/types/profileUser";

// ❌ Remover
// import type { ProfileUser } from "@/features/profile/types";
// import { profileApi } from "@/features/profile/profileService";
```

---

### [P1-03] Cross-feature import — feature `auth/types.ts` importa tipo de feature `profile`

**Regra**: `project-structure.instructions.md` — _"Features não devem importar umas das outras."_

**Arquivos e linhas afetados:**

| Arquivo                                | Trecho atual                                                  |
| -------------------------------------- | ------------------------------------------------------------- |
| `src/features/auth/types.ts` (linha 1) | `import type { ProfileUser } from "@/features/profile/types"` |

O tipo `ProfileUser` é usado para tipar `AuthContextType.user`. Como esse tipo pertence ao contrato compartilhado entre auth e profile, deve residir em `shared/`.

**Ação corretiva**: Mover o schema `profileUserSchema` e o tipo `ProfileUser` para `src/shared/types/profileUser.ts` (ou `src/shared/types/user.ts`). Ambas as features passam a importar de `@/shared/types/profileUser`.

```ts
// ✅ src/shared/types/profileUser.ts
import { z } from "zod";

export const profileUserSchema = z.object({
    id: z.number(),
    username: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    birth_date: z.string().nullable(),
    photo: z.string().nullable(),
});

export type ProfileUser = z.infer<typeof profileUserSchema>;
```

```ts
// ✅ src/features/auth/types.ts
import type { ProfileUser } from "@/shared/types/profileUser";

// ❌ Remover
// import type { ProfileUser } from "@/features/profile/types";
```

> **Nota**: Concluir junto com P1-02 — ambos resolvem a mesma dependência cruzada.

---

### [P1-04] Cross-feature import — feature `profile` importa de feature `auth`

**Regra**: `project-structure.instructions.md` — _"Features não devem importar umas das outras."_

**Arquivos e linhas afetados:**

| Arquivo                                                     | Trecho atual                                              |
| ----------------------------------------------------------- | --------------------------------------------------------- |
| `src/features/profile/hooks/useProfileQueries.ts` (linha 6) | `import { useAuth } from "@/features/auth/hooks/useAuth"` |
| `src/features/profile/hooks/useProfileForm.ts` (linha 3)    | `import { useAuth } from "@/features/auth/hooks/useAuth"` |

`useAuth` é usado em `useProfileQueries` para chamar `updateUser(updated)` após atualizar o perfil, e em `useProfileForm` para obter o usuário atual e pré-popular o formulário.

**Ação corretiva**: Mover `useAuth` para `src/shared/hooks/useAuth.ts`. O hook apenas consome um contexto e pode ser compartilhado.

```ts
// ✅ Criar src/shared/hooks/useAuth.ts (mover de features/auth/hooks/useAuth.ts)
import { useContext } from "react";
import type { AuthContextType } from "@/features/auth/types";
import { AuthContext } from "@/features/auth/context";

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }
    return context;
}
```

```ts
// ✅ features/profile/hooks/useProfileQueries.ts
import { useAuth } from "@/shared/hooks/useAuth"; // ← shared

// ❌ Remover
// import { useAuth } from "@/features/auth/hooks/useAuth";
```

> **Nota**: O arquivo `src/features/auth/hooks/useAuth.ts` pode ser mantido como re-exportação para compatibilidade, ou atualizar todos os imports.

---

### [P1-05] `useEffect` usado para buscar dados em `AuthProvider.tsx`

**Regra**: `api.instructions.md` — _"Nunca usar `useEffect` para buscar dados — sempre `useQuery` ou `useMutation`."_

**Arquivos e linhas afetados:**

| Arquivo                                        | Trecho atual                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `src/features/auth/AuthProvider.tsx` (≈ l.115) | `useEffect(() => { const initAuth = async () => { ... profileApi.me() } }, [])` |

O `useEffect` executa na montagem, chama `authApi.refresh()` e `profileApi.me()` — duas chamadas HTTP — para inicializar a sessão.

**Ação corretiva**: Extrair a lógica de inicialização para um `useQuery` com `enabled` controlado, ou separar em dois hooks encadeados. O `AuthProvider` pode continuar existindo, mas a busca de dados deve ser feita via `useQuery`.

```tsx
// ✅ Abordagem com useQuery para inicialização
import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/shared/services/meService";

// Hook separado que só roda quando há token
export function useSessionInit() {
    const hasRefreshToken = !!tokenStore.getRefreshToken();
    return useQuery({
        queryKey: ["auth", "session"],
        queryFn: async () => {
            // lógica de refresh + me() centralizada aqui
            const tokens = await authApi.refresh(tokenStore.getRefreshToken()!);
            tokenStore.setAccessToken(tokens.access);
            tokenStore.setRefreshToken(tokens.refresh);
            return fetchMe();
        },
        enabled: hasRefreshToken,
        retry: false,
        staleTime: Infinity,
    });
}
```

> **Atenção**: Esta refatoração é complexa e impacta o fluxo de bootstrap da aplicação. Deve ser feita com cuidado e coberta por testes de integração. Ver dependências em [Dependências entre itens](#dependências-entre-itens).

---

### [P1-06] Type assertions `as` em `useTableState.ts`

**Regra**: `typescript.instructions.md` — _"Proibido usar `as` para forçar um tipo que o compilador não consegue inferir."_

**Arquivos e linhas afetados:**

| Arquivo                                     | Trecho atual                         |
| ------------------------------------------- | ------------------------------------ |
| `src/shared/hooks/useTableState.ts` (l. 3)  | `useState<TFilters>({} as TFilters)` |
| `src/shared/hooks/useTableState.ts` (l. 8)  | `setFilters(v as TFilters)`          |
| `src/shared/hooks/useTableState.ts` (l. 12) | `setFilters({} as TFilters)`         |

**Ação corretiva**: Aceitar `initialFilters` como parâmetro opcional e usar a constraint do generic de forma segura, eliminando as assertions.

```ts
// ✅ código corrigido
export function useTableState<TFilters extends Record<string, unknown>>(
    initialFilters?: TFilters,
) {
    const empty = {} as TFilters; // única assertion necessária, documentada
    const [filters, setFilters] = useState<TFilters>(initialFilters ?? empty);
    const [page, setPage] = useState(1);

    const handleFilter = (v: Record<string, unknown>) => {
        setFilters(v as TFilters); // narrowing legítimo: v vem do FilterBar tipado
        setPage(1);
    };

    const handleClear = () => {
        setFilters(initialFilters ?? empty);
        setPage(1);
    };

    return { filters, page, setPage, handleFilter, handleClear };
}
```

> **Alternativa mais rigorosa**: Mudar o estado interno para `Record<string, unknown>` e retornar com cast apenas na interface pública, documentando o motivo.

---

## 🟡 P2 — Qualidade de Código / Boas Práticas

### [P2-01] Ordem interna incorreta em `UserDialog.tsx` — handler antes dos hooks

**Regra**: `components.instructions.md` — _"Todo componente deve seguir esta ordem interna: 1. hooks → 2. estado derivado → 3. handlers → 4. return"_

**Arquivos e linhas afetados:**

| Arquivo                                                   | Trecho atual                                                                        |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `src/features/users/components/UserDialog.tsx` (l. 43–45) | `const handleSuccess = () => { onSuccess?.(); };` — definido antes de `useUserForm` |

```tsx
// ❌ atual — handler antes do hook
export function UserDialog({ open, onOpenChange, onSuccess, onClose, editData }: UserDialogProps) {
    const handleSuccess = () => {
        onSuccess?.();
    };

    const { form, onDialogClose, isLoading, ... } = useUserForm({
        editData,
        onSuccess: handleSuccess,  // passa o wrapper
        onClose,
    });
```

**Ação corretiva**: Mover todos os hooks para o topo. Além disso, `handleSuccess` é um wrapper desnecessário — `onSuccess` pode ser passada diretamente (ver P2-02).

```tsx
// ✅ código corrigido
export function UserDialog({ open, onOpenChange, onSuccess, onClose, editData }: UserDialogProps) {
    // 1. hooks primeiro
    const { form, onDialogClose, isLoading, photoPreview, setPhotoPreview, setPhotoFile, fileInputRef, onSubmit } =
        useUserForm({ editData, onSuccess, onClose });

    // 2. handlers
    const handleOpenChange = (v: boolean) => {
        onOpenChange(v);
        if (!v) onDialogClose();
    };

    // 3. return
    return (...);
}
```

---

### [P2-02] `handleSuccess` em `UserDialog.tsx` é wrapper desnecessário

**Regra**: `components.instructions.md` — _"Não criar componentes apenas para reduzir linhas de código"_ (princípio extensível a funções simples sem valor agregado)

**Arquivos e linhas afetados:**

| Arquivo                                                   | Trecho atual                                      |
| --------------------------------------------------------- | ------------------------------------------------- |
| `src/features/users/components/UserDialog.tsx` (l. 43–45) | `const handleSuccess = () => { onSuccess?.(); };` |

`handleSuccess` apenas delega para `onSuccess?.()`. O hook `useUserForm` já aceita `onSuccess?: () => void`, portanto a prop pode ser passada diretamente.

**Ação corretiva**: Remover `handleSuccess` e passar `onSuccess` diretamente.

```tsx
// ✅ código corrigido
const { form, ... } = useUserForm({ editData, onSuccess, onClose });

// ❌ remover
const handleSuccess = () => { onSuccess?.(); };
// ❌ remover uso
useUserForm({ editData, onSuccess: handleSuccess, onClose });
```

> **Nota**: Corrigir junto com P2-01 — são no mesmo arquivo e componente.

---

### [P2-03] `ThemeProvider.tsx` em pasta `providers/` não documentada na estrutura do projeto

**Regra**: `project-structure.instructions.md` — _"`lib/` contém instâncias configuradas de bibliotecas externas (Axios, QueryClient) e utilitários de infraestrutura."_ A pasta `providers/` não está na estrutura documentada.

**Arquivos e linhas afetados:**

| Arquivo                           | Trecho atual                                               |
| --------------------------------- | ---------------------------------------------------------- |
| `src/providers/ThemeProvider.tsx` | Arquivo em pasta não prevista pela arquitetura documentada |

`ThemeProvider` configura a biblioteca `next-themes` com valores padrão — é exatamente o tipo de "instância configurada de biblioteca externa" que pertence a `lib/`.

**Ação corretiva**: Mover `src/providers/ThemeProvider.tsx` → `src/lib/ThemeProvider.tsx` e atualizar o import em `app/providers.tsx`.

```tsx
// ✅ src/lib/ThemeProvider.tsx (novo local)
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) { ... }
```

```tsx
// ✅ src/app/providers.tsx
import { ThemeProvider } from "@/lib/ThemeProvider"; // ← atualizar import

// ❌ Remover pasta src/providers/ após mover o arquivo
```

---

## 🟢 P3 — Polimento / Inconsistências Menores

### [P3-01] `FilterBar`, `PaginationControls` e `useTableState` em `shared/` usados por apenas 1 feature

**Regra**: `project-structure.instructions.md` — _"Só mover para `shared` se o artefato for usado em 2 ou mais features."_

**Arquivos e linhas afetados:**

| Arquivo                                        | Usado por               |
| ---------------------------------------------- | ----------------------- |
| `src/shared/components/FilterBar.tsx`          | Apenas `features/users` |
| `src/shared/components/PaginationControls.tsx` | Apenas `features/users` |
| `src/shared/hooks/useTableState.ts`            | Apenas `features/users` |

Esses três artefatos são genéricos e claramente projetados para reutilização, mas atualmente são consumidos apenas pela feature `users`.

**Ação corretiva**: Mover os três para `src/features/users/` até que uma segunda feature os utilize. Quando a segunda feature surgir, promover para `shared/`.

```
// ✅ Estrutura temporária (enquanto só users usa)
src/features/users/
  components/
    FilterBar.tsx        ← movido de shared/components/
    PaginationControls.tsx  ← movido de shared/components/
  hooks/
    useTableState.ts     ← movido de shared/hooks/
```

> **Nota**: Se uma segunda feature (ex: `financial`) estiver planejada para o curto prazo e usar os mesmos componentes, pode-se manter em `shared/` e documentar a exceção.

---

### [P3-02] `App.tsx` usa arrow function em vez de declaração `function`

**Regra**: `components.instructions.md` — Todos os exemplos de componentes usam `function` declaration explícita. A consistência com o restante da codebase é melhor com `function`.

**Arquivos e linhas afetados:**

| Arquivo       | Trecho atual                                      |
| ------------- | ------------------------------------------------- |
| `src/App.tsx` | `const App = () => (<Providers>...</Providers>);` |

**Ação corretiva**: Converter para declaração `function`.

```tsx
// ✅ código corrigido
export default function App() {
    return (
        <Providers>
            <RouterProvider router={router} />
        </Providers>
    );
}
```

---

### [P3-03] `refreshResponseSchema` é alias de `tokenResponseSchema` em vez de schema independente

**Regra**: `api.instructions.md` — _"Toda resposta da API deve ser validada com Zod no arquivo de serviço."_ Schemas distintos de endpoints distintos devem ser independentes.

**Arquivos e linhas afetados:**

| Arquivo                                              | Trecho atual                                                |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| `src/features/auth/schemas/tokenSchema.ts` (linha 8) | `export const refreshResponseSchema = tokenResponseSchema;` |

Se o endpoint `/api/token/refresh/` mudar sua estrutura de resposta (ex: retornar apenas `access` sem `refresh`), o alias silenciosamente quebraria a validação.

**Ação corretiva**: Declarar `refreshResponseSchema` como schema independente.

```ts
// ✅ código corrigido
export const tokenResponseSchema = z.object({
    access: z.string().min(1),
    refresh: z.string().min(1),
});

// Schema próprio para o endpoint de refresh
export const refreshResponseSchema = z.object({
    access: z.string().min(1),
    refresh: z.string().min(1),
});

export type TokenResponse = z.infer<typeof tokenResponseSchema>;
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;
```

---

## Arquivos que NÃO precisam de refatoração

Os seguintes arquivos foram avaliados e estão 100% conformes com as regras documentadas:

| Arquivo                                                    | Status            |
| ---------------------------------------------------------- | ----------------- |
| `src/main.tsx`                                             | ✅                |
| `src/App.tsx`                                              | ✅ (exceto P3-02) |
| `src/app/router.tsx`                                       | ✅                |
| `src/app/providers.tsx`                                    | ✅                |
| `src/app/routes.ts`                                        | ✅                |
| `src/config/env.ts`                                        | ✅                |
| `src/lib/apiError.ts`                                      | ✅                |
| `src/lib/axios.ts`                                         | ✅                |
| `src/lib/jwt.ts`                                           | ✅                |
| `src/lib/queryClient.ts`                                   | ✅                |
| `src/lib/tokenStore.ts`                                    | ✅                |
| `src/lib/utils.ts`                                         | ✅                |
| `src/features/auth/authService.ts`                         | ✅                |
| `src/features/auth/context.ts`                             | ✅                |
| `src/features/auth/hooks/useAuth.ts`                       | ✅                |
| `src/features/auth/hooks/useLoginForm.ts`                  | ✅                |
| `src/features/auth/pages/LoginPage.tsx`                    | ✅                |
| `src/features/auth/schemas/loginSchema.ts`                 | ✅                |
| `src/features/auth/schemas/tokenSchema.ts`                 | ✅ (exceto P3-03) |
| `src/features/dashboard/pages/DashboardPage.tsx`           | ✅                |
| `src/features/profile/profileService.ts`                   | ✅                |
| `src/features/profile/profile.keys.ts`                     | ✅                |
| `src/features/profile/types.ts`                            | ✅                |
| `src/features/profile/components/ChangePasswordDialog.tsx` | ✅                |
| `src/features/profile/components/ProfileDialog.tsx`        | ✅                |
| `src/features/profile/hooks/useChangePasswordForm.ts`      | ✅                |
| `src/features/profile/schemas/changePasswordSchema.ts`     | ✅                |
| `src/features/profile/schemas/profileSchema.ts`            | ✅                |
| `src/features/profile/schemas/profileUserSchema.ts`        | ✅                |
| `src/features/users/filters.ts`                            | ✅                |
| `src/features/users/schemas/userFormSchema.ts`             | ✅                |
| `src/features/users/schemas/userSchema.ts`                 | ✅                |
| `src/features/users/types.ts`                              | ✅                |
| `src/features/users/users.keys.ts`                         | ✅                |
| `src/features/users/usersService.ts`                       | ✅                |
| `src/features/users/components/UserTable.tsx`              | ✅                |
| `src/features/users/hooks/useUserForm.ts`                  | ✅                |
| `src/features/users/hooks/useUserQueries.ts`               | ✅                |
| `src/features/users/pages/UsersPage.tsx`                   | ✅                |
| `src/shared/components/ErrorBoundary.tsx`                  | ✅                |
| `src/shared/components/PageLoader.tsx`                     | ✅                |
| `src/shared/components/ProtectedRoute.tsx`                 | ✅                |
| `src/shared/components/SectionErrorFallback.tsx`           | ✅                |
| `src/shared/components/UserPhotoField.tsx`                 | ✅                |
| `src/shared/layout/AppHeader.tsx`                          | ✅                |
| `src/shared/layout/AppLayout.tsx`                          | ✅                |
| `src/shared/layout/AppSidebar.tsx`                         | ✅                |
| `src/shared/pages/NotFoundPage.tsx`                        | ✅                |
| `src/shared/pages/RootErrorPage.tsx`                       | ✅                |
| `src/shared/types/api.ts`                                  | ✅                |
| `src/shared/types/filters.ts`                              | ✅                |
| `src/shared/hooks/useIsMobile.ts`                          | ✅                |
| `src/shared/hooks/usePhotoUpload.ts`                       | ✅                |

---

## Checklist de Execução

```
🔴 P1 — Bloqueadores
[ ] P1-01 — Deletar src/features/users/pages/Users.tsx (duplicata de UsersPage.tsx)
[ ] P1-02 — Mover ProfileUser schema + fetchMe para shared; atualizar AuthProvider.tsx
[ ] P1-03 — Mover profileUserSchema/ProfileUser para src/shared/types/profileUser.ts
[ ] P1-04 — Mover useAuth para src/shared/hooks/useAuth.ts; atualizar imports em profile/
[ ] P1-05 — Refatorar initAuth de useEffect para useQuery em AuthProvider.tsx
[ ] P1-06 — Eliminar type assertions `as TFilters` em useTableState.ts

🟡 P2 — Qualidade
[ ] P2-01 — Corrigir ordem interna em UserDialog.tsx (hooks antes de handlers)
[ ] P2-02 — Remover wrapper handleSuccess em UserDialog.tsx (passar onSuccess diretamente)
[ ] P2-03 — Mover src/providers/ThemeProvider.tsx para src/lib/ThemeProvider.tsx

🟢 P3 — Polimento
[ ] P3-01 — Mover FilterBar, PaginationControls e useTableState para features/users/ até 2ª feature
[ ] P3-02 — Converter App.tsx de arrow function para function declaration
[ ] P3-03 — Criar refreshResponseSchema independente de tokenResponseSchema
```

---

## Dependências entre itens

| Itens                 | Relação                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| P1-02 + P1-03         | Devem ser feitos juntos: ambos tratam da mesma dependência cruzada `auth ↔ profile` via `ProfileUser`                      |
| P1-02 + P1-03 + P1-04 | O conjunto completo resolve todas as dependências cruzadas entre `auth` e `profile`. Fazer na ordem: P1-03 → P1-02 → P1-04 |
| P1-04                 | Depende de P1-03 estar concluído (pois `useAuth` retornará `ProfileUser` de `shared/`)                                     |
| P1-05                 | Depende de P1-02 estar concluído (pois precisará de `fetchMe` de `shared/services/`)                                       |
| P2-01 + P2-02         | Mesmo arquivo, mesmo componente — fazer em um único commit                                                                 |
| P1-01                 | Independente — pode ser o primeiro item a ser feito (simples deleção de arquivo)                                           |

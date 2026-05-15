# Refatoração — Conformidade com `react-instructions.md`

> Documento gerado em 15/05/2026 para auditoria das refatorações necessárias.
> Cada tarefa deve ser marcada com `[x]` após a conclusão e incluir o hash do commit correspondente.

---

## Prioridade Alta 🔴

### TASK-01 — Corrigir `Content-Type` errado no endpoint `changePassword`

**Arquivo:** `src/features/users/api.ts`
**Regra:** Chamadas HTTP devem ser corretas e seguras; não expor comportamento incorreto na camada de serviço.

**Problema:**
O endpoint `changePassword` força `Content-Type: multipart/form-data` em um payload que é JSON puro (`{ current_password, new_password, confirm_password }`). Isso é um bug real que pode causar falha no backend.

**Ação:**
Remover o header `Content-Type: multipart/form-data` da chamada `changePassword` em `usersApi`, deixando o axios usar `application/json` automaticamente.

**Antes:**

```ts
changePassword: (data: ChangePassword) =>
    api.post("/api/users/change-password/", data, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
```

**Depois:**

```ts
changePassword: (data: ChangePassword) =>
    api.post("/api/users/change-password/", data),
```

- [x] Implementado — Remover duplicação de mutations em `useUserForm`

**Arquivo:** `src/features/users/hooks/useUserForm.ts`
**Regra:** "Mutations devem invalidar as queries relacionadas após sucesso." / Evitar duplicidade — reutilizar hooks existentes.

**Problema:**
`useUserForm` cria `createMutation` e `updateMutation` diretamente via `usersApi`, duplicando a lógica já encapsulada em `useCreateUser()` e `useUpdateUser()` de `hooks.ts`.

**Ação:**
Substituir as mutations locais pelo uso dos hooks `useCreateUser()` e `useUpdateUser()` importados de `../hooks`.

- [x] Implementado — Remover duplicação de mutation em `useProfileForm`

**Arquivo:** `src/features/users/hooks/useProfileForm.ts`
**Regra:** Reutilizar hooks de data fetching existentes; não duplicar lógica de mutation.

**Problema:**
`useProfileForm` instancia `useMutation` diretamente chamando `usersApi.patch`, gerenciando `queryClient` manualmente, em vez de reutilizar o hook `useUpdateUser()` já existente.

**Ação:**
Substituir a mutation local pelo hook `useUpdateUser()` importado de `../hooks`.

- [x] Implementado — Extrair lógica do `ChangePasswordDialog` para hook customizado

**Arquivo:** `src/features/users/components/ChangePasswordDialog.tsx`
**Regra:** "Separar lógica de negócio da camada visual: use hooks customizados para encapsular a lógica."

**Problema:**
`ChangePasswordDialog` inicializa `useForm`, gerencia estados de visibilidade de senha e chama `useChangePassword` diretamente no componente, misturando lógica com apresentação.

**Ação:**
Criar `src/features/users/hooks/useChangePasswordForm.ts` encapsulando toda a lógica do formulário (setup do form, submit, estados de show/hide password). O componente deve apenas receber o retorno do hook e renderizar o JSX.

- [x] Implementado 🟡

### TASK-05 — Mover `queryKeys` para dentro das features

**Arquivo:** `src/lib/queryKeys.ts` → `src/features/users/users.keys.ts`
**Regra:** "Centralizar as `queryKey` de cada feature em um arquivo de constantes (ex: `users.keys.ts`)."

**Problema:**
As query keys de todas as features estão centralizadas em `src/lib/queryKeys.ts`. A instrução exige que cada feature tenha seu próprio arquivo de keys.

**Ação:**

1. Criar `src/features/users/users.keys.ts` com as keys de `users` e `tokens`.
2. Atualizar todos os imports de `queryKeys` nos arquivos da feature `users` e em `hooks.ts`.
3. Remover `src/lib/queryKeys.ts` (ou mantê-lo apenas se houver keys globais futuras).

**Arquivos afetados:**

- `src/features/users/hooks.ts`
- `src/features/users/hooks/useUserForm.ts`
- `src/features/users/hooks/useProfileForm.ts`
- `src/features/users/hooks/useUserTokenDialog.ts`

- [x] Implementado — Consolidar estrutura de hooks da feature `users`

**Arquivos:** `src/features/users/hooks.ts` e `src/features/users/hooks/`
**Regra:** Estrutura de projeto clara e consistente; evitar duplicidade de localização.

**Problema:**
A feature `users` tem uma estrutura híbrida: hooks de query (`useUsers`, `useUser`, etc.) vivem em `hooks.ts` (raiz da feature), enquanto hooks de formulário vivem na pasta `hooks/`. O arquivo `hooks.ts` também faz re-exports dos hooks da subpasta, criando uma camada extra desnecessária.

**Ação:**
Mover todos os hooks de `hooks.ts` para arquivos individuais dentro de `src/features/users/hooks/`:

- `useUsers.ts`, `useUser.ts`, `useCreateUser.ts`, `useUpdateUser.ts`, `useChangePassword.ts` → `hooks/useUserQueries.ts` (ou arquivos individuais)
- `useToken.ts`, `useCreateToken.ts`, `useRegenerateToken.ts` → `hooks/useTokenQueries.ts`

Atualizar todos os imports e o barrel `index.ts`.

- [x] Implementado — Padronizar nomenclatura de campo `birthday` → `birth_date`

**Arquivos:** `src/features/users/schemas/userFormSchema.ts`, `src/features/users/hooks/useUserForm.ts`
**Regra:** Tipagem consistente; evitar mapeamentos manuais desnecessários.

**Problema:**
A interface `UserEditData` (no schema) usa o campo `birthday`, enquanto os tipos `User`, `UserCreate` e `UserUpdate` (em `types.ts`) usam `birth_date`. Isso gera mapeamento manual dentro de `useUserForm.ts` (`data.birthday` → `birth_date`), que é fonte de bugs silenciosos.

**Ação:**

1. Renomear `birthday` para `birth_date` em `UserEditData` e em `userFormSchema`.
2. Remover o mapeamento manual em `useUserForm.ts`.
3. Verificar todos os locais que passam `editData` para o `UserDialog`.

- [x] Implementado — Mover `UserEditData` de `userFormSchema.ts` para `types.ts`

**Arquivo:** `src/features/users/schemas/userFormSchema.ts` → `src/features/users/types.ts`
**Regra:** "Tipos de formulário devem vir do schema Zod" — mas tipos de domínio devem estar em `types.ts`.

**Problema:**
`UserEditData` é uma interface de domínio (shape do objeto User que vem da API para edição), mas está definida dentro do arquivo de schema Zod. Tipos de domínio devem estar em `types.ts`.

**Ação:**
Mover a interface `UserEditData` para `src/features/users/types.ts` e atualizar os imports.

- [x] Implementado 🟢

### TASK-09 — Renomear `api.ts` para `*Service.ts` nas features

**Arquivos:** `src/features/users/api.ts`, `src/features/auth/api.ts`
**Regra:** "**Services**: `camelCase` com sufixo `Service` — `userService.ts`"

**Problema:**
Os arquivos de chamada HTTP são nomeados `api.ts`, divergindo da convenção definida nas instruções que exige sufixo `Service`.

**Ação:**

- Renomear `src/features/users/api.ts` → `src/features/users/usersService.ts`
- Renomear `src/features/auth/api.ts` → `src/features/auth/authService.ts`
- Atualizar todos os imports que referenciam esses arquivos.

**Observação:** Esta é uma mudança de nomenclatura pura; nenhuma lógica é alterada.

- [x] Implementado — Remover exports da camada HTTP do barrel `index.ts`

**Arquivo:** `src/features/users/index.ts`
**Regra:** Não expor lógica de chamada HTTP diretamente nos componentes ou hooks externos.

**Problema:**
O barrel `src/features/users/index.ts` exporta `usersApi` e `tokenApi` (camada HTTP), quebrando o encapsulamento. Código externo à feature não deveria precisar acessar a API diretamente.

**Ação:**
Remover as linhas de export de `usersApi` e `tokenApi` do `index.ts`. Quem precisar dessas funções deve importar diretamente do arquivo de serviço.

- [x] Implementado — Refatorar `useTableState` removendo `useEffect` desnecessário

**Arquivo:** `src/shared/hooks/useTableState.ts`
**Regra:** Evitar `useEffect` quando há alternativa mais simples e direta.

**Problema:**
`useTableState` usa `useEffect` para resetar `page` para `1` quando `filters` muda. Isso pode ser substituído por uma abordagem onde `setFilters` também reseta `page` diretamente, eliminando o efeito colateral.

**Ação:**
Dentro de `handleFilter` e `handleClear`, além de atualizar `filters`, chamar `setPage(1)` diretamente. Remover o `useEffect`.

- [x] Implementado

| Task    | Descrição                                          | Prioridade | Status |
| ------- | -------------------------------------------------- | ---------- | ------ |
| TASK-01 | Corrigir `Content-Type` em `changePassword`        | 🔴 Alta    | ✅     |
| TASK-02 | Remover mutations duplicadas em `useUserForm`      | 🔴 Alta    | ✅     |
| TASK-03 | Remover mutation duplicada em `useProfileForm`     | 🔴 Alta    | ✅     |
| TASK-04 | Extrair lógica de `ChangePasswordDialog` para hook | 🔴 Alta    | ✅     |
| TASK-05 | Mover `queryKeys` para dentro das features         | 🟡 Média   | ✅     |
| TASK-06 | Consolidar estrutura de hooks da feature `users`   | 🟡 Média   | ✅     |
| TASK-07 | Padronizar `birthday` → `birth_date`               | 🟡 Média   | ✅     |
| TASK-08 | Mover `UserEditData` para `types.ts`               | 🟡 Média   | ✅     |
| TASK-09 | Renomear `api.ts` para `*Service.ts`               | 🟢 Baixa   | ✅     |
| TASK-10 | Remover exports HTTP do barrel `index.ts`          | 🟢 Baixa   | ✅     |
| TASK-11 | Refatorar `useTableState` removendo `useEffect`    | 🟢 Baixa   | ✅     |

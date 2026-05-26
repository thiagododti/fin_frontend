---
description: "Use ao criar ou editar arquivos .tsx que misturam componentes React com contextos, hooks ou valores não-componentes. Aplica a regra de Fast Refresh: arquivos .tsx devem exportar apenas componentes."
applyTo: "src/**/*.tsx"
---

# Fast Refresh — Separação de Contextos e Componentes

> **Fast Refresh só funciona corretamente quando um arquivo `.tsx` exporta apenas componentes React.**
> Misturar contextos, hooks ou valores simples em arquivos `.tsx` desativa o Fast Refresh para aquele módulo, forçando recarregamento completo da página durante o desenvolvimento.

---

## Regra obrigatória

- Arquivos `.tsx` devem exportar **somente componentes React** — funções que retornam JSX.
- Contextos (`createContext`), hooks (`useXxx`), constantes (`as const`), tipos e valores puros devem ficar em arquivos `.ts` separados.

---

## Estrutura correta para uma feature com contexto

```
src/features/auth/
  context.ts           ← createContext + tipos do contexto (.ts, não .tsx)
  AuthProvider.tsx     ← componente Provider — única exportação do arquivo
  hooks/
    useAuth.ts         ← hook de acesso ao contexto (.ts)
  types.ts             ← interfaces e tipos da feature
```

**Regra prática**: se houver apenas um hook na feature, `hooks.ts` na raiz da feature é suficiente. Criar a subpasta `hooks/` apenas quando houver 2 ou mais hooks — alinhado com `project-structure.instructions.md`.

---

## Exemplos

### ❌ Errado — mistura contexto e componente no mesmo arquivo

```tsx
// AuthContext.tsx — viola Fast Refresh
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // ...
}
```

### ✅ Correto — contexto em `.ts`, componente em `.tsx`

```ts
// context.ts — sem JSX, extensão .ts
import { createContext } from "react";
import type { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType | null>(null);
```

```tsx
// AuthProvider.tsx — exporta apenas o componente
import { useState } from "react";
import { AuthContext } from "./context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}
```

```ts
// hooks/useAuth.ts — hook em .ts, nunca em .tsx
import { useContext } from "react";
import { AuthContext } from "../context";

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    return context;
}
```

---

## Outros casos que violam Fast Refresh

Além de contextos, qualquer exportação não-componente em um `.tsx` quebra o Fast Refresh:

```tsx
// ❌ — constante exportada de arquivo .tsx
export const USER_ROLES = { Admin: 'admin' } as const;

// ❌ — tipo exportado de arquivo .tsx (use .ts)
export type UserRole = 'admin' | 'editor';

// ❌ — hook exportado de arquivo .tsx
export function useModal() { ... }
```

Todos esses devem estar em arquivos `.ts`.

---

## Checklist antes de criar ou editar um `.tsx`

- [ ] O arquivo exporta **apenas** componentes React (funções que retornam JSX)?
- [ ] Contextos (`createContext`) estão em arquivos `.ts`?
- [ ] Hooks (`useXxx`) estão em arquivos `.ts`?
- [ ] Constantes (`as const`), enums e tipos estão em arquivos `.ts`?
- [ ] As props do componente estão tipadas diretamente — sem `React.FC`?

---

## Nota sobre React.FC

Nunca usar `React.FC` para tipar componentes — use a assinatura de função direta com o tipo das props explícito. `React.FC` dificulta o uso de generics e adiciona comportamentos implícitos desnecessários.

```tsx
// ✅ correto
export function UserCard({ name, email }: UserCardProps) {
    return <div>{name}</div>;
}

// ❌ evitar
export const UserCard: React.FC<UserCardProps> = ({ name, email }) => {
    return <div>{name}</div>;
};
```

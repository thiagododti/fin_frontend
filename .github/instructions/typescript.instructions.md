---
description: "Use ao definir tipos TypeScript, props de componentes, tipos de retorno de funções ou ao evitar uso de 'any' e type assertions"
applyTo: "src/**/*.{ts,tsx}"
---

# Tipagem TypeScript

## Configuração do compilador (tsconfig.json)

As seguintes opções são obrigatórias e não devem ser removidas ou relaxadas:

```json
{
    "compilerOptions": {
        "strict": true,
        "noUncheckedIndexedAccess": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "exactOptionalPropertyTypes": true
    }
}
```

| Flag                                    | O que garante                                                                    |
| --------------------------------------- | -------------------------------------------------------------------------------- |
| `strict`                                | Habilita `strictNullChecks`, `noImplicitAny` e outros — base obrigatória         |
| `noUncheckedIndexedAccess`              | Acesso a arrays e objetos por índice retorna `T \| undefined`, forçando checagem |
| `noImplicitReturns`                     | Toda função deve retornar explicitamente em todos os caminhos                    |
| `noFallthroughCasesInSwitch`            | Previne `case` sem `break` ou `return` acidental                                 |
| `noUnusedLocals` / `noUnusedParameters` | Proíbe variáveis e parâmetros declarados mas não usados                          |
| `exactOptionalPropertyTypes`            | Diferencia `prop?: string` de `prop: string \| undefined`                        |

---

## any e unknown

- **Nunca usar `any`** — nem explicitamente, nem implicitamente via cast.
- Usar `unknown` quando o tipo for genuinamente incerto (ex: resposta de API não validada, erros de catch).
- Todo `unknown` deve ser tratado com type guard antes de ser usado.
- A única exceção aceita para `any` é em arquivos de teste, com comentário justificando.

```ts
// ✅ correto — unknown + type guard
function handle(value: unknown) {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    }
}

// ❌ errado
function handle(value: any) {
    console.log(value.toUpperCase());
}
```

---

## Type assertions (as)

- **Proibido usar `as`** para forçar um tipo que o compilador não consegue inferir.
- Alternativas obrigatórias:

**Use type guards** quando precisar narrowing:

```ts
// ✅
if (error instanceof ApiError) {
    console.log(error.message);
}
```

**Use `satisfies`** quando quiser validar que um valor atende a um tipo sem perder a inferência:

```ts
// ✅ — o tipo de `config` é inferido com precisão, mas validado contra RouteConfig
const config = {
    path: "/users",
    exact: true,
} satisfies RouteConfig;
```

**Use type guards com predicado** quando a lógica de narrowing for reutilizável:

```ts
// ✅
function isApiError(error: unknown): error is ApiError {
    return error instanceof Error && "statusCode" in error;
}
```

A única exceção aceita para `as` é `as const` para inferência literal e asserções de tipo em testes.

---

## interface vs type

Usar **`type`** como padrão para tudo. Usar **`interface`** apenas quando a extensibilidade via `extends` for explicitamente necessária.

```ts
// ✅ padrão — use type
type User = {
    id: string;
    name: string;
};

// ✅ aceitável — interface quando há hierarquia explícita
interface AdminUser extends User {
    permissions: string[];
}

// ❌ evitar — interface sem necessidade de extensão
interface User {
    id: string;
    name: string;
}
```

---

## Enums

- **Nunca usar `enum`** do TypeScript — gera código JavaScript em runtime e tem comportamentos não óbvios.
- Usar `as const` com um objeto literal como substituto:

```ts
// ✅ correto
export const UserRole = {
    Admin: "admin",
    Editor: "editor",
    Viewer: "viewer",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
// resultado: 'admin' | 'editor' | 'viewer'

// ❌ errado
enum UserRole {
    Admin = "admin",
    Editor = "editor",
}
```

---

## Tipos de retorno

- Funções exportadas **devem** ter tipo de retorno explícito.
- Funções internas e callbacks curtos podem omitir se o tipo for óbvio pela inferência.
- Funções assíncronas devem tipar o retorno como `Promise<T>` — nunca `Promise<any>`.

```ts
// ✅
export async function getUser(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return userSchema.parse(response.data);
}

// ❌
export async function getUser(id: string) {
    // retorno implícito — evitar em funções exportadas
}
```

---

## Props de componentes

- Props devem sempre ter tipo explícito declarado com `type`.
- Nunca deixar props sem tipo ou usar `any`.
- Usar `React.ComponentProps<>` para estender props de elementos HTML nativos em vez de redeclarar manualmente.

```ts
// ✅
type ButtonProps = React.ComponentProps<'button'> & {
  variant: 'primary' | 'secondary';
  isLoading?: boolean;
};

export function Button({ variant, isLoading, ...props }: ButtonProps) { ... }
```

---

## Tipos de formulário

- Tipos de formulário **sempre** derivados do schema Zod via `z.infer<typeof schema>` — nunca declarados manualmente.
- Ver `forms.instructions.md` para detalhes.

---

## Generics

- Usar generics quando uma função ou tipo opera sobre estruturas diferentes mas com a mesma lógica.
- Nunca usar `any` como substituto de um generic.
- Nomear parâmetros de tipo de forma descritiva quando o contexto não for óbvio — evitar letras isoladas exceto para casos triviais (`T`, `K`, `V`).

```ts
// ✅ — generic descritivo
type ApiResponse<TData> = {
    data: TData;
    meta: { total: number; page: number };
};

// ✅ — trivial, letra única aceitável
function identity<T>(value: T): T {
    return value;
}
```

---

## Tipos utilitários

Usar os tipos utilitários nativos do TypeScript em vez de redeclarar estruturas manualmente:

| Utilitário       | Uso                                 |
| ---------------- | ----------------------------------- |
| `Partial<T>`     | Todos os campos de `T` opcionais    |
| `Required<T>`    | Todos os campos de `T` obrigatórios |
| `Pick<T, K>`     | Subconjunto de campos de `T`        |
| `Omit<T, K>`     | `T` sem os campos `K`               |
| `Record<K, V>`   | Objeto com chaves `K` e valores `V` |
| `ReturnType<T>`  | Tipo de retorno de uma função       |
| `NonNullable<T>` | Remove `null` e `undefined` de `T`  |

```ts
// ✅ — derivar em vez de redeclarar
type CreateUserDTO = Omit<User, "id" | "createdAt">;
type UpdateUserDTO = Partial<CreateUserDTO>;
```

---

## Type guards

Usar type guards para narrowing de `unknown` e union types. Nunca usar `as` como atalho para evitar narrowing.

```ts
// predicado de tipo — reutilizável
function isString(value: unknown): value is string {
    return typeof value === "string";
}

// narrowing com 'in'
function handleError(error: unknown) {
    if (error instanceof Error) {
        console.error(error.message);
    }
}

// narrowing de union type com discriminante
type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "square"; side: number };

function area(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.side ** 2;
    }
}
```

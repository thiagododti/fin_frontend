---
description: "Use ao criar, editar ou decompor componentes React — define quando criar componentes, como estruturá-los, padrões de props, composição e uso de React.memo"
applyTo: "src/**/*.tsx"
---

# Componentes React

## Quando criar um novo componente

Criar um novo componente quando pelo menos um dos critérios abaixo for verdadeiro:

- O trecho de JSX se repete em 2 ou mais lugares.
- O componente tem responsabilidade visual claramente distinta (ex: card, modal, formulário).
- O JSX de um componente existente ficou grande o suficiente para dificultar a leitura — extrair partes em componentes menores.
- O trecho precisa de estado ou efeito próprio isolado do componente pai.

**Não criar** componentes apenas para reduzir linhas de código — componentes com menos de 5 linhas e sem reutilização provável devem permanecer inline.

---

## Estrutura de um componente

Todo componente deve seguir esta ordem interna:

1. Declaração do tipo das props
2. Declaração da função do componente
3. Hooks (useState, useReducer, contextos, hooks customizados)
4. Estado derivado e variáveis calculadas
5. Handlers e funções auxiliares
6. Return com JSX

```tsx
// ✅ ordem correta
type UserCardProps = {
  userId: string;
  onSelect: (id: string) => void;
};

export function UserCard({ userId, onSelect }: UserCardProps) {
  // 1. hooks
  const { data: user, isLoading } = useUser(userId);

  // 2. estado derivado
  const displayName = user ? `${user.firstName} ${user.lastName}` : '—';

  // 3. handlers
  function handleClick() {
    onSelect(userId);
  }

  // 4. render
  if (isLoading) return <Skeleton />;

  return (
    <div onClick={handleClick}>
      <span>{displayName}</span>
    </div>
  );
}
```

---

## Props

- Props devem sempre ter tipo explícito declarado com `type` — nunca inline sem nome ou com `any`.
- Usar `React.ComponentProps<>` para estender elementos HTML nativos em vez de redeclarar atributos manualmente.
- Preferir props explícitas e nomeadas a objetos genéricos — evita props desnecessárias chegando ao componente.
- Callbacks de evento devem ter prefixo `on` — ex: `onSubmit`, `onSelect`, `onClose`.
- Não passar objetos inteiros como prop quando o componente só precisa de alguns campos — passe apenas os campos necessários.

```tsx
// ✅ — props explícitas e tipadas
type UserCardProps = {
  name: string;
  email: string;
  onSelect: (id: string) => void;
};

// ❌ — objeto inteiro desnecessário
type UserCardProps = {
  user: User; // o componente talvez só precise de name e email
};
```

---

## children vs props explícitas

- Usar `children` quando o conteúdo interno é variável e controlado pelo pai — layouts, wrappers, slots genéricos.
- Usar props explícitas quando o componente controla sua própria renderização interna.
- Não misturar `children` com props que duplicam o mesmo conteúdo.

```tsx
// ✅ — children para wrapper/layout
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

// ✅ — props explícitas quando o componente renderiza o conteúdo
export function UserAvatar({ name, imageUrl }: UserAvatarProps) {
  return <img src={imageUrl} alt={name} />;
}
```

---

## Lógica condicional no JSX

Evitar lógica complexa diretamente no JSX — extrair para variáveis antes do `return`.

```tsx
// ✅ — lógica extraída
const content = isLoading
  ? <Skeleton />
  : hasError
    ? <ErrorMessage error={error} />
    : <UserList users={users} />;

return <div>{content}</div>;

// ❌ — lógica aninhada no JSX
return (
  <div>
    {isLoading ? <Skeleton /> : hasError ? <ErrorMessage error={error} /> : <UserList users={users} />}
  </div>
);
```

---

## Composição

- Preferir composição a configuração excessiva via props — se um componente começar a ter muitas props booleanas para variações (`showHeader`, `showFooter`, `hasActions`), considerar dividir em componentes menores ou usar o padrão de composição com `children`.
- Componentes de UI base (wrapping de shadcn/ui, Radix, etc.) devem encapsular o estilo e comportamento padrão do projeto — nunca usar a lib diretamente nos componentes de feature.

```tsx
// ✅ — componente base que encapsula a lib
// shared/components/Button.tsx
export function Button({ variant = 'primary', ...props }: ButtonProps) {
  return <ShadcnButton className={variants[variant]} {...props} />;
}

// ❌ — lib usada diretamente na feature
import { Button } from '@/components/ui/button'; // shadcn direto na feature
```

---

## React.memo

Usar `React.memo` apenas quando ambos os critérios forem verdadeiros:

- O componente re-renderiza com frequência comprovada (identificado com React DevTools).
- As props passadas para ele são estáveis (primitivos ou referências memoizadas com `useMemo`/`useCallback`).

**Nunca aplicar `React.memo` por padrão** — o overhead de comparação de props supera o benefício na maioria dos casos.

```tsx
// ✅ — memoização justificada
const UserRow = React.memo(function UserRow({ name, onSelect }: UserRowProps) {
  return <tr onClick={() => onSelect(name)}><td>{name}</td></tr>;
});

// ❌ — memoização sem necessidade comprovada
const PageTitle = React.memo(function PageTitle({ title }: { title: string }) {
  return <h1>{title}</h1>; // renderiza uma vez, memo não agrega nada
});
```

---

## Regras gerais

- Um arquivo `.tsx` exporta apenas um componente principal — componentes auxiliares pequenos podem existir no mesmo arquivo se não forem reutilizados em outros lugares.
- Nunca usar `React.FC` — ver `typescript.instructions.md`.
- Nunca retornar `undefined` de um componente — usar `null` para renderização condicional vazia.
- Nunca usar índice do array como `key` em listas — usar identificadores únicos e estáveis.

```tsx
// ✅
{users.map((user) => <UserCard key={user.id} {...user} />)}

// ❌
{users.map((user, index) => <UserCard key={index} {...user} />)}
```

---
description: "Use ao lidar com erros de API, error boundaries, páginas de erro ou tratamento de exceções em hooks e componentes"
applyTo: "src/**/*.{ts,tsx}"
---

# Tratamento de Erros

## Categorias de erro

| Categoria | Onde tratar | Ferramenta |
|---|---|---|
| Erro de requisição HTTP | Hook de data fetching | `getApiErrorMessage` + `toast` |
| Erro de validação de resposta (Zod) | Arquivo de serviço | `.parse()` / `.safeParse()` |
| Erro de renderização de componente | Error boundary | `ErrorBoundary` |
| Erro de rota não encontrada | Router | Página 404 |
| Erro inesperado de aplicação | Error boundary raiz | Página 500 |

---

## Erros de API

Erros de requisição HTTP são tratados nos hooks de data fetching via `onError` do TanStack Query. Ver `api.instructions.md` para o padrão completo com `getApiErrorMessage` e `toast`.

---

## Error Boundaries

Error boundaries capturam erros de renderização em componentes filhos — erros que ocorrem durante o render, em `useEffect` ou em event handlers **não** são capturados por error boundaries.

### Quando usar

- **Error boundary raiz**: envolve toda a aplicação em `app/providers.tsx` — captura qualquer erro não tratado e exibe uma página de erro genérica.
- **Error boundary de feature**: envolve seções críticas da UI que não devem derrubar a aplicação inteira quando falharem (ex: um widget de dashboard, uma lista complexa).

### Implementação

Usar a lib `react-error-boundary` — não implementar error boundaries manualmente:

```tsx
// app/providers.tsx
import { ErrorBoundary } from 'react-error-boundary';
import { RootErrorPage } from '@/shared/pages/RootErrorPage';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={RootErrorPage}>
      {children}
    </ErrorBoundary>
  );
}
```

```tsx
// Error boundary de feature — envolve apenas uma seção
import { ErrorBoundary } from 'react-error-boundary';
import { SectionErrorFallback } from '@/shared/components/SectionErrorFallback';

export function DashboardPage() {
  return (
    <div>
      <ErrorBoundary FallbackComponent={SectionErrorFallback}>
        <RevenueWidget />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SectionErrorFallback}>
        <UsersWidget />
      </ErrorBoundary>
    </div>
  );
}
```

### Componente de fallback

O componente de fallback recebe `error` e `resetErrorBoundary` — sempre oferecer uma ação de recuperação:

```tsx
// shared/components/SectionErrorFallback.tsx
type Props = {
  error: Error;
  resetErrorBoundary: () => void;
};

export function SectionErrorFallback({ error, resetErrorBoundary }: Props) {
  return (
    <div role="alert">
      <p>Algo deu errado ao carregar esta seção.</p>
      <button onClick={resetErrorBoundary}>Tentar novamente</button>
    </div>
  );
}
```

---

## Páginas de erro

### 404 — Rota não encontrada

Definir uma rota coringa no router para capturar URLs inexistentes:

```tsx
// app/router.tsx
import { NotFoundPage } from '@/shared/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // ... demais rotas
      { path: '*', element: <NotFoundPage /> }, // sempre por último
    ],
  },
]);
```

### 500 — Erro inesperado de aplicação

O componente de fallback do error boundary raiz serve como página de erro 500. Deve oferecer ao usuário a opção de recarregar a aplicação:

```tsx
// shared/pages/RootErrorPage.tsx
type Props = {
  error: Error;
  resetErrorBoundary: () => void;
};

export function RootErrorPage({ resetErrorBoundary }: Props) {
  return (
    <div role="alert">
      <h1>Algo deu errado</h1>
      <p>Ocorreu um erro inesperado. Tente novamente ou recarregue a página.</p>
      <button onClick={resetErrorBoundary}>Tentar novamente</button>
      <button onClick={() => window.location.replace('/')}>Voltar ao início</button>
    </div>
  );
}
```

---

## Erros em useEffect

`useEffect` deve ser usado apenas para sincronização com sistemas externos — não para buscar dados (usar `useQuery`). Nos casos legítimos de `useEffect`, erros devem ser capturados com `try/catch` e armazenados em estado local:

```tsx
// ✅ — caso legítimo de useEffect com tratamento de erro
useEffect(() => {
  let cancelled = false;

  async function sync() {
    try {
      await externalLibrary.connect();
    } catch (error) {
      if (!cancelled) {
        setConnectionError(getApiErrorMessage(error, 'Falha ao conectar.'));
      }
    }
  }

  sync();
  return () => { cancelled = true; };
}, []);
```

---

## Regras gerais

- Nunca deixar erros silenciosos — todo `catch` deve ou tratar o erro visivelmente ou relançá-lo (`throw`).
- Nunca expor mensagens técnicas (stack trace, códigos internos) ao usuário.
- Nunca usar `console.error` como substituto de tratamento de erro em produção — apenas para debug em desenvolvimento.
- Erros de validação Zod em serviços devem ser relançados para que o TanStack Query os capture no `onError`.

```ts
// ✅ — erro relançado para o TanStack Query capturar
export async function getUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`);
  return userSchema.parse(response.data); // lança ZodError se inválido
}

// ❌ — erro silenciado
export async function getUser(id: string): Promise<User | null> {
  try {
    const response = await api.get(`/users/${id}`);
    return userSchema.parse(response.data);
  } catch {
    return null; // erro engolido — TanStack Query não captura, UI não reage
  }
}
```

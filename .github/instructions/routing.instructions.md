---
description: "Use ao criar rotas, páginas, rotas protegidas, lazy loading ou redirecionamentos com React Router"
applyTo: "src/**/*.{ts,tsx}"
---

# Roteamento

## Regras gerais

- Todas as rotas são definidas centralmente em `src/app/router.tsx` — nunca criar rotas em outros arquivos.
- Componentes de página ficam em `features/<feature>/pages/` — nunca definidos inline no router.
- Usar **React Router v6** como padrão.

---

## Estrutura do router

```tsx
// src/app/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from '@/shared/layout/RootLayout';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { PageLoader } from '@/shared/components/PageLoader';

const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));
const UserDetailPage = lazy(() => import('@/features/users/pages/UserDetailPage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'users', element: <Suspense fallback={<PageLoader />}><UsersPage /></Suspense> },
          { path: 'users/:id', element: <Suspense fallback={<PageLoader />}><UserDetailPage /></Suspense> },
        ],
      },
      { path: 'login', element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
    ],
  },
]);
```

---

## Lazy loading

- **Todas as páginas** devem ser carregadas com `React.lazy` + `Suspense` — nunca importadas diretamente no router.
- O `fallback` do `Suspense` deve ser um componente de loading consistente (`PageLoader`) — nunca `null` ou texto inline.
- Lazy loading se aplica apenas a páginas (`pages/`) — componentes compartilhados e layouts não precisam.

```tsx
// ✅ — página com lazy loading
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));

// ❌ — import direto no router
import { UsersPage } from '@/features/users/pages/UsersPage';
```

---

## Rotas protegidas

Rotas que exigem autenticação devem usar um componente `ProtectedRoute` que verifica o estado do usuário e redireciona para login se necessário:

```tsx
// shared/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

- Nunca verificar autenticação diretamente dentro de componentes de página — essa responsabilidade é do `ProtectedRoute`.
- Usar `replace` no `Navigate` para não poluir o histórico de navegação.

---

## Parâmetros de rota

- Parâmetros de rota (`useParams`) retornam `string | undefined` — sempre validar antes de usar.
- Validar e converter parâmetros de rota no topo da página, nunca inline no JSX.

```tsx
// ✅ — validação de parâmetro no topo da página
export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <Navigate to="/users" replace />;

  return <UserDetail userId={id} />;
}
```

---

## Navegação programática

- Usar `useNavigate` para navegação programática — nunca manipular `window.location` diretamente.
- Centralizar as rotas da aplicação em um objeto de constantes para evitar strings literais espalhadas:

```ts
// src/app/routes.ts
export const ROUTES = {
  home: '/',
  login: '/login',
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
  },
} as const;
```

```tsx
// ✅ — uso das constantes
navigate(ROUTES.users.detail(userId));

// ❌ — string literal espalhada
navigate(`/users/${userId}`);
```

---

## Redirecionamentos

- Usar `<Navigate>` para redirecionamentos declarativos dentro de componentes.
- Usar `useNavigate` para redirecionamentos em handlers de eventos ou após mutations.
- Sempre usar `replace: true` quando o redirecionamento substitui uma rota que não deve estar no histórico (ex: após login, após submit de formulário).

```tsx
// ✅ — após mutation bem-sucedida
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: (user) => {
    navigate(ROUTES.users.detail(user.id), { replace: true });
  },
});
```

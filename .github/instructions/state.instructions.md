---
description: "Use ao decidir como gerenciar estado: useState local, Context API para estado global de UI ou TanStack Query para estado do servidor"
applyTo: "src/**/*.{ts,tsx}"
---

# Gerenciamento de Estado

## Regra de decisão

Antes de criar qualquer estado, identifique a categoria:

| Situação                                                | Solução                         |
| ------------------------------------------------------- | ------------------------------- |
| Input controlado, modal aberto/fechado, toggle local    | `useState`                      |
| Estado com múltiplas transições relacionadas            | `useReducer`                    |
| Dados que vêm da API                                    | `useQuery` / `useMutation`      |
| Estado compartilhado entre componentes de uma feature   | Context de feature              |
| Estado global de UI (usuário autenticado, tema, idioma) | Context global                  |
| Valor derivado de outro estado ou prop                  | Variável calculada — sem estado |

---

## Estado do servidor

- **Sempre** gerenciar via TanStack Query (`useQuery`, `useMutation`).
- **Nunca** duplicar dados da API em `useState` ou Context — o cache do TanStack Query já é a fonte da verdade.
- Ver `api.instructions.md` para padrões de `queryKey`, invalidação e tratamento de erros.

---

## useState

Usar para estado local simples: toggles, inputs controlados, modais, contadores.

- Preferir múltiplos `useState` independentes a um único objeto de estado quando os campos não mudam juntos.
- Quando um `useState` começar a ter muitas transições condicionais relacionadas, migrar para `useReducer`.

```ts
// ✅ estados independentes — cada um muda por razões diferentes
const [isOpen, setIsOpen] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);

// ❌ objeto de estado desnecessário quando campos são independentes
const [state, setState] = useState({ isOpen: false, selectedId: null });
```

---

## useReducer

Usar quando o estado tem múltiplas transições que dependem do valor anterior ou quando várias ações alteram o mesmo estado de formas distintas.

```ts
type State = {
    step: number;
    data: Partial<CreateUserDTO>;
};

type Action =
    | { type: "NEXT_STEP"; payload: Partial<CreateUserDTO> }
    | { type: "PREV_STEP" }
    | { type: "RESET" };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "NEXT_STEP":
            return {
                step: state.step + 1,
                data: { ...state.data, ...action.payload },
            };
        case "PREV_STEP":
            return { ...state, step: state.step - 1 };
        case "RESET":
            return { step: 0, data: {} };
    }
}
```

---

## Estado derivado

Nunca criar `useState` para algo que pode ser calculado diretamente de outro estado ou prop. Estado derivado sincronizado manualmente é uma fonte comum de bugs.

```ts
// ✅ — calculado diretamente, sem estado extra
const isFormValid = name.length > 0 && email.includes("@");

// ❌ — estado sincronizado manualmente, propenso a dessincronizar
const [isFormValid, setIsFormValid] = useState(false);
useEffect(() => {
    setIsFormValid(name.length > 0 && email.includes("@"));
}, [name, email]);
```

Se o cálculo for custoso, usar `useMemo` — mas nunca `useState` + `useEffect` para derivação.

---

## useMemo e useCallback

Usar com critério — não aplicar por padrão em todo lugar.

**`useMemo`**: memorizar o resultado de um cálculo custoso ou preservar a referência de um objeto/array que é passado como prop ou usado em dependências de outros hooks.

```ts
// ✅ — evita recriar o array filtrado a cada render
const activeUsers = useMemo(() => users.filter((u) => u.isActive), [users]);
```

**`useCallback`**: memorizar a referência de uma função passada como prop para componentes que dependem de igualdade referencial (ex: memoizados com `React.memo`) ou usada em dependências de `useEffect`/`useMemo`.

```ts
// ✅ — referência estável para evitar re-renders desnecessários
const handleSubmit = useCallback(() => {
    onSubmit(formData);
}, [formData, onSubmit]);
```

**Não usar** `useMemo`/`useCallback` para cálculos simples ou funções que não são passadas como prop — o overhead de memoização supera o benefício.

---

## Context API

### Context de feature vs Context global

- **Context de feature**: estado compartilhado entre componentes de uma única feature (ex: estado de um wizard, filtros de uma listagem). Deve ficar dentro da pasta da feature e nunca ser importado por outras features.
- **Context global**: estado acessado em toda a aplicação (ex: usuário autenticado, tema, idioma). Deve ficar em `src/app/providers.tsx` ou em `src/shared/contexts/`.

### Como estruturar um Context

Todo Context deve seguir este padrão — com tipo explícito, verificação de uso fora do Provider e custom hook de acesso:

```ts
// contexts/AuthContext.tsx
import { createContext, useContext, useState } from 'react';

type AuthContextValue = {
  user: User | null;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook — nunca acessar o Context diretamente via useContext fora deste arquivo
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
```

- Nunca acessar um Context diretamente com `useContext(XxxContext)` fora do arquivo onde ele é definido — sempre usar o custom hook exportado.
- Nunca inicializar um Context com um valor fake/vazio só para evitar o `null` check — o erro em runtime é intencional e indica uso incorreto.

### Quando o Context não é suficiente

Migrar para uma biblioteca de estado global (ex: Zustand) quando pelo menos dois dos critérios abaixo forem verdadeiros:

- O Context tem mais de 3-4 valores que mudam de forma independente.
- Re-renders desnecessários causados pelo Context se tornarem um problema real de performance.
- A lógica de atualização de estado ficou complexa a ponto de `useReducer` dentro do Context ser difícil de manter.
- O estado precisa ser acessado fora de componentes React (ex: em funções utilitárias ou serviços).

---

## Prop drilling

- Evitar passar props por mais de 2 níveis de componentes intermediários.
- Se um dado precisa descer mais de 2 níveis, avaliar Context de feature antes de continuar perfurando.
- Prop drilling de callbacks (`onXxx`) é mais tolerável que prop drilling de dados — mas o limite de 2 níveis ainda se aplica.

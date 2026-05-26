---
description: "Use ao criar ou editar serviços de API (api.ts, usersService.ts), hooks de data fetching (useQuery, useMutation), schemas Zod de resposta ou ao lidar com erros de requisição"
applyTo: "src/**/*.{ts,tsx}"
---

# API, Data Fetching e Tratamento de Erros

## Comunicação com backend

- Nunca utilizar o método HTTP `PUT`. Todas as atualizações devem utilizar `PATCH`.
- Centralizar todas as chamadas HTTP em arquivos de serviço dentro da feature (ex: `usersService.ts`) ou em `src/shared/services/`.
- Utilizar a instância configurada do Axios (`@/lib/axios`) — nunca `fetch` diretamente, e nunca realizar chamadas HTTP dentro de componentes ou hooks.
- **Toda resposta da API deve ser validada com Zod** no arquivo de serviço. Nunca confiar na tipagem estática do Axios — generics como `api.get<Tipo>()` não validam em runtime.
- Usar `.parse()` quando uma resposta inválida deve lançar exceção e interromper o fluxo. Usar `.safeParse()` quando for necessário inspecionar o erro de validação antes de decidir o que fazer. Em ambos os casos, o tratamento deve ocorrer dentro do arquivo de serviço.
- Os schemas Zod de resposta ficam em arquivos separados dentro da feature (ex: `userSchema.ts`). Os tipos são sempre inferidos com `z.infer<typeof schema>` — nunca declarados manualmente.
- Para respostas paginadas, usar `paginatedResponseSchema` de `@/shared/types/api`.
- Os arquivos de serviço retornam os dados já parseados. Os hooks nunca devem acessar `.data` da resposta do Axios diretamente.

### Exemplo de arquivo de serviço

```ts
// features/users/usersService.ts
import { api } from "@/lib/axios";
import { userSchema, type User } from "./userSchema";

export async function getUser(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return userSchema.parse(response.data); // lança se inválido
}

export async function updateUser(
    id: string,
    data: Partial<User>,
): Promise<User> {
    const response = await api.patch(`/users/${id}`, data);
    return userSchema.parse(response.data);
}
```

---

## Data fetching

- Utilizar **TanStack Query (React Query)** para todas as requisições ao servidor.
- Nunca usar `useEffect` para buscar dados — sempre `useQuery` ou `useMutation`.
- Centralizar as `queryKey` de cada feature em um objeto de fábrica no arquivo `<feature>.keys.ts`:

```ts
// features/users/users.keys.ts
export const usersKeys = {
    all: () => ["users"] as const,
    detail: (id: string) => ["users", id] as const,
    list: (filters?: UsersFilters) => ["users", "list", filters] as const,
};
```

- Sempre referenciar as keys via esse objeto — nunca declarar arrays literais nos hooks.
- Usar a opção `enabled` para evitar que queries disparem com parâmetros indefinidos:

```ts
const { data } = useQuery({
    queryKey: usersKeys.detail(userId),
    queryFn: () => getUser(userId),
    enabled: !!userId, // query só executa quando userId existe
});
```

- Mutations devem invalidar as queries relacionadas após sucesso usando `onSuccess` no `useMutation`:

```ts
const mutation = useMutation({
    mutationFn: (data: UpdateUserData) => updateUser(userId, data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: usersKeys.all() });
        toast.success("Usuário atualizado com sucesso.");
    },
    onError: (error) => {
        toast.error(getApiErrorMessage(error, "Erro ao atualizar usuário."));
    },
});
```

---

## Tratamento de erros

- Erros de API devem ser tratados nos hooks de data fetching — nunca nos componentes.
- Mensagens exibidas ao usuário devem ser legíveis e nunca expor detalhes técnicos (stack trace, códigos internos, mensagens brutas do backend).
- Usar `toast` do Sonner para feedback de erros e sucesso.
- **Sempre** usar `getApiErrorMessage(error, "mensagem fallback")` de `@/lib/apiError` para extrair a mensagem de erro — nunca passar string literal fixa para `toast.error()` quando há um erro de requisição.

```ts
// ✅ correto
toast.error(getApiErrorMessage(error, "Erro ao carregar usuários."));

// ❌ errado
toast.error("Erro ao carregar usuários.");
```

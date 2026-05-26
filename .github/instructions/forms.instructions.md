---
description: "Use ao criar ou editar formulários com React Hook Form, schemas Zod de entrada do usuário ou hooks de formulário (useXxxForm)"
applyTo: "src/**/*.{ts,tsx}"
---

# Formulários e Validação

## Regras obrigatórias

- Utilizar React Hook Form para gerenciamento de formulários.
- Utilizar Zod para validação através do `zodResolver` importado de `@hookform/resolvers/zod`.
- Nunca criar validações inline nos componentes.
- Tipos devem ser inferidos através de `z.infer<typeof schema>`. Nunca declarar tipos manualmente para dados de formulário.
- Todo formulário deve possuir `defaultValues` explícitos, cobrindo todos os campos do schema.
- O modo de validação padrão é `mode: 'onBlur'`, salvo decisão explícita documentada no hook.
- Componentes de formulário devem focar apenas em renderização e interação visual — sem lógica de negócio, transformações ou chamadas de API.

## Sanitização e transformações

Transformações simples devem ser aplicadas diretamente no schema Zod, usando `.trim()`, `.toLowerCase()`, `z.preprocess()` ou `.transform()`. Exemplos:

```ts
// ✅ correto
const schema = z.object({
    email: z.string().trim().toLowerCase().email(),
    age: z.preprocess((v) => Number(v), z.number().min(18)),
});
```

Sanitização complexa ou dependente de lógica de negócio deve ser feita dentro do hook `useXxxForm`, nunca no componente.

## Hooks de formulário (useXxxForm)

Formulários que se enquadram em pelo menos um dos critérios abaixo **devem** encapsular sua lógica em um hook próprio (`useXxxForm`):

- Possuem mais de um passo (multi-step).
- Contém lógica condicional entre campos (ex: exibir campo B dependendo do valor de A).
- Realizam side effects (ex: busca de CEP, cálculos derivados, chamadas de API).
- O `onSubmit` requer transformação de dados antes de enviar para a API.

O hook deve expor apenas o necessário para o componente:

```ts
// useUserForm.ts
export function useUserForm() {
    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: { name: "", email: "" },
        mode: "onBlur",
    });

    async function onSubmit(data: UserFormData) {
        // transformações e chamada de API aqui
    }

    return { form, onSubmit };
}
```

O componente apenas consome o hook:

```tsx
// UserForm.tsx
export function UserForm() {
    const { form, onSubmit } = useUserForm();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* apenas renderização */}
        </form>
    );
}
```

## Tratamento de erros da API

Erros retornados pelo backend devem ser mapeados para campos usando `setError()` do React Hook Form, sempre dentro do hook `useXxxForm`:

```ts
async function onSubmit(data: UserFormData) {
    try {
        await api.createUser(data);
    } catch (error) {
        if (isApiValidationError(error)) {
            error.fields.forEach(({ field, message }) => {
                form.setError(field, { message });
            });
        }
    }
}
```

## Organização de arquivos

Cada feature deve replicar a seguinte estrutura:

```
src/features/<feature>/
├── components/
│   └── <Feature>Form.tsx       → renderização e interação visual
├── hooks/
│   └── use<Feature>Form.ts     → lógica, onSubmit, setError, side effects
├── schemas/
│   ├── <feature>FormSchema.ts  → schema de entrada do usuário
│   └── <feature>Schema.ts      → contrato de API/backend
```

## Separação de schemas

| Arquivo                  | Responsabilidade                                        |
| ------------------------ | ------------------------------------------------------- |
| `<feature>FormSchema.ts` | Valida e sanitiza a entrada do usuário no formulário    |
| `<feature>Schema.ts`     | Representa o contrato de dados da API ou banco de dados |

- **Nunca** reutilizar diretamente um schema de API como schema de formulário.
- Os dois schemas podem compartilhar campos, mas devem ser declarados separadamente.
- Quando necessário, usar `.pick()`, `.omit()` ou `.extend()` para derivar um do outro de forma explícita.

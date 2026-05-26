---
description: "Reavalia o projeto fin_frontend contra as instruções definidas em .github/instructions/ e gera um plano de correção em refactoring-plan.md"
name: "Reavaliar Projeto"
argument-hint: "Nome do arquivo de saída (padrão: refactoring-plan.md)"
agent: "agent"
---

Realize uma avaliação completa do projeto `fin_frontend` comparando o estado atual do código com as regras definidas nos arquivos de instruções em `.github/instructions/`. Ao final, gere um relatório de correção no arquivo `$ARGUMENTS` (use `refactoring-plan.md` se nenhum argumento for fornecido).

## Etapa 1 — Ler todas as instruções

Leia **todos** os arquivos a seguir antes de avaliar qualquer código:

- [api.instructions.md](./../instructions/api.instructions.md)
- [components.instructions.md](./../instructions/components.instructions.md)
- [error-handling.instructions.md](./../instructions/error-handling.instructions.md)
- [fast-refresh.instructions.md](./../instructions/fast-refresh.instructions.md)
- [forms.instructions.md](./../instructions/forms.instructions.md)
- [project-structure.instructions.md](./../instructions/project-structure.instructions.md)
- [routing.instructions.md](./../instructions/routing.instructions.md)
- [state.instructions.md](./../instructions/state.instructions.md)
- [typescript.instructions.md](./../instructions/typescript.instructions.md)

## Etapa 2 — Mapear a estrutura atual do projeto

Leia a estrutura de `src/` para identificar todos os arquivos existentes. Para cada feature e pasta shared/lib/app, leia os arquivos relevantes.

## Etapa 3 — Avaliar cada arquivo

Para cada arquivo em `src/`, verifique as seguintes dimensões e registre **toda violação encontrada** com arquivo, linha e regra violada:

### Checklist de avaliação por dimensão

**TypeScript**

- [ ] Uso de `any` explícito ou implícito
- [ ] Type assertions (`as`) sem necessidade
- [ ] `interface` onde deveria ser `type`
- [ ] Tipos declarados manualmente que poderiam derivar de `z.infer<typeof schema>`
- [ ] Props de componente sem tipo explícito nomeado

**Componentes React**

- [ ] `React.FC` ou `React.FunctionComponent` em vez de `function` com tipo nomeado
- [ ] Props tipadas inline (sem nome) em vez de `type XxxProps = { ... }`
- [ ] Ordem interna incorreta (hooks → estado derivado → handlers → return)
- [ ] Arquivos `.tsx` exportando não-componentes junto com componentes (violação Fast Refresh)
- [ ] Componentes com menos de 5 linhas criados desnecessariamente

**Estado**

- [ ] `useState` para valor derivável de prop ou outro estado
- [ ] `useEffect` sincronizando prop em estado (anti-padrão)
- [ ] `useEffect` com dependências suprimidas via `eslint-disable`
- [ ] Contexto sendo usado para estado de servidor (deveria ser TanStack Query)

**API / Serviços**

- [ ] Import de `axios` como default em vez de `{ api }` de `@/lib/axios`
- [ ] Respostas de API sem validação Zod
- [ ] `PUT` onde deveria ser `PATCH`
- [ ] Schemas Zod de formulário e de API no mesmo arquivo

**Formulários**

- [ ] Formulário sem `zodResolver`
- [ ] Validação manual em vez de Zod schema
- [ ] `onSubmit` sem tratamento de erro via `getApiErrorMessage`

**Tratamento de erros**

- [ ] `catch (e: any)` ou `catch (e)` sem usar `unknown`
- [ ] Erros de API tratados sem `getApiErrorMessage`
- [ ] Componentes de página sem `ErrorBoundary`

**Estrutura e nomenclatura**

- [ ] Arquivo de serviço sem sufixo `Service` (ex: `api.ts` em vez de `featureService.ts`)
- [ ] Componente/hook específico de feature colocado em `shared/`
- [ ] Artefato em `shared/` usado por apenas 1 feature
- [ ] Nome de arquivo não corresponde ao componente exportado
- [ ] Arquivo de página fora de `features/<feature>/pages/` ou `shared/pages/`
- [ ] Funções puras duplicadas em múltiplos arquivos

**Roteamento**

- [ ] Rota definida fora de `app/router.tsx`
- [ ] Página importada diretamente sem `lazy()`
- [ ] `lazy()` sem `Suspense`

## Etapa 4 — Classificar por prioridade

Classifique cada problema encontrado:

| Prioridade | Critério                                                                       |
| ---------- | ------------------------------------------------------------------------------ |
| 🔴 P1      | Viola explicitamente uma regra com `devem`, `nunca`, `sempre`, `obrigatório`   |
| 🟡 P2      | Viola boas práticas, anti-padrão documentado, ou inconsistência de qualidade   |
| 🟢 P3      | Inconsistência menor, polimento, divergência estética com o padrão documentado |

## Etapa 5 — Gerar o arquivo de saída

Escreva o arquivo `$ARGUMENTS` (padrão: `refactoring-plan.md`) na raiz do projeto com a estrutura abaixo. **Não pule nenhum item encontrado.** Para cada violação, inclua o trecho de código atual e a ação corretiva com o trecho corrigido.

````markdown
# Plano de Refatoração — fin_frontend

> Avaliação realizada em <DATA_ATUAL> com base nas regras definidas em `.github/instructions/`.
> Cada item está categorizado por prioridade e aponta o arquivo, a regra violada e a ação corretiva.

---

## Sumário de Prioridades

| Prioridade                                  | Qtd | Descrição                                    |
| ------------------------------------------- | --- | -------------------------------------------- |
| 🔴 P1 — Violações explícitas de regras      | N   | Devem ser corrigidas antes de novas features |
| 🟡 P2 — Qualidade de código / boas práticas | N   | Corrigir em breve para manter consistência   |
| 🟢 P3 — Polimento / inconsistências menores | N   | Corrigir quando conveniente                  |

---

## 🔴 P1 — Violações Explícitas de Regras

### [P1-NN] <Título curto do problema>

**Regra**: `<arquivo>.instructions.md` — _"<trecho exato da regra>"_

**Arquivos e linhas afetados:**

| Arquivo   | Trecho atual            |
| --------- | ----------------------- |
| `src/...` | `<código problemático>` |

**Ação corretiva**: <descrição clara do que mudar>

```ts
// ✅ código corrigido
```
````

---

## 🟡 P2 — Qualidade de Código / Boas Práticas

[mesma estrutura]

---

## 🟢 P3 — Polimento / Inconsistências Menores

[mesma estrutura]

---

## Arquivos que NÃO precisam de refatoração

Liste explicitamente os arquivos avaliados e considerados conformes.

---

## Checklist de Execução

\`\`\`
🔴 P1 — Bloqueadores
[ ] P1-01 — ...

🟡 P2 — Qualidade
[ ] P2-01 — ...

🟢 P3 — Polimento
[ ] P3-01 — ...
\`\`\`

---

## Dependências entre itens

Liste quais itens devem ser feitos juntos ou em ordem específica.

```

> **Importante**: Não omita arquivos. Avalie *todo* o código em `src/`. Se um arquivo estiver 100% conforme, mencione-o explicitamente na seção "Arquivos que NÃO precisam de refatoração".
```

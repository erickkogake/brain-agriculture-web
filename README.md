# Brain Agriculture Web

Frontend do sistema de gestão de produtores rurais — Next.js 14 · TypeScript · Tailwind CSS.

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- API backend rodando em `http://localhost:3000` ([brain-agriculture](../brain-agriculture))

---

## Rodar localmente

```bash
# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
cp .env.local.example .env.local

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:3001**

---

## Build de produção

```bash
npm run build
npm start
```

---

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api/v1` | URL base da API |

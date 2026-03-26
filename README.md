# CodeShame ☕

**CodeShame** é uma plataforma interativa e divertida criada para analisar, avaliar e "shamar" (criticar de forma humorada e construtiva) pedaços de código. Inspirado na estética de consoles e interfaces minimalistas (_neobrutalismo dark_), o projeto transforma a clássica revisão de código em uma experiência gamificada e cheia de estilo.

![Homepage](public/screenshots/home.png)

## Funcionalidades

- **Shame Mode:** Receba um feedback brutal, sarcástico e humorado do seu código.
- **Honest Feedback:** Para quando você realmente só precisa saber como melhorar, sem ferir o ego.
- **Detecção Automática:** Coloque o código e deixamos a IA adivinhar a linguagem e onde você errou.
- **Leaderboard Global:** Os códigos mais zoados da internet, com um ranking das piores notas.
- **Score Dinâmico:** Uma nota de 0 a 10 e um anel de progresso com base na gravidade do seu código.
- **Compartilhamento:** Gere imagens com a nota e o resumo (Open Graph) para enviar para os amigos.

![Result Page](public/screenshots/result.png)

## Stack Tecnológico 🛠️

Nos bastidores, o CodeShame utiliza tecnologias modernas do ecossistema front-end para entregar performance e produtividade:

- **[Next.js](https://nextjs.org/) (App Router)**
- **[React 19](https://react.dev/) + React Compiler**
- **[Tailwind CSS v4](https://tailwindcss.com/)**
- **[tRPC](https://trpc.io/)**
- **[PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/)**
- **[Vercel AI SDK](https://sdk.vercel.ai/)** conectando modelos LLM para analisar e extrair as pontuações.

---

## Como rodar localmente 💻

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/danitsdev/CodeShame
   cd codeshame
   ```

2. **Instale as dependências:**

   ```bash
   pnpm install
   ```

3. **Suba o Banco de Dados:**
   O projeto utiliza o Docker Compose para subir uma instância local do PostgreSQL.

   ```bash
   docker compose up -d
   ```

4. **Configuração das Variáveis de Ambiente:**
   Copie o arquivo `.env.example` para `.env` ou `.env.local` e configure a sua `GROQ_API_KEY` (ou substitua pelo provider da OpenAI se preferir, alterando a rota do backend).

   ```bash
   cp .env.example .env
   ```

5. **Execute as Migrations e Seeds:**

   ```bash
   pnpm run db:push
   pnpm run db:seed
   ```

6. **Inicie o servidor de desenvolvimento:**
   ```bash
   pnpm run dev ou pnpm.cmd run dev
   ```
   Acesse `http://localhost:3000` no seu navegador.

---

## 🚀 Como fazer o Deploy na Vercel

O projeto foi construído sobre o Next.js, por isso, hospedar na **Vercel** é o caminho mais natural. Como a Vercel é Serverless, você não poderá usar o `docker-compose`. Em vez disso, você precisará de um banco de dados **PostgreSQL na nuvem**.

### 1. Criando o Banco de Dados (Neon ou Vercel Postgres)

- **Opção A (Vercel Postgres):** Ao criar seu projeto na Vercel, vá na aba **Storage** e crie um banco de dados Postgres gratuito. Ele injetará as variáveis de ambiente automaticamente.
- **Opção B (Neon.tech):** Crie uma conta no [Neon](https://neon.tech), inicie um projeto gratuito, copie a `Connection String` e adicione nas variáveis de ambiente da Vercel como `DATABASE_URL`.

### 2. Configurando as Variáveis na Vercel

No painel da Vercel (Project > Settings > Environment Variables), adicione:

- `DATABASE_URL`: A URL do seu banco na nuvem.
- `GROQ_API_KEY`: Sua chave de API de IA.

### 3. Executando as Migrations em Produção

Como o banco na nuvem estará vazio, assim que o deploy for concluído, você precisará conectar o Drizzle a ele.
Localmente (na sua máquina), mude o `DATABASE_URL` no seu `.env` para a URL do seu banco de nuvem da Vercel/Neon e rode:

```bash
pnpm run db:push
pnpm run db:seed
```

Isso criará as tabelas e adicionará o Leaderboard inicial direto no seu banco de produção! (Lembre-se de retornar sua `.env` local para o localhost depois disso).

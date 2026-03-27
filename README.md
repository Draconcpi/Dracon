# 🐉 DRACON — Portfólio de Ilustração & Animação Mística

<div align="center">

**Arte mística, fantasia e mundos arcanos.**

Um site de portfólio profissional para uma marca de ilustração e animação, construído com tecnologias de última geração e uma estética imersiva inspirada em fantasia, magia e astrologia.

</div>

---

## ✨ Visão Geral

Dracon é um portfólio completo (frontend + backend + banco de dados) com:

- **Frontend animado** com partículas cósmicas, estrelas cintilantes e constelações
- **Backend completo** com API REST integrada ao Next.js
- **Painel administrativo** protegido com JWT
- **Banco de dados** PostgreSQL com Prisma ORM
- **SEO avançado** com sitemap automático e meta tags

## 🎨 Identidade Visual

| Elemento | Detalhe |
|----------|---------|
| **Cores** | Roxo profundo (#7c22ce), Laranja (#f97316), Preto cósmico (#050010) |
| **Tipografia** | Cinzel (títulos), Inter (corpo) |
| **Estética** | Mística, arcana, astral, elegante |
| **Efeitos** | Partículas, estrelas, constelações, glow neon, parallax |

## 🛠️ Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Linguagem** | TypeScript |
| **Estilo** | TailwindCSS (customizado) |
| **Animações** | Framer Motion |
| **Efeitos Visuais** | Canvas API (estrelas, partículas) |
| **Backend** | Next.js API Routes |
| **Autenticação** | JWT (jose) + bcrypt |
| **Banco de Dados** | PostgreSQL |
| **ORM** | Prisma |
| **Deploy** | Vercel (frontend) + Railway (banco) |

## 📄 Páginas

| Página | Rota | Descrição |
|--------|------|-----------|
| **Home** | `/` | Hero animado, carrossel de artes, obras em destaque, CTA |
| **Portfólio** | `/portfolio` | Galeria com filtros por categoria e modal de detalhes |
| **Dragon Eyes** | `/dragon-eyes` | Projeto pessoal com constelação interativa de personagens |
| **Sobre** | `/about` | História, habilidades, linha do tempo animada |
| **Serviços** | `/services` | Lista de serviços, preços, processo de encomenda |
| **Contato** | `/contact` | Formulário de contato, redes sociais |
| **Admin Login** | `/admin/login` | Tela de login administrativo |
| **Admin Dashboard** | `/admin` | Estatísticas e ações rápidas |
| **Admin Portfólio** | `/admin/portfolio` | CRUD de obras |
| **Admin Categorias** | `/admin/categories` | CRUD de categorias |
| **Admin Mensagens** | `/admin/messages` | Visualizar/gerenciar mensagens |
| **Admin Serviços** | `/admin/services` | CRUD de serviços |
| **Admin Config** | `/admin/settings` | Configurações do site |
| **404** | `/*` | Página de erro personalizada mística |

## 🗄️ Banco de Dados (Schema)

```
Users         → Administradores do sistema
Categories    → Categorias do portfólio
PortfolioItems → Obras de arte
Messages      → Mensagens recebidas pelo formulário
Services      → Serviços oferecidos
Settings      → Configurações gerais do site
```

## 🔌 API Routes

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/login` | Login | ❌ |
| POST | `/api/auth/logout` | Logout | ❌ |
| GET | `/api/auth/me` | Dados do usuário logado | ✅ |
| GET | `/api/portfolio` | Listar obras | ❌ |
| POST | `/api/portfolio` | Criar obra | ✅ |
| GET | `/api/portfolio/[id]` | Detalhe de obra | ❌ |
| PUT | `/api/portfolio/[id]` | Editar obra | ✅ |
| DELETE | `/api/portfolio/[id]` | Deletar obra | ✅ |
| GET | `/api/categories` | Listar categorias | ❌ |
| POST | `/api/categories` | Criar categoria | ✅ |
| PUT | `/api/categories/[id]` | Editar categoria | ✅ |
| DELETE | `/api/categories/[id]` | Deletar categoria | ✅ |
| GET | `/api/messages` | Listar mensagens | ✅ |
| POST | `/api/messages` | Enviar mensagem (contato) | ❌ |
| PUT | `/api/messages/[id]` | Marcar como lida | ✅ |
| DELETE | `/api/messages/[id]` | Deletar mensagem | ✅ |
| GET | `/api/services` | Listar serviços | ❌ |
| POST | `/api/services` | Criar serviço | ✅ |
| PUT | `/api/services/[id]` | Editar serviço | ✅ |
| DELETE | `/api/services/[id]` | Deletar serviço | ✅ |
| GET/PUT | `/api/settings` | Configurações | ✅ (PUT) |
| POST | `/api/upload` | Upload de imagem | ✅ |

## 🔒 Segurança

- ✅ Autenticação JWT com cookies HttpOnly
- ✅ Senhas criptografadas com bcrypt (12 rounds)
- ✅ Rate limiting em endpoints públicos (login, contato)
- ✅ Sanitização de inputs
- ✅ CORS configurado
- ✅ Headers de segurança (X-Frame-Options, XSS Protection, etc.)
- ✅ Rotas protegidas no admin

---

## 🚀 Instalação & Setup

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Clonar e Instalar

```bash
cd Dracon
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dracon?schema=public"
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Configurar Banco de Dados

```bash
# Criar as tabelas
npm run db:push

# Popular com dados de teste
npm run db:seed
```

### 4. Iniciar o Servidor

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🖼️ Hospedando Imagens e Vídeos com Google Drive

Você pode usar o Google Drive para hospedar as imagens e vídeos do portfólio.

### Imagens

1. Suba a imagem no Google Drive
2. Clique com botão direito → **Compartilhar** → **"Qualquer pessoa com o link"**
3. Copie o link. Ele será algo como:
   ```
   https://drive.google.com/file/d/SEU_ID_AQUI/view?usp=sharing
   ```
4. Extraia o **ID** (a parte entre `/d/` e `/view`)
5. Use esta URL no campo de imagem:
   ```
   https://drive.google.com/uc?export=view&id=SEU_ID_AQUI
   ```

**Exemplo:**
- Link original: `https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsT/view?usp=sharing`
- URL da imagem: `https://drive.google.com/uc?export=view&id=1aBcDeFgHiJkLmNoPqRsT`

### Vídeos

Para vídeos do Google Drive, use a URL de embed:
```
https://drive.google.com/file/d/SEU_ID_AQUI/preview
```

> **Nota:** Os domínios `drive.google.com` e `lh3.googleusercontent.com` já estão autorizados no `next.config.mjs`.

### 5. Acessar o Admin

- URL: **http://localhost:3000/admin/login**
- Email: `admin@dracon.art`
- Senha: `dracon2024`

---

## 📦 Deploy

### Frontend → Vercel

1. Faça push do código para o GitHub
2. Importe o repositório no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente:
   - `DATABASE_URL` (URL do Railway)
   - `JWT_SECRET` (chave segura)
   - `NEXT_PUBLIC_SITE_URL` (URL do Vercel)
4. Deploy automático!

### Banco de Dados → Railway

1. Crie uma conta no [Railway](https://railway.app)
2. Crie um novo projeto PostgreSQL
3. Copie a `DATABASE_URL` fornecida
4. Configure no Vercel e execute o seed remoto

```bash
# Após configurar DATABASE_URL para o Railway:
npx prisma db push
npx tsx prisma/seed.ts
```

---

## 🏗️ Arquitetura

```
Dracon/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── seed.ts                # Dados de teste
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout raiz (fontes, navbar, footer, stars)
│   │   ├── page.tsx           # Home page
│   │   ├── globals.css        # Estilos globais customizados
│   │   ├── sitemap.ts         # Sitemap automático
│   │   ├── robots.ts          # Robots.txt
│   │   ├── not-found.tsx      # Página 404 mística
│   │   ├── error.tsx          # Página de erro
│   │   ├── portfolio/         # Página de portfólio
│   │   ├── about/             # Página sobre
│   │   ├── services/          # Página de serviços
│   │   ├── contact/           # Página de contato
│   │   ├── admin/             # Painel administrativo completo
│   │   │   ├── layout.tsx     # Layout admin com sidebar
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── login/         # Login
│   │   │   ├── portfolio/     # CRUD portfólio
│   │   │   ├── categories/    # CRUD categorias
│   │   │   ├── messages/      # Gerenciar mensagens
│   │   │   ├── services/      # CRUD serviços
│   │   │   └── settings/      # Configurações
│   │   └── api/               # API Routes (backend)
│   │       ├── auth/          # Login, logout, me
│   │       ├── portfolio/     # CRUD portfólio
│   │       ├── categories/    # CRUD categorias
│   │       ├── messages/      # CRUD mensagens
│   │       ├── services/      # CRUD serviços
│   │       ├── settings/      # Configurações
│   │       └── upload/        # Upload de imagens
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, PageTransition
│   │   ├── ui/                # StarField, CosmicDust, GlowText, etc.
│   │   └── admin/             # AdminSidebar
│   ├── lib/
│   │   ├── prisma.ts          # Singleton do Prisma
│   │   ├── auth.ts            # JWT sign/verify, session
│   │   ├── utils.ts           # Helpers (slugify, sanitize, ratelimit)
│   │   └── constants.ts       # Constantes do site
│   └── types/
│       └── index.ts           # TypeScript types
├── .env.example               # Template de variáveis
├── tailwind.config.ts         # Tailwind customizado (cores Dracon)
├── next.config.mjs            # Config Next.js (CORS, headers)
└── package.json               # Scripts e dependências
```

---

## 🔮 Sugestões de Melhorias Futuras

1. **Three.js Background** — Substituir Canvas por Three.js para constelações 3D interativas
2. **Cloudinary Integration** — Upload real de imagens com otimização automática
3. **i18n** — Suporte a Inglês/Português
4. **Blog** — Seção de blog com posts sobre arte e processo criativo
5. **Editor Rich Text** — Editor WYSIWYG para descrições no admin
6. **Notificações Email** — Envio de email ao receber mensagem (SendGrid/Resend)
7. **Dark/Light Mode** — Toggle de tema (embora o dark seja a essência)
8. **Analytics** — Integração com Google Analytics ou Plausible
9. **PWA** — Progressive Web App com service worker
10. **Gallery Lightbox** — Zoom e navegação de imagens com gestos mobile
11. **Drag & Drop** — Reordenação de itens no admin com drag
12. **Webhooks** — Notificações Discord/Slack para novas mensagens
13. **Cache** — Redis para cache de queries frequentes
14. **Tests** — Testes unitários e E2E com Jest + Playwright

---

## 📋 Credenciais de Teste

| Campo | Valor |
|-------|-------|
| **Email** | admin@dracon.art |
| **Senha** | dracon2024 |

---

<div align="center">

**Feito com ✦ e magia**

*Dracon © 2024 — Todos os direitos reservados.*

</div>

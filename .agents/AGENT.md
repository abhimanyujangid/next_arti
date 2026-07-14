# AGENTS.md — Project Rules & Coding Standards

> These rules are derived from deep analysis of how this project is structured and how code is written.
> Apply them consistently across all features and files in this project and any new project using this stack.

---

## 1. Tech Stack

### Core
- **Framework**: Next.js (App Router) — use the latest stable version
- **Language**: TypeScript with **strict mode** (`"strict": true` in `tsconfig.json`)
- **Runtime**: React 19 — use Server Components by default, `"use client"` only when necessary
- **Database ORM**: Prisma with `@prisma/adapter-pg` (PostgreSQL via `pg`)
  - Prisma client output goes to `src/generated/prisma`
  - Always run `prisma generate` on `postinstall`
- **API Layer**: tRPC v11 with `@trpc/tanstack-react-query`
- **Data Fetching (client)**: TanStack React Query v5 via tRPC
- **Forms**: TanStack React Form with Zod validators
- **URL State**: `nuqs` — use `useQueryState` and search params cache
- **Styling**: Tailwind CSS v4 + `tw-animate-css` + `shadcn/ui` (radix-maia style)
- **Icons**: `lucide-react` — always use size classes (`size-4`, `size-5`, etc.)
- **Notifications**: `sonner` — use `toast.success` / `toast.error`
- **Date utilities**: `date-fns`
- **Schema validation**: Zod v4

### Auth — Better Auth
- Use **`better-auth`** for all authentication. **Never use Clerk**.
- Mount the Better Auth handler at `app/api/auth/[...all]/route.ts`
- Create `src/lib/auth.ts` (server) and `src/lib/auth-client.ts` (client-only)
- Use `auth()` from the server auth lib in tRPC procedures — return `session.user.id` and any org/team ID
- Protect routes via Next.js middleware (`src/middleware.ts` or `src/proxy.ts`)
- For multi-tenant / org support: use Better Auth's organization plugin
- Expose `authProcedure` and `orgProcedure` in `src/trpc/init.ts` using the Better Auth session

### Storage — Cloudflare R2
- Use **`@aws-sdk/client-s3`** + **`@aws-sdk/s3-request-presigner`** to interact with R2
- R2 client lives in `src/lib/r2.ts` — singleton `S3Client` configured with:
  - `region: "auto"`
  - `endpoint: https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  - credentials from `env.R2_ACCESS_KEY_ID` and `env.R2_SECRET_ACCESS_KEY`
- Export typed utility functions: `uploadFile`, `deleteFile`, `getSignedUrl`
- Use descriptive, hierarchical R2 key naming: `<resource-type>/orgs/<orgId>/<id>`
- Signed URLs expire in 3600 seconds (1 hour) unless stated otherwise
- R2 object keys are stored in the DB (`r2ObjectKey` column) — **never store public URLs**

### Monitoring — None
- **Do NOT use Sentry** (`@sentry/nextjs`) or any other error monitoring SDK
- Remove all Sentry references: `withSentryConfig`, `sentry.*.config.ts`, `instrumentation*.ts`, Sentry middleware, Sentry logger calls
- `next.config.ts` must export plain `nextConfig` — no Sentry wrappers
- Use `console.error` for critical server-side errors only

---

## 2. Project Structure

```
src/
  app/                         # Next.js App Router pages & layouts
    (dashboard)/               # Route group — authenticated dashboard
      layout.tsx               # Prefetch data here with HydrateClient
      <feature>/
        page.tsx               # Thin: prefetch + render view from feature/
        layout.tsx             # Feature-level layout if needed
    api/
      trpc/route.ts            # tRPC HTTP handler
      auth/[...all]/route.ts   # Better Auth handler
      <resource>/route.ts      # File upload / proxy API routes
    layout.tsx                 # Root layout — providers only
    globals.css                # Tailwind v4 CSS variables + theme

  feature/                     # Feature slices (vertical)
    <feature-name>/
      components/              # UI components for this feature
      views/                   # Page-level view components (use "use client")
      hook/                    # Feature-specific custom hooks (use-*.ts)
      lib/                     # Feature-specific helpers (params.ts, etc.)
      data/                    # Static data, constants, config arrays
      utils/                   # Pure utility functions

  trpc/
    init.ts                    # createTRPCRouter, baseProcedure, authProcedure, orgProcedure
    client.tsx                 # TRPCReactProvider, useTRPC — "use client"
    server.tsx                 # trpc proxy, HydrateClient, prefetch — server-only
    query-client.ts            # makeQueryClient factory
    routers/
      _app.ts                  # Root appRouter — compose sub-routers here
      <feature>.ts             # One router file per feature

  lib/
    db.ts                      # Prisma singleton
    env.ts                     # Type-safe env via @t3-oss/env-nextjs + Zod
    r2.ts                      # Cloudflare R2 client + utilities
    auth.ts                    # Better Auth server instance
    auth-client.ts             # Better Auth client (client-only)
    utils.ts                   # cn(), formatFileSize(), and shared helpers

  components/
    ui/                        # shadcn/ui components (do not edit manually)
    <shared-component>.tsx     # Cross-feature shared components

  hooks/                       # Globally shared custom hooks
  types/                       # Global TypeScript types/interfaces
  generated/                   # Prisma generated client (do not edit)

prisma/
  schema.prisma                # Prisma schema (output -> src/generated/prisma)

scripts/                       # One-off scripts (tsx)
```

---

## 3. File Naming Conventions

| What | Convention | Example |
|------|-----------|---------|
| React components | `kebab-case.tsx` | `voice-card.tsx` |
| Hooks | `use-*.ts` | `use-audio-recorder.ts` |
| Utility files | `camelCase.ts` or `kebab-case.ts` | `formatTime.ts`, `params.ts` |
| tRPC routers | `<feature>.ts` | `voices.ts` |
| Pages | `page.tsx` | — |
| Layouts | `layout.tsx` | — |
| Route groups | `(name)` | `(dashboard)` |
| Static data | `<resource>-<noun>.ts` | `voice-categories.ts` |
| Constants | `constant.ts` inside `data/` | `data/constant.ts` |

---

## 4. TypeScript Rules

- **Always** enable `"strict": true` — never use `any` implicitly
- Use explicit type annotations on function parameters and return types when they aid clarity
- Prefer `interface` for object shapes passed as props; `type` for unions, aliases, utility types
- Use `as const` on static data arrays/objects
- Never use `as any` — use type narrowing, generics, or proper typing
- `moduleResolution: bundler` — use `@/*` path alias for all internal imports
- `isolatedModules: true` — no `namespace`, no `const enum`
- Import types explicitly: `import type { Foo } from '...'`

---

## 5. Environment Variables

- All env vars are typed and validated via `@t3-oss/env-nextjs` in `src/lib/env.ts`
- Server-side secrets go in the `server` block
- Client-side public vars go in the `client` block (prefix `NEXT_PUBLIC_`)
- Always set `skipValidation: !!process.env.SKIP_ENV_VALIDATION`
- Required env vars for every project:
  - `DATABASE_URL`
  - `APP_URL`
  - `BETTER_AUTH_SECRET`
  - `BETTER_AUTH_URL`
  - `R2_ACCOUNT_ID`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `R2_BUCKET_NAME`
- Provide a `.example-env` file at the root with all keys (no values)

---

## 6. tRPC Patterns

### Procedures (`src/trpc/init.ts`)

```ts
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export const createTRPCContext = cache(async () => {
  return {};
});

const t = initTRPC.create({ transformer: superjson });

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const authProcedure = baseProcedure.use(async ({ next }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { userId: session.user.id } });
});

export const orgProcedure = authProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const orgId = session?.session.activeOrganizationId;
  if (!orgId) throw new TRPCError({ code: "FORBIDDEN", message: "No active organization" });
  return next({ ctx: { ...ctx, orgId } });
});
```

### Router structure
- One router file per feature: `src/trpc/routers/<feature>.ts`
- Compose all routers in `src/trpc/routers/_app.ts`
- Use `orgProcedure` for any data scoped to an organization
- Use `authProcedure` for user-scoped data
- Use `baseProcedure` only for truly public endpoints

### Data fetching in Server Components

```tsx
// In page.tsx or layout.tsx (server component):
import { prefetch, trpc, HydrateClient } from "@/src/trpc/server";

export default async function Page() {
  prefetch(trpc.voices.getAll.queryOptions({}));
  return (
    <HydrateClient>
      <VoicesView />
    </HydrateClient>
  );
}
```

### Data fetching in Client Components

```tsx
"use client";
import { useTRPC } from "@/src/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

function Component() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.voices.getAll.queryOptions({}));
}
```

### Mutations in Client Components

```tsx
const trpc = useTRPC();
const queryClient = useQueryClient();

const mutation = useMutation(
  trpc.voices.delete.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.voices.getAll.queryKey() });
      toast.success("Voice deleted");
    },
    onError: (err) => toast.error(err.message),
  }),
);
```

---

## 7. Component Patterns

### View Components (`views/`)
- Named export (not default), suffix `View`: `export function VoicesView()`
- Always `"use client"` at top
- Compose from feature components — keep views thin
- Data fetching via `useSuspenseQuery` — wrap with `<Suspense>` boundary in parent

### Feature Components (`components/`)
- Named exports only — no default exports from component files
- Props interface at top of file: `interface VoiceCardProps { ... }`
- Use `cn()` from `@/src/lib/utils` for conditional class merging
- Keep components focused — extract sub-components within the same file when they are not reused

### Forms
- Use **TanStack React Form** (`useForm`) with Zod validators on `onSubmit`
- Define schema outside the component with a clear name: `const myFormSchema = z.object({...})`
- Use `form.Field` render-prop API for each field
- Show validation errors only when `field.state.meta.isTouched && !field.state.meta.isValid`
- Handle mutations with `useMutation` — call `.mutateAsync` inside `form.onSubmit`
- Reset form on success: `form.reset()`

### File Uploads
- Use `react-dropzone` for drag-and-drop file selection
- Use a direct `fetch` POST with `Content-Type: file.type` — send the `File` as the body
- Upload handler lives in `src/app/api/<resource>/route.ts`
- Server side: read the request body as `arrayBuffer`, convert to `Buffer`, upload to R2

---

## 8. Prisma / Database Patterns

### Singleton (`src/lib/db.ts`)

```ts
import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const prisma = global.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
```

### Query rules
- Always use `select` or `omit` — never return entire records that include secrets (`r2ObjectKey`, etc.)
- Use `cuid()` for all primary keys: `@id @default(cuid())`
- Every model has `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`
- Add `@@index` for all foreign keys and commonly filtered fields
- Store R2 object keys in DB as `r2ObjectKey String?` — never public URLs
- Clean up R2 objects in `.catch()` — don't let R2 failures break the main flow

---

## 9. R2 Storage Implementation

```ts
// src/lib/r2.ts
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

type UploadFileOptions = {
  buffer: Buffer;
  key: string;
  contentType: string;
};

export async function uploadFile({ buffer, key, contentType }: UploadFileOptions): Promise<void> {
  await r2.send(
    new PutObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: key, Body: buffer, ContentType: contentType }),
  );
}

export async function deleteFile(key: string): Promise<void> {
  await r2.send(new DeleteObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: key }));
}

export async function getSignedFileUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: key });
  return getSignedUrl(r2, command, { expiresIn });
}
```

**R2 Key Naming Convention:**
```
<resource-type>/orgs/<orgId>/<entityId>

# Examples:
audio/orgs/org_abc123/gen_xyz789
voices/orgs/org_abc123/voice_def456
```

---

## 10. Auth Implementation (Better Auth)

### Server (`src/lib/auth.ts`)

```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import { prisma } from "./db";
import { env } from "./env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  plugins: [organization()],
  emailAndPassword: { enabled: true },
});
```

### Client (`src/lib/auth-client.ts`)

```ts
import "client-only";
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [organizationClient()],
});
```

### API Route (`src/app/api/auth/[...all]/route.ts`)

```ts
import { auth } from "@/src/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### Middleware (`src/proxy.ts`)

```ts
import { auth } from "@/src/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/sign-in", "/sign-up", "/api/auth"];

export async function middleware(req: NextRequest) {
  const isPublic = PUBLIC_PATHS.some((p) => req.nextUrl.pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  const session = await auth.api.getSession({ headers: req.headers });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (!session.session.activeOrganizationId) {
    return NextResponse.redirect(new URL("/org-selection", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

---

## 11. Next.js Config (`next.config.ts`)

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    proxyClientMaxBodySize: 20 * 1024 * 1024, // 20MB — only if needed
  },
};

export default nextConfig;
```

- Export plain `nextConfig` — **no wrappers** (no Sentry, no external plugins)
- Keep it minimal — no unnecessary rewrites or custom headers unless required

---

## 12. Root Layout (`src/app/layout.tsx`)

```tsx
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/src/components/ui/sonner";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { TRPCReactProvider } from "@/src/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "App Name", template: "%s | App Name" },
  description: "App description",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body>
        <TRPCReactProvider>
          <TooltipProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
            <Toaster />
          </TooltipProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
```

- Providers wrap children in this order: TRPCReactProvider > TooltipProvider > NuqsAdapter
- `<Toaster />` (sonner) placed just before closing `</TooltipProvider>`
- No auth provider wrapper at the root — Better Auth is session-based via API

---

## 13. CSS / Styling

- **Tailwind CSS v4** — `@import "tailwindcss"` syntax in `globals.css`
- Import order in `globals.css`:
  1. `@import "tailwindcss"`
  2. `@import "tw-animate-css"`
  3. `@import "shadcn/tailwind.css"`
- Use `@theme inline { ... }` to map CSS variables to Tailwind tokens
- Colors use **OKLCH** color space exclusively: `oklch(L C H)`
- Dark mode via `.dark` class variant: `@custom-variant dark (&:is(.dark *))`
- Always use design tokens (`bg-background`, `text-foreground`, `border-border`) — never hardcode colors
- Responsive layout: mobile-first, use `lg:` prefix for desktop overrides
- Use `cn()` from `@/src/lib/utils` for all dynamic className merging — never string concatenation

### shadcn/ui
- Style: `radix-maia`
- Icon library: `lucide`
- Components live in `src/components/ui/` — **never edit them manually**
- Add components via `npx shadcn@latest add <component>`
- Aliases in `components.json`: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`

---

## 14. Code Formatting

- **Prettier** with `prettier-plugin-tailwindcss`
- Config (`.prettierrc`):

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- Always double quotes for strings
- Always trailing commas
- Line width: 100 characters

---

## 15. ESLint (`eslint.config.mjs`)

```mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
```

---

## 16. Import Order & Conventions

Follow this import ordering within files:

1. React and Next.js imports
2. Third-party libraries
3. tRPC client/server imports
4. Internal `@/src/lib/*`
5. Internal `@/src/trpc/*`
6. Internal `@/src/feature/<feature>/*`
7. Internal `@/src/components/*`
8. Relative imports (`./`, `../`)

Use `import type` for type-only imports.

---

## 17. Patterns to AVOID

| Avoid | Use Instead |
|-------|------------|
| `@clerk/nextjs` | `better-auth` |
| `@sentry/nextjs` | Plain `console.error` |
| Default exports from component files | Named exports |
| `any` type / `as any` | Proper types, generics, narrowing |
| Hardcoded colors in Tailwind | CSS variable design tokens |
| Storing R2 public URLs in DB | Store `r2ObjectKey`, generate signed URLs on demand |
| `export *` barrel files | Explicit named re-exports |
| `useEffect` for data fetching | tRPC + TanStack Query |
| Inline style attributes | Tailwind classes |
| `var` declarations | `const` / `let` |
| Implicit `any` in `.map()` callbacks | Explicit typed parameters |
| Multiple default exports per file | One named export per concern |

---

## 18. Scripts (`scripts/`)

- One-off scripts live in `scripts/` and use `tsx` to run
- Register in `package.json`:

```json
"scripts": {
  "sync-api": "tsx scripts/sync-api.ts"
}
```

- Scripts can import from `src/lib/*` (env, db, r2)
- Use `dotenv` to load `.env` in scripts if needed

---

## 19. API Routes (Non-tRPC)

Use Next.js Route Handlers (`app/api/<resource>/route.ts`) for:
- File upload endpoints (raw body or multipart)
- Auth handler (`api/auth/[...all]`)
- Streaming audio / binary proxy (`api/audio/[id]`)

**Pattern for file upload route:**

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { uploadFile } from "@/src/lib/r2";
import { prisma } from "@/src/lib/db";

export async function POST(req: NextRequest) {
  // 1. Authenticate
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = session.session.activeOrganizationId;
  if (!orgId) return NextResponse.json({ error: "No active org" }, { status: 403 });

  // 2. Parse metadata from query params
  const name = req.nextUrl.searchParams.get("name");
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  // 3. Read body
  const buffer = Buffer.from(await req.arrayBuffer());
  const contentType = req.headers.get("content-type") ?? "application/octet-stream";

  // 4. Create DB record
  const record = await prisma.example.create({ data: { orgId, name } });

  // 5. Upload to R2
  const key = `resource/orgs/${orgId}/${record.id}`;
  await uploadFile({ buffer, key, contentType });

  // 6. Update DB with key
  await prisma.example.update({ where: { id: record.id }, data: { r2ObjectKey: key } });

  return NextResponse.json({ id: record.id });
}
```

---

## 20. Error Handling

- In tRPC procedures: throw `TRPCError` with appropriate code:
  - `NOT_FOUND`, `UNAUTHORIZED`, `FORBIDDEN`, `INTERNAL_SERVER_ERROR`, `PRECONDITION_FAILED`, `BAD_REQUEST`
- In client mutations: catch errors, extract `error.message`, show via `toast.error(message)`
- In API routes: return `NextResponse.json({ error: "..." }, { status: 4xx })`
- Side effects (R2 delete, external metering): wrap in `.catch(() => {})` — never break main flow
- Never swallow errors silently in critical paths

---

## 21. Prisma Schema Conventions

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// Better Auth required tables (generated via CLI or manual):
// user, session, account, verification, organization, member, invitation

enum ExampleStatus {
  ACTIVE
  INACTIVE
}

model Example {
  id     String        @id @default(cuid())
  orgId  String
  userId String?
  name   String
  status ExampleStatus @default(ACTIVE)
  r2ObjectKey String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([orgId])
  @@index([userId])
}
```

- Use enums for finite sets of string values
- Use `cuid()` for all primary keys
- Always include `createdAt` and `updatedAt`
- Include `@@index` on foreign keys and filter fields
- Never store auth credentials or tokens in custom models — let Better Auth manage its own tables
- Store R2 keys as `r2ObjectKey String?`, never URLs

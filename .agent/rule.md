# Project Coding Standards & Guidelines (`rule.md`)

These rules are derived from the project structure and technical stack of `next_arti`. They must be followed strictly during all coding and refactoring tasks.

---

## 1. Tech Stack & Version Conventions

### Core Libraries
- **Framework**: Next.js (App Router)
- **Language**: TypeScript (Strict Mode enabled)
- **Runtime**: React 19 (Server Components by default; `"use client"` only for interaction)
- **Database ORM**: Prisma Client with `@prisma/adapter-pg` (Postgres)
  - Generated schema files reside in `src/generated/prisma`.
- **API Protocol**: tRPC v11 with `@trpc/server` and `@trpc/client`.
- **Form Management**: TanStack React Form with Zod validators.
- **State in URLs**: `nuqs` for query parameters and state caching.
- **Styling**: Tailwind CSS v4 + Radix UI (base primitives) + CSS Variables using OKLCH.
- **Notification**: `sonner` (use `toast.success` and `toast.error`).
- **Icons**: `lucide-react`.

### Authentication (Better Auth)
- Mandate **Better Auth**. Never use external SaaS handlers like Clerk.
- Mount API handler at `src/app/api/auth/[...all]/route.ts`.
- Server configuration lives in `src/lib/auth.ts`, client in `src/lib/auth-client.ts`.
- Protect routes using Next.js Middleware.
- Expose session context in tRPC procedures via context headers.
- **Email Verification**: Enabled by default, token-based, using SMTP through `nodemailer`.

### Storage (Cloudflare R2)
- Interact using `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`.
- Setup S3 client instance in `src/lib/r2.ts`.
- Do not store public URLs in the database; store `r2ObjectKey` and generate presigned URLs on demand.

---

## 2. Directory Structure Conventions

Files are organized in feature slices:
```
src/
  app/                         # Page routes, layouts, and API endpoints
  feature/                     # Feature slices (vertical structure)
    <feature-name>/
      components/              # UI components specific to this feature
      views/                   # client-side page views ("use client")
      hook/                    # Feature hooks (use-*.ts)
      lib/                     # Feature logic helpers
  components/
    ui/                        # shadcn UI primitives (never edit manually)
  hooks/                       # Shared global hooks
  lib/                         # Client singletons (db, r2, auth, email, utils)
  generated/                   # Generated Prisma client output
```

---

## 3. Key Formatting & Quality Rules
- **No Implicit Any**: Ensure all functions, loops, and map callbacks are typed.
- **No Export Wildcards**: Do not use `export *` barrel files; use explicit named exports to avoid namespace conflicts.
- **Spacing**: Use Flexbox/Grid `gap-*` for spacing. Do not use `space-x-*` or `space-y-*`.
- **Formatting**: Double quotes, trailing commas, semi-colons, and 100 character print width.

---

## 4. tRPC Patterns

### Context & Initialization (`src/lib/trpc/init.ts`)
- Use `headers()` dynamically inside `createTRPCContext` to forward authentication session cookies.
- Maintain `publicProcedure` for guest-accessible queries.
- Expose `protectedProcedure` requiring a valid `session.user` to secure private actions.

### Routing Composition
- Split handlers by concerns/features into distinct sub-routers (e.g. `src/lib/trpc/routers/<name>.ts`).
- Bind all routers to the root `appRouter` in `src/lib/trpc/root.ts`.

### SSR & Server Calling (`src/lib/trpc/server.ts`)
- Use direct server caller `serverTrpc()` factory within Server Components (`page.tsx` or `layout.tsx`) to query database directly. This removes HTTP overhead and supports full SSR during request routing:
  ```typescript
  const api = await serverTrpc();
  const result = await api.hello();
  ```

---

## 5. Development Principles

- **Server vs Client**: `page.tsx` does the heavy lifting to prefetch the data on the server, ensuring zero loading spinners when the view mounts.
- **Strict Typings**: Everything is type-safe end-to-end (from the tRPC router through TanStack Query, directly into the form values).
- **Form State**: TanStack Form handles the dirty state and validation (`isTouched`), so errors only show after the user interacts with the input.
- **shadcn/ui**: You just wrap the standard shadcn UI components (`Input`, `Label`) inside the `form.Field` render prop function. Do not abstract them away inside custom `FormField` wrapper components unless explicitly necessary.

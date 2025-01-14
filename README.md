## Getting Started

Install the [Supabase CLI](https://supabase.com/docs/guides/local-development).
Startup Supabase containers:
```bash
supabase start
```
Note the values output with:
```bash
supabase status
```
Copy the local env template, and use the values from above to set values in your gitignored copy (anon key):
```bash
cp .template.env.local .env.local
```

Install dependencies:
```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
See the email testing service for one-time password login at [http://localhost:54324](http://localhost:54324)

## Building and Deploying - Docker
Build for linux/amd64 and push the image with a prod tag. Watchtower will pick this up automatically for deploy to the `prod` tag.
Image is registered on docker hub, `mcramblett/retrospeck`
```zsh
docker buildx build --platform linux/amd64 -f Dockerfile.nextjs -t mcramblett/retrospeck:prod --push .
```
Public environment variables will get added to the build via `.env.production`. All secrets are stored in an env file on the server. (See nextjs service in docker compose). See [environment variable precedence in Next.js](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#environment-variable-load-order)

## ORM, migrations, and schema
[Drizzle](https://orm.drizzle.team/docs/migrations) is the ORM and manages the schema in Typescript code.
When adding a new migration, follow these steps:
1. Add new migration file with `supabase migration new my_new_migration` and populate the file with SQL.
2. Apply the migration to your local db `supabase migration up` (requires containers to be running)
3. Update the Drizzle schema with `npx drizzle-kit pull`

Running migrations on the remote server requires you to [supabase link](https://supabase.com/docs/reference/cli/supabase-link) and [supabase db push](https://supabase.com/docs/reference/cli/supabase-db-push)

### Drizzle schema type errors

Drizzle generates the schema and it creates a lot of typing errors, and it's easiest to ignore them. After
generating the schema with `npx drizzle-kit pull`, add this to the top of the file:

```
// NOTE: ignoring type errors in auto-generated code
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
```

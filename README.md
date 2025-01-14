This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Docker
Build  for linux/amd63 and push the image with a prod tag. Watchtower will pick this up automatically for deploy to the `prod` tag.
Image is registered on docker hub, `mcramblett/retrospeck`
```zsh
docker buildx build --platform linux/amd64 -f Dockerfile.nextjs -t mcramblett/retrospeck:prod --push .
```

## Drizzle schema type errors

Drizzle generates the schema and it creates a lot of typing errors, and it's easiest to ignore them. After
generating the schema with `drizzle pull`, add this to the top of the file:

```
// NOTE: ignoring type errors in auto-generated code
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
```

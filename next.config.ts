import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    supabasePublicUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    databaseUrl: process.env.DATABASE_URL,
  }
};

export default nextConfig;

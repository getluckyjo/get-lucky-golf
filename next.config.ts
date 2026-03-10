import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript errors from un-generated Supabase types are ignored at build time.
  // Run `npx supabase gen types` once the DB is fully set up to fix these properly.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

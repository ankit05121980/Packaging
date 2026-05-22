/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placeholder.supabase.co'],
  },
  transpilePackages: ['three'],
};

export default nextConfig;

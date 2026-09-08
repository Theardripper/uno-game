/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
  /* config options here */
  async redirects() {
    return [
      {
        source: '/',           // Rota inicial (localhost:3000)
        destination: '/sandbox', // Para onde o usuário vai
        permanent: false,      // Use false (status 307) para redirecionamento temporário
      },
    ]
  }
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  serverRuntimeConfig: {
    // Only available on the server side
    mongodbUri: process.env.MONGODB_URI,
    adminPassword: process.env.ADMIN_PASSWORD,
  },
  publicRuntimeConfig: {
    // Exposed to the client
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;

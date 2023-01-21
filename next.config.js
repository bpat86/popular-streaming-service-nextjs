module.exports = {
  eslint: {
    dirs: ["src"],
  },
  reactStrictMode: true,
  swcMinify: true,
  // Domain whitelist
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "popular-streaming-service.s3.us-west-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    apiUrl: process.env.DOCKER_API_URL,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: process.env.CLIENT_API_URL,
  },
};

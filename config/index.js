import getConfig from "next/config";

// The browser will not be able to reach the backend via Docker alias
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

// Strapi backend api url
export const API_URL = serverRuntimeConfig.apiUrl || publicRuntimeConfig.apiUrl; // http://localhost:1337

// The Movie Database API url
export const TMDB_API_URL = process.env.TMDB_API_URL;

// Next.js frontend api url
export const NEXT_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"; // 172.22.0.1

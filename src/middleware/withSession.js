import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

/**
 * This is a session wrapper to be used in both API routes and `getServerSideProps` functions.
 * https://github.com/vvo/iron-session#session-wrappers
 */
const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: "netflix",
  cookieOptions: {
    maxAge: undefined,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    secure: process.env.NODE_ENV === "production",
  },
};

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler) {
  return withIronSessionSsr(handler, sessionOptions);
}

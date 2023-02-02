import { sessionOptions } from "@/@types/session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";

export function withSessionRoute(
  handler: (_req: NextApiRequest, _res: NextApiResponse) => void
) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler: GetServerSideProps) {
  return withIronSessionSsr(handler, sessionOptions);
}

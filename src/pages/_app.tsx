import "@/styles/globals.css";

import { Page } from "@/@types/page";
import { AppProps } from "next/app";
import { Fragment } from "react";

import { AuthProvider } from "@/context/AuthContext";
import CombineContexts from "@/context/CombineContexts";
import { InteractionProvider } from "@/context/InteractionContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { AnimatePresenceWrapper } from "@/lib/AnimatePresenceWrapper";

// Extend the AppProps
type Props = AppProps & {
  Component: Page;
};

export default function MyApp({
  Component,
  pageProps,
  router,
}: Props): JSX.Element {
  // Combine the multiple context files
  const contextProviders = [AuthProvider, ProfileProvider, InteractionProvider];

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const Layout = Component.layout ?? Fragment;

  return (
    <Layout>
      {getLayout(
        <CombineContexts contextProviders={contextProviders}>
          <AnimatePresenceWrapper mode="wait">
            <Component key={router.route} {...pageProps} />
          </AnimatePresenceWrapper>
        </CombineContexts>
      )}
    </Layout>
  );
}

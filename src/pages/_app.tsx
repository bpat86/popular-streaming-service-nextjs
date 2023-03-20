import "@/styles/globals.css";

import { AppProps } from "next/app";
import { Fragment } from "react";
// import { Toaster } from "react-hot-toast";
import { SWRConfig } from "swr";

import { Page } from "@/@types/page";
import { AuthProvider } from "@/context/AuthContext";
// import CombineContexts from "@/context/CombineContexts";
// import { ProfileProvider } from "@/context/ProfileContext";
import { AnimatePresenceWrapper } from "@/lib/AnimatePresenceWrapper";
import useInteractionStore from "@/store/InteractionStore";

// Extend the AppProps
type Props = AppProps & {
  Component: Page;
};

export default function MyApp({ Component, pageProps, router }: Props) {
  // Combine the multiple context files
  // const contextProviders = [AuthProvider, ProfileProvider];
  const activeProfile = useInteractionStore((state) => state.activeProfile);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const Layout = Component.layout ?? Fragment;
  // eslint-disable-next-line no-console
  console.log("activeProfile", activeProfile);

  return (
    <Layout>
      {getLayout(
        // <CombineContexts contextProviders={contextProviders}>
        <AuthProvider>
          <SWRConfig value={{ provider: () => new Map() }}>
            <AnimatePresenceWrapper mode="wait">
              <Component key={activeProfile || router.route} {...pageProps} />
              {/* <Toaster
                toastOptions={{
                  duration: 3000,
                }}
              /> */}
            </AnimatePresenceWrapper>
          </SWRConfig>
        </AuthProvider>
        // </CombineContexts>
      )}
    </Layout>
  );
}

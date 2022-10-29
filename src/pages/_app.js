// Contexts
// Styles
import "@/styles/globals.css";

// Libs
import { AnimatePresenceWrapper } from "@/lib/AnimatePresenceWrapper";

import { AuthProvider } from "@/context/AuthContext";
import CombineContexts from "@/context/CombineContexts";
import { InteractionProvider } from "@/context/InteractionContext";
import { ProfileProvider } from "@/context/ProfileContext";

export default function MyApp({ Component, pageProps, router }) {
  /**
   * Combine the multiple context files
   */
  const contextProviders = [AuthProvider, ProfileProvider, InteractionProvider];

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <CombineContexts contextProviders={contextProviders}>
      <AnimatePresenceWrapper mode="wait">
        <Component key={router.route} router={router} {...pageProps} />
      </AnimatePresenceWrapper>
    </CombineContexts>
  );
}

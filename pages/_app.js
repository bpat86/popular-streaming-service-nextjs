// Contexts
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { InteractionProvider } from "@/context/InteractionContext";
import { MediaProvider } from "@/context/MediaContext";
import CombineContexts from "@/context/CombineContexts";
// Libs
import AnimatePresenceWrapper from "@/components/motion/AnimatePresenceWrapper";
// Styles
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps, router }) {
  /**
   * Combine the multiple context files
   */
  const contextProviders = [
    AuthProvider,
    ProfileProvider,
    MediaProvider,
    InteractionProvider,
  ];

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <CombineContexts contextProviders={contextProviders}>
      <AnimatePresenceWrapper mode={"wait"}>
        <Component
          key={router.route}
          route={router.route}
          router={router}
          {...pageProps}
        />
      </AnimatePresenceWrapper>
    </CombineContexts>
  );
}

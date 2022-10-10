import { forwardRef, useContext, useEffect } from "react";
import Head from "next/head";
import transitions from "@/components/motion/transitions";
import PageTransitions from "@/components/layouts/PageTransitions";
import MainNavigation from "@/components/navigation/MainNavigation";
import Footer from "@/components/browse/footer";

import InteractionContext from "@/context/InteractionContext";

const BrowseLayout = forwardRef((props, layoutWrapperRef) => {
  const { children, title } = props;
  const { isWatchModeEnabled } = useContext(InteractionContext);

  // Convert the page title to kebab case
  const pageTitle = title.split(" ").join("-").toLowerCase();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Head>
        <title>{title} - Netflix</title>
        <link rel="shortcut icon" href="/netflix.ico" />
      </Head>
      <PageTransitions
        variants={isWatchModeEnabled() && transitions.fadeOutZoomIn}
      >
        <div ref={layoutWrapperRef} className="bd">
          <MainNavigation {...props} />
          <div className="main-view">
            <div className={`main-view-content is-fullbleed`}>
              <main
                className={`browse ${pageTitle} w-full overflow-hidden relative ${
                  title === "My List" ? "mt-12" : ""
                }`}
              >
                {children}
              </main>
            </div>
          </div>
          <Footer />
        </div>
      </PageTransitions>
    </>
  );
});

BrowseLayout.displayName = "BrowseLayout";
export default BrowseLayout;

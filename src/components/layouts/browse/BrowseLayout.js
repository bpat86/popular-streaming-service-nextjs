import Head from "next/head";
import { forwardRef, useContext, useEffect } from "react";

import Footer from "@/components/browse/footer";
import PageTransitions from "@/components/layouts/PageTransitions";
// Components
import { transitions } from "@/components/motion/transitions";
import MainNavigation from "@/components/navigation/MainNavigation";
// Context
import InteractionContext from "@/context/InteractionContext";

const BrowseLayout = forwardRef(
  ({ children, title, ...rest }, layoutWrapperRef) => {
    // Context
    const { isWatchModeEnabled } = useContext(InteractionContext);
    // Local vars
    const pageTitle = title.split(" ").join("-").toLowerCase();

    // Scroll to top on page change
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
            <MainNavigation {...rest} />
            <div className="main-view">
              <div className="main-view-content is-fullbleed">
                <main
                  className={`browse ${pageTitle} relative w-full overflow-hidden ${
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
  }
);

BrowseLayout.displayName = "BrowseLayout";
export default BrowseLayout;

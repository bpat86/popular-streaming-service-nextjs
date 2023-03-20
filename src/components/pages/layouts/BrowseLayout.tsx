import Head from "next/head";
import { forwardRef, MutableRefObject, ReactNode, useEffect } from "react";

import Footer from "@/components/footers/MainFooter";
import { transitions } from "@/components/motion/transitions";
import BrowseNavigation from "@/components/navigation/BrowseNavigation";
import PageTransitionsLayout from "@/components/pages/layouts/PageTransitionsLayout";
import useInteractionStore from "@/store/InteractionStore";

type BrowseLayoutProps = {
  children: ReactNode;
  title: string;
};

const BrowseLayout = forwardRef(
  ({ children, title, ...rest }: BrowseLayoutProps, ref) => {
    const layoutWrapperRef = ref as MutableRefObject<HTMLDivElement | null>;

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
        <PageTransitionsLayout
          variants={
            useInteractionStore.getState().watchModeEnabled &&
            transitions.fadeOutZoomIn
          }
        >
          <div ref={layoutWrapperRef} className="bd">
            <BrowseNavigation {...rest} />
            <div className="main-view-content">
              <main className="browse relative z-0">{children}</main>
            </div>
            <Footer />
          </div>
        </PageTransitionsLayout>
      </>
    );
  }
);

BrowseLayout.displayName = "BrowseLayout";
export default BrowseLayout;

import Head from "next/head";
import {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
} from "react";

import Footer from "@/components/footers/MainFooter";
import { transitions } from "@/components/motion/transitions";
import MainNavigation from "@/components/navigation/MainNavigation";
import PageTransitionsLayout from "@/components/pages/layouts/PageTransitionsLayout";
import InteractionContext from "@/context/InteractionContext";
import clsxm from "@/lib/clsxm";

type BrowseLayoutProps = {
  children: ReactNode;
  title: string;
};

const BrowseLayout = forwardRef(
  ({ children, title, ...rest }: BrowseLayoutProps, ref) => {
    const layoutWrapperRef = ref as MutableRefObject<HTMLDivElement | null>;
    const { isWatchModeEnabled } = useContext(InteractionContext);

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
          variants={isWatchModeEnabled() && transitions.fadeOutZoomIn}
        >
          <div ref={layoutWrapperRef} className="bd">
            <MainNavigation {...rest} />
            <div className="main-view">
              <div className="main-view-content is-fullbleed">
                <main
                  className={clsxm("browse relative w-full overflow-hidden", [
                    title === "My List" && "mt-12",
                  ])}
                >
                  {children}
                </main>
              </div>
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
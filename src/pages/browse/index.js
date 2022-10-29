// Middleware
// Components
import BrowseLayoutContainer from "@/components/layouts/swr-containers/BrowseLayoutContainer";
import { withSessionSsr } from "@/middleware/withSession";
// Utils
import { parseCookies } from "@/utils/parseCookies";

// Store
import usePreviewModalStore from "@/stores/PreviewModalStore";

const Index = ({ activeProfile, router }) => {
  const pageAPI = "getBrowsePage";
  const pageTitle = "Home";

  /**
   * Determine if a preview modal is currently open
   * @returns {Boolean}
   */
  const isPreviewModalOpen = () => {
    const previewModalStateById =
      usePreviewModalStore.getState().previewModalStateById;
    return Object.values(previewModalStateById).some(({ isOpen }) => isOpen);
  };

  return (
    <BrowseLayoutContainer
      pageAPI={pageAPI}
      pageTitle={pageTitle}
      activeProfile={activeProfile}
      shouldFreeze={router.query.jbv ?? isPreviewModalOpen() ? true : undefined}
    />
  );
};

export default Index;

export const getServerSideProps = withSessionSsr(async ({ req, res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  // Get the `user` session if it exists and set a couple helper variables
  const userSessionObj = req.session.user || null;
  const isLoggedIn = userSessionObj?.isLoggedIn || false;
  const isRegistered = userSessionObj?.registrationComplete || false;
  const { activeProfile } = parseCookies(req);

  // Redirect authenticated and registered users to the browse page
  if (!userSessionObj || !isLoggedIn || !isRegistered) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }
  // Send props to the frontend
  return {
    props: { activeProfile: activeProfile || null },
  };
});

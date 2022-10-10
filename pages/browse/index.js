import { useContext } from "react";
import { parseCookies } from "@/utils/parseCookies";
import { withSessionSsr } from "@/middleware/withSession";
import BrowseLayoutContainer from "@/components/layouts/swr-containers/BrowseLayoutContainer";
import InteractionContext from "@/context/InteractionContext";

const Index = ({ activeProfile, route, router }) => {
  const { isPreviewModalOpen } = useContext(InteractionContext);
  const pageAPI = "getBrowsePage";
  const pageTitle = "Home";

  return (
    <BrowseLayoutContainer
      route={route}
      pageAPI={pageAPI}
      pageTitle={pageTitle}
      activeProfile={activeProfile}
      shouldFreeze={router.query.jbv || isPreviewModalOpen() ? true : undefined}
    />
  );
};

export default Index;

export const getServerSideProps = withSessionSsr(async ({ req, res }) => {
  // Get the `user` session if it exists and set a couple helper variables
  const userSessionObj = req.session.user || null;
  const isLoggedIn = userSessionObj?.isLoggedIn || false;
  const isRegistered = userSessionObj?.registrationComplete || false;
  const { activeProfile, netflix } = parseCookies(req);

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

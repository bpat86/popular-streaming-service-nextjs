import { withSessionSsr } from "@/middleware/withSession";
import BrowseLayoutContainer from "@/components/layouts/swr-containers/BrowseLayoutContainer";

const BrowsePage = () => {
  const pageAPI = "getNewAndPopularPage";
  const pageTitle = "New and Popular";
  return <BrowseLayoutContainer pageAPI={pageAPI} pageTitle={pageTitle} />;
};

export default BrowsePage;

export const getServerSideProps = withSessionSsr(async ({ req, res }) => {
  // Get the `user` session if it exists and set a couple helper variables
  const user = req.session.user || null;
  const isLoggedIn = user?.isLoggedIn || false;
  const isRegistered = user?.registrationComplete || false;

  // Redirect authenticated and registered users to the browse page
  if (!user || !isLoggedIn || !isRegistered) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  // Send props to the frontend
  return {
    props: {},
  };
});

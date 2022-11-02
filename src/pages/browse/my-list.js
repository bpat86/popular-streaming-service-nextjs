import BrowseLayoutContainer from "@/components/layouts/swr-containers/BrowseLayoutContainer";
import { withSessionSsr } from "@/middleware/withSession";

const Index = () => {
  const pageAPI = "getMyListPage";
  const pageTitle = "My List";
  return <BrowseLayoutContainer pageAPI={pageAPI} pageTitle={pageTitle} />;
};

export default Index;

export const getServerSideProps = withSessionSsr(async ({ req }) => {
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

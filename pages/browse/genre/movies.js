import { withSessionSsr } from "@/middleware/withSession";
import BrowseLayoutContainer from "@/components/layouts/swr-containers/BrowseLayoutContainer";

const MoviesPage = () => {
  const pageAPI = "getMoviesPage";
  const pageTitle = "Movies";
  return <BrowseLayoutContainer pageAPI={pageAPI} pageTitle={pageTitle} />;
};

export default MoviesPage;

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

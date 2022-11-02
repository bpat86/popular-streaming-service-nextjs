// Middleware
// Components
import BrowseLayoutContainer from "@/components/layouts/swr-containers/BrowseLayoutContainer";
import { withSessionSsr } from "@/middleware/withSession";
// Utils
import { parseCookies } from "@/utils/parseCookies";

// Store

const Index = ({ initialUser }) => {
  const pageAPI = "getBrowsePage";
  const pageTitle = "Home";

  return (
    <BrowseLayoutContainer
      pageAPI={pageAPI}
      pageTitle={pageTitle}
      initialUser={initialUser}
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
  const activeProfileId = Number(activeProfile?.id);

  // Redirect authenticated and registered users to the browse page
  if (!userSessionObj || !isLoggedIn || !isRegistered) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }
  // Send props to the frontend
  return {
    props: {
      initialUser: {
        activeProfile: { id: activeProfileId || null },
        isLoggedIn,
        isRegistered,
      },
    },
  };
});

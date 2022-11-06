import PropTypes from "prop-types";

import Footer from "@/components/footers/HomeFooter";
import IntroHero from "@/components/page-specific/home/IntroHero";
import PlatformFeatures from "@/components/page-specific/home/PlatformFeatures";
import { withSessionSsr } from "@/middleware/withSession";
import { parseCookies } from "@/utils/parseCookies";

const GetStarted = (props) => {
  return (
    <>
      <IntroHero {...props} />
      <PlatformFeatures />
      <Footer />
    </>
  );
};

export default GetStarted;

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  // Get the `user` session if it exists and set a couple helper variables
  const user = req.session.user || null;
  const isLoggedIn = user?.isLoggedIn || false;
  const isRegistered = user?.registrationComplete || false;

  // Get the `email` cookie if it exists
  const cookies = parseCookies(req);
  const initialEmailValue = cookies.email || "";

  // Redirect authenticated and registered users to the browse page
  if (isLoggedIn && isRegistered) {
    return {
      redirect: { destination: "/browse", permanent: false },
      props: { user, isLoggedIn, isRegistered },
    };
  }

  // Send props to the frontend
  return {
    props: {
      user,
      isLoggedIn,
      isRegistered,
      initialEmailValue,
    },
  };
});

GetStarted.propTypes = {
  user: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
    isRegistered: PropTypes.bool,
  }),
};

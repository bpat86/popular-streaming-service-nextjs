import PropTypes from "prop-types";
import { parseCookies } from "@/utils/parseCookies";
import { withSessionSsr } from "@/middleware/withSession";
import IntroHeader from "@/components/home/IntroHeader";
import PlatformFeatures from "@/components/home/PlatformFeatures";
import Footer from "@/components/home/Footer";

const GetStarted = (props) => {
  return (
    <>
      <IntroHeader {...props} />
      <PlatformFeatures />
      <Footer />
    </>
  );
};

export default GetStarted;

export const getServerSideProps = withSessionSsr(async function ({ req, res }) {
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

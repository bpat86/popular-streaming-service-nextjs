import BrowsePage from "@/components/pages/BrowsePage";
import { withSessionSsr } from "@/middleware/withSession";
import { parseCookies } from "@/utils/parseCookies";

type InitialUserProps = {
  activeProfile: {
    id: string | null;
  };
  isLoggedIn: boolean;
  isRegistered: boolean;
};

type IndexProps = {
  initialUser: InitialUserProps;
};

const BrowseLatest = ({ initialUser }: IndexProps) => {
  const pageProps = {
    page: "latest",
    title: "New and Popular",
  };
  return (
    <BrowsePage
      key={pageProps.page}
      pageAPI={pageProps.page}
      pageTitle={pageProps.title}
      initialUser={initialUser}
    />
  );
};
export default BrowseLatest;

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  // Get the user session object from the request
  const user = req.session.user ?? null;
  const isLoggedIn = user?.isLoggedIn;
  const isRegistered = user?.registrationComplete;
  const { activeProfile } = parseCookies(req);
  // Redirect unauthenticated users to the login page
  if (!user || !isLoggedIn || !isRegistered) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }
  // Redirect authenticated and registered users to the browse page
  return {
    props: {
      initialUser: {
        activeProfile: { id: activeProfile ?? null },
        isLoggedIn: !!isLoggedIn,
        isRegistered: !!isRegistered,
      },
    },
  };
});

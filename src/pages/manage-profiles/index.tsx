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

type ManageProfilesProps = {
  initialUser: InitialUserProps;
};

export default function ManageProfiles({ initialUser }: ManageProfilesProps) {
  const info = {
    api: "manage-profiles",
    title: "Manage Profiles",
  };
  return (
    <BrowsePage
      key={info.api}
      pageAPI={info.api}
      pageTitle={info.title}
      initialUser={initialUser}
    />
  );
}

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

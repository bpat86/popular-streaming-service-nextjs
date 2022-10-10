import Profile from "@/components/layouts/ProfilesLayout";
import { withSessionSsr } from "@/middleware/withSession";
import PropTypes from "prop-types";

const WhosWatchingPage = (props) => {
  const { isLoggedIn } = props;

  return (
    <>
      <Profile {...props} title="Who's Watching?">
        <div className="flex flex-col items-center fade-in">
          <h1 className="block text-white text-4xl sm:text-6xl font-semibold">
            Who's watching?
          </h1>
          <ul className="flex flex-row flex-wrap space-x-8 justify-center w-full my-8 mb-20">
            <li className="group flex flex-col items-center justify-center text-center my-3 cursor-pointer">
              <div
                className="profile-avatar w-32 h-32 md:w-44 md:h-44 flex flex-col ring-inset group-hover:ring-4 group-hover:ring-white mx-auto bg-cover rounded-md"
                style={{
                  backgroundImage: 'url("/images/profiles/avatars/jvn.png")',
                }}
              ></div>
              <dl className="mt-4 flex-grow flex flex-col justify-between">
                <dt className="sr-only">Profile name: Stephanie</dt>
                <dd className="text-gray-400 group-hover:text-white text-2xl">
                  Stephanie
                </dd>
              </dl>
            </li>
            <li className="group flex flex-col items-center justify-center text-center my-3 cursor-pointer">
              <div
                className="profile-avatar w-32 h-32 md:w-44 md:h-44 flex flex-col ring-inset group-hover:ring-4 group-hover:ring-white mx-auto bg-cover rounded-md"
                style={{
                  backgroundImage: 'url("/images/profiles/avatars/robot.png")',
                }}
              ></div>
              <dl className="mt-4 flex-grow flex flex-col justify-between">
                <dt className="sr-only">Profile name: Georgie</dt>
                <dd className="text-gray-400 group-hover:text-white text-2xl">
                  Georgie
                </dd>
              </dl>
            </li>
            <li className="group flex flex-col items-center justify-center text-center my-3 cursor-pointer">
              <div
                className="profile-avatar w-32 h-32 md:w-44 md:h-44 flex flex-col ring-inset group-hover:ring-4 group-hover:ring-white mx-auto bg-cover rounded-md"
                style={{
                  backgroundImage: 'url("/images/profiles/avatars/panda.png")',
                }}
              ></div>
              <dl className="mt-4 flex-grow flex flex-col justify-between">
                <dt className="sr-only">Profile name: Bobby</dt>
                <dd className="text-gray-400 group-hover:text-white text-2xl">
                  Bobby
                </dd>
              </dl>
            </li>
            <li className="group flex flex-col items-center justify-center text-center my-3 cursor-pointer">
              <div
                className="profile-avatar w-32 h-32 md:w-44 md:h-44 flex flex-col ring-inset group-hover:ring-4 group-hover:ring-white mx-auto bg-cover rounded-md"
                style={{
                  backgroundImage: 'url("/images/profiles/avatars/kids.png")',
                }}
              ></div>
              <dl className="mt-4 flex-grow flex flex-col justify-between">
                <dt className="sr-only">Profile name: Kids</dt>
                <dd className="text-gray-400 group-hover:text-white text-2xl">
                  Kids
                </dd>
              </dl>
            </li>
            <li className="group flex flex-col items-center justify-center text-center my-3 cursor-pointer">
              <div className="profile-avatar w-32 h-32 md:w-44 md:h-44 flex flex-col items-center justify-center	group-hover:bg-white mx-auto rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-32 w-32 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <dl className="mt-4 flex-grow flex flex-col justify-between">
                <dt className="sr-only">Add Profile</dt>
                <dd className="text-gray-400 group-hover:text-white text-2xl">
                  Add Profile
                </dd>
              </dl>
            </li>
          </ul>
          <span>
            <a
              aria-label="Manage Profiles"
              className="font-semibold text-xl text-gray-400 hover:text-white uppercase tracking-widest px-8 py-3 border border-gray-400 hover:border-white"
              href="#"
            >
              Manage Profiles
            </a>
          </span>
        </div>
      </Profile>
    </>
  );
};

export default WhosWatchingPage;

export const getServerSideProps = withSessionSsr(async function ({ req, res }) {
  // Get the `user` session if it exists
  const user = req.session.user;
  const isLoggedIn = user?.isLoggedIn || false;

  // Only authenticated users can access the browse page
  if (user === undefined || !isLoggedIn) {
    return {
      redirect: { destination: "/", permanent: false },
      props: {},
    };
  }

  // Send prop(s) to the frontend
  return {
    props: { user, isLoggedIn },
  };
});

WhosWatchingPage.propTypes = {
  user: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }),
};

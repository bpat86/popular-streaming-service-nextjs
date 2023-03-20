import PropTypes from "prop-types";

import ProfileGateLayout from "@/components/pages/layouts/ProfileGateLayout";
import { withSessionSsr } from "@/middleware/withSession";

const WhosWatchingPage = (props) => {
  return (
    <>
      <ProfileGateLayout {...props} title="Who's Watching?">
        <div className="fade-in flex flex-col items-center">
          <h1 className="block text-4xl font-semibold text-white sm:text-6xl">
            Who's watching?
          </h1>
          <ul className="my-8 mb-20 flex w-full flex-row flex-wrap justify-center space-x-8">
            <li className="group my-3 flex cursor-pointer flex-col items-center justify-center text-center">
              <div
                className="profile-avatar mx-auto flex h-32 w-32 flex-col rounded-md bg-cover ring-inset group-hover:ring-4 group-hover:ring-white md:h-44 md:w-44"
                style={{
                  backgroundImage: 'url("/images/profiles/avatars/jvn.png")',
                }}
              ></div>
              <dl className="mt-4 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Profile name: Stephanie</dt>
                <dd className="text-2xl text-zinc-400 group-hover:text-white">
                  Stephanie
                </dd>
              </dl>
            </li>
            <li className="group my-3 flex cursor-pointer flex-col items-center justify-center text-center">
              <div
                className="profile-avatar mx-auto flex h-32 w-32 flex-col rounded-md bg-cover ring-inset group-hover:ring-4 group-hover:ring-white md:h-44 md:w-44"
                style={{
                  backgroundImage: 'url("/images/profiles/avatars/robot.png")',
                }}
              ></div>
              <dl className="mt-4 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Profile name: Georgie</dt>
                <dd className="text-2xl text-zinc-400 group-hover:text-white">
                  Georgie
                </dd>
              </dl>
            </li>
            <li className="group my-3 flex cursor-pointer flex-col items-center justify-center text-center">
              <div
                className="profile-avatar mx-auto flex h-32 w-32 flex-col rounded-md bg-cover ring-inset group-hover:ring-4 group-hover:ring-white md:h-44 md:w-44"
                style={{
                  backgroundImage: 'url("/images/profiles/avatars/panda.png")',
                }}
              ></div>
              <dl className="mt-4 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Profile name: Bobby</dt>
                <dd className="text-2xl text-zinc-400 group-hover:text-white">
                  Bobby
                </dd>
              </dl>
            </li>
            <li className="group my-3 flex cursor-pointer flex-col items-center justify-center text-center">
              <div
                className="profile-avatar mx-auto flex h-32 w-32 flex-col rounded-md bg-cover ring-inset group-hover:ring-4 group-hover:ring-white md:h-44 md:w-44"
                style={{
                  backgroundImage: 'url("/images/profiles/avatars/kids.png")',
                }}
              ></div>
              <dl className="mt-4 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Profile name: Kids</dt>
                <dd className="text-2xl text-zinc-400 group-hover:text-white">
                  Kids
                </dd>
              </dl>
            </li>
            <li className="group my-3 flex cursor-pointer flex-col items-center justify-center text-center">
              <div className="profile-avatar mx-auto flex h-32 w-32 flex-col items-center justify-center rounded-md	group-hover:bg-white md:h-44 md:w-44">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-32 w-32 text-zinc-400"
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
              <dl className="mt-4 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Add Profile</dt>
                <dd className="text-2xl text-zinc-400 group-hover:text-white">
                  Add Profile
                </dd>
              </dl>
            </li>
          </ul>
          <span>
            <a
              aria-label="Manage Profiles"
              className="border border-zinc-400 px-8 py-3 text-xl font-semibold uppercase tracking-widest text-zinc-400 hover:border-white hover:text-white"
              href="#"
            >
              Manage Profiles
            </a>
          </span>
        </div>
      </ProfileGateLayout>
    </>
  );
};

export default WhosWatchingPage;

export const getServerSideProps = withSessionSsr(async function ({ req }) {
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

import Head from "next/head";
import ProfileNavigation from "@/components/navigation/ProfileNavigation";

const ProfileLayout = (props) => {
  const { isLoggedIn, isRegistered, user, title, minHeight, children } = props;
  const height = minHeight || "min-h-screen";

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/netflix.ico" />
      </Head>
      <ProfileNavigation {...props} />
      <div className="flex flex-col items-center justify-center h-full">
        <main
          className={`profile bg-gray-900 flex flex-col item-center justify-center w-full ${height} overflow-hidden relative z-0`}
        >
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent mix-blend-multiply"
              aria-hidden="true"
            ></div>
          </div>
          <div className="header-container flex flex-col w-full z-10">
            <div className="flex flex-wrap items-center justify-center h-full">
              <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-screen-xl mx-auto px-6 text-base sm:text-lg md:text-2xl text-shadow font-normal text-gray-100">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfileLayout;

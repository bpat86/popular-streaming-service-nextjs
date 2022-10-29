import Head from "next/head";

import ProfileNavigation from "@/components/navigation/ProfileNavigation";

const ProfileLayout = (props) => {
  const { title, minHeight, children } = props;
  const height = minHeight || "min-h-screen";

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/netflix.ico" />
      </Head>
      <ProfileNavigation {...props} />
      <div className="flex h-full flex-col items-center justify-center">
        <main
          className={`profile item-center flex w-full flex-col justify-center bg-gray-900 ${height} relative z-0 overflow-hidden`}
        >
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent mix-blend-multiply"
              aria-hidden="true"
            ></div>
          </div>
          <div className="header-container z-10 flex w-full flex-col">
            <div className="flex h-full flex-wrap items-center justify-center">
              <div className="text-shadow mx-auto flex w-full max-w-screen-xl flex-col items-center justify-start px-6 text-base font-normal text-gray-100 sm:text-lg md:justify-center md:text-2xl">
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

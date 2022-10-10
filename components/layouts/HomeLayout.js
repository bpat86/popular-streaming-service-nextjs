import Head from "next/head";
import HomeNavigation from "@/components/navigation/HomeNavigation";

const Splash = (props) => {
  const { isLoggedIn, isRegistered, user, title, minHeight, children } = props;
  const height = minHeight || "min-h-screen";

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/netflix.ico" />
      </Head>
      <HomeNavigation {...props} />
      <main
        className={`flex flex-col item-center justify-center w-full ${height} relative overflow-x-hidden `}
      >
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://popular-streaming-service.s3.us-west-1.amazonaws.com/movie_splash_lrg_2_ce06dc0192.jpg"
            alt=""
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-500 to-gray-900 mix-blend-multiply"
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
    </>
  );
};

export default Splash;

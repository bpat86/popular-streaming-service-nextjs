import Head from "next/head";
import Image from "next/image";

import HomeNavigation from "@/components/navigation/HomeNavigation";

const Splash = (props) => {
  const { title, minHeight, children } = props;
  const height = minHeight || "min-h-screen";

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/netflix.ico" />
      </Head>
      <HomeNavigation {...props} />
      <main
        className={`item-center flex w-full flex-col justify-center ${height} relative overflow-x-hidden `}
      >
        <div className="absolute inset-0">
          <Image
            layout="fill"
            priority={true}
            objectFit="cover"
            className="h-full w-full object-cover"
            src="https://popular-streaming-service.s3.us-west-1.amazonaws.com/movie_splash_lrg_2_ce06dc0192.jpg"
            alt=""
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-500 to-gray-900 mix-blend-multiply"
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
    </>
  );
};

export default Splash;

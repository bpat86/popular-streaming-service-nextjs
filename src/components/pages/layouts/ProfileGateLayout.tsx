import Head from "next/head";
import { ReactNode } from "react";

import ProfileNavigation from "@/components/navigation/ProfileNavigation";
import clsxm from "@/lib/clsxm";

type ProfileGateLayoutProps = {
  user: any;
  title: string;
  minHeight?: string;
  children: ReactNode;
};

const ProfileGateLayout = ({
  user,
  title,
  minHeight,
  children,
}: ProfileGateLayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/netflix.ico" />
      </Head>
      <ProfileNavigation user={user} />
      <div className="flex h-full flex-col items-center justify-center">
        <main
          className={clsxm(
            "profile item-center relative z-0 flex w-full flex-col justify-center overflow-hidden bg-zinc-900",
            [minHeight ? minHeight : "min-h-screen"]
          )}
        >
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent mix-blend-multiply"
              aria-hidden="true"
            />
          </div>
          <div className="header-container z-10 flex w-full flex-col">
            <div className="flex h-full flex-wrap items-center justify-center">
              <div className="text-shadow mx-auto flex w-full max-w-screen-xl flex-col items-center justify-start px-6 text-base font-normal text-zinc-100 sm:text-lg md:justify-center md:text-2xl">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfileGateLayout;

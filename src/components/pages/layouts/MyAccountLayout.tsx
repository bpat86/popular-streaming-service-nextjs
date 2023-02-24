import Head from "next/head";
import { ReactNode } from "react";

import Footer from "@/components/footers/MainFooter";
import AccountNavigation from "@/components/navigation/AccountNavigation";

type MyAccountLayoutProps = {
  title: string;
  children: ReactNode;
};

const MyAccountLayout = (props: MyAccountLayoutProps) => {
  const { title, children } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/netflix.ico" />
      </Head>
      <AccountNavigation {...props} />
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white">
        <main className="mx-auto my-16 w-full max-w-screen-xl px-6">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MyAccountLayout;

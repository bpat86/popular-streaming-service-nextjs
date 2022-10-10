import Head from "next/head";
import AccountNavigation from "@/components/navigation/AccountNavigation";
import Footer from "../registration/Footer";

const AccountPage = (props) => {
  const { title, children } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/netflix.ico" />
      </Head>
      <AccountNavigation {...props} />
      <div className="flex flex-col w-full min-h-screen overflow-hidden bg-white relative">
        <main className="w-full max-w-screen-xl mx-auto my-16 px-6">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AccountPage;

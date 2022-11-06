import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Stripe from "stripe";

import AddPaymentMethod from "@/components/forms/my-account/AddPaymentMethod";
import { UpdateEmail } from "@/components/forms/my-account/UpdateEmail";
import { UpdatePassword } from "@/components/forms/my-account/UpdatePassword";
import { UpdatePhone } from "@/components/forms/my-account/UpdatePhone";
import AccountLayout from "@/components/layouts/MyAccountLayout";
import ProfilesAccordion from "@/components/page-specific/my-account/ProfilesAccordion";
import AuthContext from "@/context/AuthContext";
import ProfileContext from "@/context/ProfileContext";
import useProfiles from "@/middleware/useProfiles";
import useUser from "@/middleware/useUser";
import { withSessionSsr } from "@/middleware/withSession";

const Index = (props) => {
  const { initialUser, isActive, clientSecret } = props;
  const { resetErrors, logout } = useContext(AuthContext);
  const { user, mutateUser } = useUser({
    fallbackData: initialUser,
  });
  const { profiles, profileNames, mutateProfiles, loadingProfiles, config } =
    useProfiles({ user });

  useEffect(() => {
    resetErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line no-unused-vars
  const [stripePromise, _setStripePromise] = useState(() =>
    loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PK}`)
  );

  const {
    setError,
    formDataContext,
    setFormDataContext,
    profileId,
    setProfileId,
    name,
    setName,
    kid,
    setKid,
    autoPlayNextEpisode,
    setAutoPlayNextEpisode,
    autoPlayPreviews,
    setAutoPlayPreviews,
    defaultAvatar,
    setDefaultAvatar,
    currentAvatar,
    setCurrentAvatar,
    previousAvatar,
    setPreviousAvatar,
    avatar,
    setAvatar,
    addNewProfile,
    setAddNewProfile,
    editProfile,
    setEditProfile,
    manageProfiles,
    setManageProfiles,
    manageProfilesHandler,
    selectAvatarPrompt,
    setSelectAvatarPrompt,
    avatarConfirmPrompt,
    setAvatarConfirmPrompt,
    deleteProfilePrompt,
    setDeleteProfilePrompt,
    updateAvatar,
    createProfile,
    getUpdatedProfile,
    updateProfile,
    deleteProfile,
    resetAvatarSelection,
    closeAvatarConfirmPrompt,
    closeSelectAvatarPrompt,
    resetFormState,
    makeProfileActive,
    activeProfile,
  } = useContext(ProfileContext);

  const userData = {
    user,
    logout,
    isLoggedIn: user?.isLoggedIn,
    isActive,
  };

  const profilesState = {
    setError,
    formDataContext,
    setFormDataContext,
    profileId,
    setProfileId,
    name,
    setName,
    kid,
    setKid,
    autoPlayNextEpisode,
    setAutoPlayNextEpisode,
    autoPlayPreviews,
    setAutoPlayPreviews,
    defaultAvatar,
    setDefaultAvatar,
    currentAvatar,
    setCurrentAvatar,
    previousAvatar,
    setPreviousAvatar,
    avatar,
    setAvatar,
    addNewProfile,
    setAddNewProfile,
    editProfile,
    setEditProfile,
    manageProfiles,
    setManageProfiles,
    manageProfilesHandler,
    selectAvatarPrompt,
    setSelectAvatarPrompt,
    avatarConfirmPrompt,
    setAvatarConfirmPrompt,
    deleteProfilePrompt,
    setDeleteProfilePrompt,
    updateAvatar,
    createProfile,
    getUpdatedProfile,
    updateProfile,
    deleteProfile,
    resetAvatarSelection,
    closeAvatarConfirmPrompt,
    closeSelectAvatarPrompt,
    resetFormState,
    makeProfileActive,
    activeProfile,
  };

  const profilesData = {
    ...profilesState,
    profiles,
    profileNames,
    mutateProfiles,
    loadingProfiles,
    config,
  };

  const data = {
    ...userData,
    ...profilesData,
  };

  const handleTimestamp = (timestamp) => {
    const accountAge = new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
    });
    return accountAge;
  };

  const DisplaySubscription = () => {
    const plan = user?.plan?.planName;
    if (plan && plan === "Premium") {
      return (
        <span className="flex flex-row items-center space-x-1 text-base text-gray-700">
          <span>{plan}</span>
          <span>
            <svg className="ml-3 h-5" viewBox="0 0 4770 960">
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <path
                  d="M724,595 C724,642 714,672 694,684 C673,696 622,702 538,702 C460,702 412,696 393,684 C373,672 363,642 363,595 L363,247 L291,247 L291,612 C291,665 309,701 344,721 C379,739 445,749 543,749 C647,749 715,739 748,720 C780,700 796,659 796,595 L796,247 L724,247 L724,595 Z M1013,691 L1013,247 L941,247 L941,744 L1341,744 L1341,691 L1013,691 Z M1858,299 L1858,247 L1372,247 L1372,299 L1580,299 L1580,744 L1652,744 L1652,299 L1858,299 Z M2428,617 C2428,556 2394,525 2327,520 L2327,519 C2369,515 2398,503 2414,484 C2429,467 2437,434 2437,388 C2437,336 2422,300 2394,278 C2366,257 2318,247 2249,247 L1946,247 L1946,744 L2018,744 L2018,542 L2259,542 C2323,542 2356,571 2356,629 L2356,744 L2428,744 L2428,617 Z M2337,475 C2318,489 2281,495 2225,495 L2018,495 L2018,295 L2250,295 C2299,295 2331,301 2345,314 C2360,328 2368,358 2368,402 C2368,438 2358,462 2337,475 Z M3008,744 L3083,744 L2844,247 L2743,247 L2510,744 L2586,744 L2635,639 L2958,639 L3008,744 Z M2937,596 L2656,596 L2795,292 L2937,596 Z M3730,549 L3428,549 L3428,746 L3330,746 L3330,247 L3428,247 L3428,443 L3730,443 L3730,247 L3829,247 L3829,746 L3730,746 L3730,549 Z M4226,247 C4301,247 4356,260 4389,286 C4417,306 4438,335 4454,372 C4470,408 4478,449 4478,493 C4478,591 4449,661 4389,706 C4356,732 4301,746 4226,746 L3980,746 L3980,247 L4226,247 Z M4216,639 C4346,639 4373,562 4373,493 C4373,427 4359,351 4216,351 L4078,351 L4078,639 L4216,639 Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M4638.00019,0 C4711.00009,0 4770,59 4770,132 L4770,827 C4770,868.423884 4751.51202,905.147426 4722.42954,929.452533 C4699.55882,948.56629 4670.13605,960 4638.00019,960 L133.999803,960 C58.9999134,960 0,901 0,827 L0,132 C0,59 58.9999134,0 133.999803,0 L4638.00019,0 Z M133.999803,80 C103.999847,80 79.9998826,103 79.9998826,132 L79.9998826,827 C79.9998826,857 103.999847,880 133.999803,880 L4638.00019,880 C4667.00015,880 4690.00012,856 4690.00012,827 L4690.00012,132 C4690.00012,103 4667.00015,80 4638.00019,80 L133.999803,80 Z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </span>
        </span>
      );
    }
    return <>{user?.plan?.planName}</>;
  };

  const PaymentMethodsList = () => {
    return (
      <div className="flex flex-col space-y-1">
        {user?.paymentMethods?.data?.map((method) => (
          <div key={method.id} className="group flex items-center">
            <span className="flex w-full cursor-pointer flex-row items-center space-x-2 rounded-lg px-3 py-3 text-gray-700 hover:bg-gray-50">
              <span className="relative h-5 w-10 sm:h-6">
                <Image
                  layout="fill"
                  objectFit="contain"
                  src={`/images/auth/${method.card.brand}.svg`}
                  alt={`${method.card.brand}`}
                />
              </span>
              <span>••••</span>
              <span>••••</span>
              <span>••••</span>
              <span>{method.card.last4}</span>
            </span>
            <div className="ml-1 flex-shrink-0">
              <button
                type="button"
                className="inline-flex items-center rounded-full border border-transparent p-1 text-gray-800 duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 group-hover:bg-gray-200"
              >
                <span className="flex items-center">
                  <span className="sr-only">Delete</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Elements stripe={stripePromise}>
      <AccountLayout {...data}>
        <div className="flex items-center">
          <h2 className="text-4xl leading-6 tracking-wide text-gray-800">
            Account
          </h2>
          <div className="account member-since ml-4 flex items-center text-sm font-semibold tracking-wide">
            <span className="text-netflix-red">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <span className="ml-2">{`Member Since ${handleTimestamp(
              user?.createdAt
            )}`}</span>
          </div>
        </div>
        <div className="mt-5 border-t-2 border-gray-200">
          <div className="divide-y-2 divide-gray-200 text-sm text-gray-500 sm:text-base">
            <section className="mt-6 w-full">
              <div className="flex items-center">
                <span className="text-lg tracking-wide text-gray-600 sm:text-xl">
                  Membership & Billing
                </span>
                {isActive ? (
                  <span className="ml-3 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-normal tracking-wide text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="ml-3 inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-normal tracking-wide text-red-800">
                    Inactive
                  </span>
                )}
              </div>
              <div className="divide-y divide-gray-200">
                <section className="grid gap-6 py-6 sm:py-8 lg:grid-cols-3 lg:gap-8">
                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-base font-semibold text-gray-600 sm:text-lg">
                      Email address
                    </h2>
                    <p className="text-sm leading-snug sm:text-base sm:leading-tight">
                      Update the email address associated with your account.
                    </p>
                  </div>
                  <div className="flex flex-grow flex-col sm:col-span-2">
                    <UpdateEmail
                      initialValue={user?.email}
                      mutateUser={mutateUser}
                    />
                  </div>
                </section>
                <section className="grid gap-6 py-6 sm:py-8 lg:grid-cols-3 lg:gap-8">
                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-base font-semibold text-gray-600 sm:text-lg">
                      Phone number
                    </h2>
                    <p className="text-sm leading-snug sm:text-base sm:leading-tight">
                      Update the phone number associated with your account.
                    </p>
                  </div>
                  <div className="account-phone-group flex flex-col sm:col-span-2">
                    <UpdatePhone
                      initialValue={user?.phone}
                      mutateUser={mutateUser}
                    />
                  </div>
                </section>
                <section className="grid gap-6 py-6 sm:py-8 lg:grid-cols-3 lg:gap-8">
                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-base font-semibold text-gray-600 sm:text-lg">
                      Password
                    </h2>
                    <p className="text-sm leading-snug sm:text-base sm:leading-tight">
                      Update the password associated with your account.
                    </p>
                  </div>
                  <div className="account-password flex w-full flex-grow items-center sm:col-span-2">
                    <UpdatePassword initialValue="" mutateUser={mutateUser} />
                  </div>
                </section>
                <section className="grid gap-6 py-6 sm:py-8 lg:grid-cols-3 lg:gap-8">
                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-base font-semibold text-gray-600 sm:text-lg">
                      Payment methods
                    </h2>
                    <p className="text-sm leading-snug sm:text-base sm:leading-tight">
                      Payment methods associated with your account.
                    </p>
                  </div>
                  <div className="flex w-full flex-grow items-start font-bold tracking-wide sm:col-span-2">
                    <PaymentMethodsList />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-base font-semibold text-gray-600 sm:text-lg">
                      Update payment method
                    </h2>
                    <p className="text-sm leading-snug sm:text-base sm:leading-tight">
                      Update your default payment method.
                    </p>
                  </div>
                  <div className="flex sm:col-span-2">
                    <AddPaymentMethod
                      user={user}
                      mutateUser={mutateUser}
                      clientSecret={clientSecret}
                      paymentMethodList={user?.paymentMethods?.data}
                    />
                  </div>
                </section>
              </div>
            </section>
            <section className="grid gap-6 py-6 sm:py-8 lg:grid-cols-3 lg:gap-8">
              <span className="text-lg tracking-wide text-gray-600 sm:text-xl">
                Plan Details
              </span>
              <div className="flex sm:col-span-2">
                <span className="account-plan flex w-full flex-grow items-center font-bold">
                  <DisplaySubscription mutateUser={mutateUser} />
                </span>
                <span className="ml-4 flex-shrink-0">
                  <button
                    type="button"
                    className="my-2 rounded bg-white text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:my-1"
                  >
                    Change plan
                  </button>
                </span>
              </div>
            </section>
            <section className="grid gap-6 py-6 sm:py-8 lg:grid-cols-3 lg:gap-8">
              <span className="text-lg tracking-wide text-gray-600 sm:text-xl">
                Profile & Parental Controls
              </span>
              <div className="col-span-2 flex w-full flex-col text-gray-700">
                {profiles?.map((profile, idx) => (
                  <ProfilesAccordion
                    key={idx}
                    id={idx}
                    avatar={profile?.attributes?.avatar}
                    name={profile?.attributes?.name}
                    maturity={profile?.attributes?.kid}
                  >
                    <div className="my-4 ml-20 sm:grid sm:grid-cols-2 sm:gap-4">
                      <div className="flex items-center sm:col-span-2">
                        <span className="account-plan flex w-full flex-grow flex-col">
                          <span className="text-gray-800">
                            Playback settings
                          </span>
                          <span className="mt-1  text-sm">
                            Autoplay next episode. Autoplay previews. Default
                            video and audio quality.
                          </span>
                        </span>
                        <span className="ml-4 flex-shrink-0">
                          <button
                            type="button"
                            className="my-2 rounded bg-white text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:my-1"
                          >
                            Change
                          </button>
                        </span>
                      </div>
                    </div>
                  </ProfilesAccordion>
                ))}
              </div>
            </section>
          </div>
        </div>
      </AccountLayout>
    </Elements>
  );
};

export default Index;

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  // Get the `user` session if it exists and set a couple helper variables
  const user = req.session.user || null;
  const isLoggedIn = user?.isLoggedIn || false;
  const isRegistered = user?.registrationComplete || false;

  // Redirect authenticated and registered users to the browse page
  if (!isLoggedIn || !isRegistered) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  // Get cookies if they exist
  // const initialClientSecret = cookies.clientSecret || "";
  // const stripeCustomerId = user?.stripeCustomerId || "";
  // const stripeSubscriptionId = user?.stripeSubscriptionId || "";

  // Initialize Stripe
  const stripe = new Stripe(process.env.STRIPE_SK, {
    apiVersion: "2020-08-27",
  });

  const [subscriptions, paymentMethods, setupIntent] = await Promise.all([
    // Get subscriptions
    stripe.subscriptions.list({
      customer: user?.stripeCustomerId,
      status: "all",
      expand: ["data.default_payment_method"],
    }),
    // Get user payment methods
    stripe.paymentMethods.list({
      customer: user?.stripeCustomerId,
      type: "card",
    }),
    // Setup intent
    stripe.setupIntents.create({
      customer: user?.stripeCustomerId,
      payment_method_types: ["card"],
    }),
  ]);

  const clientSecret = setupIntent.client_secret;
  const isActive = subscriptions.data[0].status === "active" ? true : false;

  // Send props to the frontend
  return {
    props: {
      initialUser: {
        isActive,
        clientSecret,
        subscriptions: subscriptions.data[0],
        paymentMethods: paymentMethods,
        ...user,
      },
      isActive,
      clientSecret,
      subscriptions: subscriptions.data[0],
      paymentMethods: paymentMethods.data[0],
    },
  };
});

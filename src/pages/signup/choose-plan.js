import axios from "axios";
import { useContext, useState } from "react";
import Stripe from "stripe";

import { ChoosePlanForm } from "@/components/forms/ChoosePlanForm";
import RegistrationLayout from "@/components/layouts/RegistrationLayout";
import AuthContext from "@/context/AuthContext";
import { withSessionSsr } from "@/middleware/withSession";

import { API_URL } from "@/config/index";

const ChoosePlan = (props) => {
  const {
    stripeSubscriptionPlans,
    strapiSubscriptionPlans,
    defaultPlan,
    selectedPlan,
  } = props;
  // Bring in the what we need from our Auth context
  const { registrationStepFour } = useContext(AuthContext);

  // Get the Strapi plan id that corresponds with the Stripe subscription price id
  const getStrapiSubscriptionPlanId = (stripeId = defaultPlan.id) => {
    return strapiSubscriptionPlans.data.find((strapiPlan) => {
      if (strapiPlan.attributes.stripePriceId === stripeId) {
        return strapiPlan.id;
      }
    });
  };

  // Set the initial form state
  const [formData, setFormData] = useState({
    id: selectedPlan ?? getStrapiSubscriptionPlanId(),
    name: defaultPlan.product.name,
    price: defaultPlan.unit_amount,
  });

  // Set the clicked plan as the selected plan
  const selectPlan = (e, selectedId, selectedName, selectedPrice) => {
    e.preventDefault();
    // Update the state with the selected plan
    setFormData({
      id: getStrapiSubscriptionPlanId(selectedId),
      name: selectedName,
      price: selectedPrice,
    });
  };

  // Format Stripe price
  const formatPrice = (price) => {
    return (price / 100).toFixed(2);
  };

  return (
    <>
      <RegistrationLayout title="Sign up for Netflix" {...props}>
        <div className="slide-in mx-auto max-w-4xl">
          <div className="mx-auto flex max-w-4xl flex-col items-start">
            <h2 className="pb-1 text-center text-sm font-normal uppercase tracking-wide text-gray-800">
              Step <span className="font-bold">2</span> of{" "}
              <span className="font-bold">3</span>
            </h2>
            <p className="block text-center text-2xl font-bold tracking-wide text-gray-800 sm:text-3xl">
              Choose your plan
            </p>
            <div className="flex flex-col items-start">
              <dl className="mx-auto mt-4 w-full">
                <div className="relative my-1">
                  <dt>
                    <svg
                      className="absolute h-7 w-7 text-netflix-red"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </dt>
                  <dd className="ml-10 text-lg text-gray-700">
                    Watch all you want. Ad-free.
                  </dd>
                </div>
                <div className="relative my-1">
                  <dt>
                    <svg
                      className="absolute h-7 w-7 text-netflix-red"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </dt>
                  <dd className="ml-10 text-lg text-gray-700">
                    Recommendations just for you.
                  </dd>
                </div>
                <div className="relative my-1">
                  <dt>
                    <svg
                      className="absolute h-7 w-7 text-netflix-red"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </dt>
                  <dd className="ml-10 text-lg text-gray-700">
                    Change or cancel your plan anytime.
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Mobile */}
          <div className="mx-auto mt-16 block max-w-2xl space-y-16 sm:hidden lg:hidden">
            <section className="group">
              <div className="mb-8 px-4">
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                  Basic
                </h2>
                <p className="mt-4">
                  <span className="text-base font-bold text-gray-900 group-hover:text-netflix-red">
                    $8.99
                  </span>
                </p>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="relative">
                    <th className="sr-only" scope="col">
                      Feature
                    </th>
                    <th className="sr-only" scope="col">
                      Included
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="border-t border-gray-200">
                    <th
                      className="py-5 px-4 text-left text-base font-medium text-gray-900"
                      scope="row"
                    >
                      Video quality
                    </th>
                    <td className="py-5 pr-4">
                      <span className="block text-right text-base font-bold text-gray-700 group-hover:text-netflix-red">
                        Good
                      </span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="py-5 px-4 text-left text-base font-medium text-gray-900"
                      scope="row"
                    >
                      Resolution
                    </th>
                    <td className="py-5 pr-4">
                      <span className="block text-right text-base font-bold text-gray-700 group-hover:text-netflix-red">
                        480p
                      </span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="py-5 px-4 text-left text-base font-medium text-gray-900"
                      scope="row"
                    >
                      Watch on your TV, computer, mobile phone and tablet
                    </th>
                    <td className="py-5 pr-4">
                      <svg
                        className="ml-auto h-7 w-7 text-gray-700 group-hover:text-netflix-red"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">Included in Basic</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="border-t border-gray-200 px-4 pt-5">
                <a
                  href="#"
                  className="block w-full rounded-sm border border-netflix-red bg-netflix-red py-3 text-center text-base font-medium tracking-wider text-white hover:bg-netflix-red-light"
                >
                  Get Basic
                </a>
              </div>
            </section>

            <section className="group">
              <div className="mb-8 px-4">
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                  Standard
                </h2>
                <p className="mt-4">
                  <span className="text-base font-bold text-gray-900 group-hover:text-netflix-red">
                    $13.99
                  </span>
                </p>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="relative">
                    <th className="sr-only" scope="col">
                      Feature
                    </th>
                    <th className="sr-only" scope="col">
                      Included
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="border-t border-gray-200">
                    <th
                      className="py-5 px-4 text-left text-base font-medium text-gray-900"
                      scope="row"
                    >
                      Video quality
                    </th>
                    <td className="py-5 pr-4">
                      <span className="block text-right text-base font-bold text-gray-700 group-hover:text-netflix-red">
                        Better
                      </span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="py-5 px-4 text-left text-base font-medium text-gray-900"
                      scope="row"
                    >
                      Resolution
                    </th>
                    <td className="py-5 pr-4">
                      <span className="block text-right text-base font-bold text-gray-700 group-hover:text-netflix-red">
                        1080p
                      </span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="py-5 px-4 text-left text-base font-medium text-gray-900"
                      scope="row"
                    >
                      Watch on your TV, computer, mobile phone and tablet
                    </th>
                    <td className="py-5 pr-4">
                      <svg
                        className="ml-auto h-7 w-7 text-gray-700 group-hover:text-netflix-red"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">Included in Standard</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="border-t border-gray-200 px-4 pt-5">
                <a
                  href="#"
                  className="block w-full rounded-sm border border-netflix-red bg-netflix-red py-3 text-center text-base font-medium tracking-wider text-white hover:bg-netflix-red-light"
                >
                  Get Standard
                </a>
              </div>
            </section>

            <section className="group">
              <div className="mb-8 px-4">
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                  Premium
                </h2>
                <p className="mt-4">
                  <span className="text-base font-bold text-gray-900 group-hover:text-netflix-red">
                    $17.99
                  </span>
                </p>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="relative">
                    <th className="sr-only" scope="col">
                      Feature
                    </th>
                    <th className="sr-only" scope="col">
                      Included
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="border-t border-gray-200">
                    <th
                      className="py-5 px-4 text-left text-base font-medium text-gray-900"
                      scope="row"
                    >
                      Video quality
                    </th>
                    <td className="py-5 pr-4">
                      <span className="block text-right text-base font-bold text-gray-700 group-hover:text-netflix-red">
                        Best
                      </span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="py-5 px-4 text-left text-base font-medium text-gray-900"
                      scope="row"
                    >
                      Resolution
                    </th>
                    <td className="py-5 pr-4">
                      <span className="block text-right text-base font-bold text-gray-700 group-hover:text-netflix-red">
                        4K+HDR
                      </span>
                    </td>
                  </tr>

                  <tr className="border-t border-gray-200">
                    <th
                      className="py-5 px-4 text-left text-base font-medium text-gray-900"
                      scope="row"
                    >
                      Watch on your TV, computer, mobile phone and tablet
                    </th>
                    <td className="py-5 pr-4">
                      <svg
                        className="ml-auto h-7 w-7 text-gray-700 group-hover:text-netflix-red"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">Included in Premium</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="border-t border-gray-200 px-4 pt-5">
                <a
                  href="#"
                  className="block w-full rounded-sm border border-netflix-red bg-netflix-red py-3 text-center text-base font-medium tracking-wider text-white hover:bg-netflix-red-light"
                >
                  Get Premium
                </a>
              </div>
            </section>
          </div>

          {/* Desktop */}
          <div className="hidden sm:block lg:-mx-5">
            <table className="plans h-px w-full table-fixed">
              <caption className="sr-only">Pricing plan comparison</caption>
              <thead>
                <tr className="relative">
                  <th
                    className="px-6 pb-4 text-left text-base font-medium text-gray-900"
                    scope="col"
                  >
                    <span className="sr-only">Plans</span>
                  </th>
                  {stripeSubscriptionPlans
                    .sort((a, b) => a.unit_amount - b.unit_amount)
                    .map((plan, idx) => (
                      <th
                        key={idx}
                        onClick={(e) =>
                          selectPlan(
                            e,
                            plan.id,
                            plan.product.name,
                            plan.unit_amount
                          )
                        }
                        className="w-full px-6 pb-4 text-center text-lg font-medium leading-6 sm:w-1/5"
                        scope="col"
                      >
                        <label
                          className={`relative mx-auto flex h-32 w-32 cursor-pointer select-none items-center  justify-center rounded-sm px-6 py-4 focus:outline-none ${
                            getStrapiSubscriptionPlanId(plan.id) === formData.id
                              ? "selected-plan-label bg-netflix-red"
                              : "bg-netflix-red bg-opacity-60"
                          }`}
                        >
                          <input
                            type="radio"
                            name="plans"
                            value={plan.product.name}
                            className="sr-only"
                            aria-labelledby={`plans-${idx}-label`}
                            aria-describedby={`plans-${idx}-description-0 plans-${idx}-description-1`}
                          />
                          <div className="flex items-center">
                            <div className="text-base">
                              <p
                                id={`plans-${idx}-label`}
                                className="font-bold text-white"
                              >
                                {plan.product.name}
                              </p>
                            </div>
                          </div>
                          <div
                            className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent"
                            aria-hidden="true"
                          ></div>
                        </label>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="relative">
                  <th
                    className="w-full py-8 px-6 text-left text-base font-medium text-gray-900"
                    scope="row"
                  >
                    Monthly price
                  </th>
                  {stripeSubscriptionPlans
                    .sort((a, b) => a.unit_amount - b.unit_amount)
                    .map((plan, idx) => (
                      <td
                        key={idx}
                        onClick={(e) =>
                          selectPlan(
                            e,
                            plan.id,
                            plan.product.name,
                            plan.unit_amount
                          )
                        }
                        className="h-full py-8 px-6"
                      >
                        <div className="relative mx-auto table h-full">
                          <p>
                            <span
                              className={`text-base font-bold ${
                                getStrapiSubscriptionPlanId(plan.id) ===
                                formData.id
                                  ? "selected-plan"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatPrice(plan.unit_amount)}
                            </span>
                          </p>
                        </div>
                      </td>
                    ))}
                </tr>

                <tr className="relative">
                  <th
                    className="py-5 px-6 text-left text-base font-medium text-gray-900"
                    scope="row"
                  >
                    Video quality
                  </th>

                  {stripeSubscriptionPlans
                    .sort((a, b) => a.unit_amount - b.unit_amount)
                    .map((plan, idx) => (
                      <td
                        key={idx}
                        onClick={(e) =>
                          selectPlan(
                            e,
                            plan.id,
                            plan.product.name,
                            plan.unit_amount
                          )
                        }
                        className="py-5 px-6 text-center"
                      >
                        <span
                          className={`block text-base font-bold ${
                            getStrapiSubscriptionPlanId(plan.id) === formData.id
                              ? "selected-plan"
                              : "text-gray-500"
                          }`}
                        >
                          {plan.product.metadata.video_quality}
                        </span>
                      </td>
                    ))}
                </tr>

                <tr className="relative">
                  <th
                    className="py-5 px-6 text-left text-base font-medium text-gray-900"
                    scope="row"
                  >
                    Resolution
                  </th>

                  {stripeSubscriptionPlans
                    .sort((a, b) => a.unit_amount - b.unit_amount)
                    .map((plan, idx) => (
                      <td
                        key={idx}
                        onClick={(e) =>
                          selectPlan(
                            e,
                            plan.id,
                            plan.product.name,
                            plan.unit_amount
                          )
                        }
                        className="py-5 px-6 text-center"
                      >
                        <span
                          className={`block text-base font-bold ${
                            getStrapiSubscriptionPlanId(plan.id) === formData.id
                              ? "selected-plan"
                              : "text-gray-500"
                          }`}
                        >
                          {plan.product.metadata.resolution}
                        </span>
                      </td>
                    ))}
                </tr>

                <tr className="relative">
                  <th
                    className="py-5 px-6 text-left text-base font-medium text-gray-900"
                    scope="row"
                  >
                    Watch on your TV, computer, mobile phone and tablet
                  </th>

                  {stripeSubscriptionPlans
                    .sort((a, b) => a.unit_amount - b.unit_amount)
                    .map((plan, idx) => (
                      <td
                        key={idx}
                        onClick={(e) =>
                          selectPlan(
                            e,
                            plan.id,
                            plan.product.name,
                            plan.unit_amount
                          )
                        }
                        className="py-5 px-6"
                      >
                        <svg
                          className={`mx-auto h-7 w-7 ${
                            getStrapiSubscriptionPlanId(plan.id) === formData.id
                              ? "selected-plan"
                              : "text-gray-500"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="sr-only">{`Included in ${plan.product.name}`}</span>
                      </td>
                    ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-10 w-full px-6 sm:w-5/6 lg:-mx-5">
            <span className="block w-full text-sm leading-snug text-gray-500">
              HD (720p), Full HD (1080p), Ultra HD (4K) and HDR availability
              subject to your internet service and device capabilities. Not all
              content is available in all resolutions. See our Terms of Use for
              more details.
            </span>
            <span className="mt-4 block w-full text-sm leading-snug text-gray-500">
              Only people who live with you may use your account. Watch on 4
              different devices at the same time with Premium, 2 with Standard
              and 1 with Basic.
            </span>
          </div>
          <ChoosePlanForm
            formData={formData}
            setFormData={setFormData}
            registrationStepFour={registrationStepFour}
          />
        </div>
      </RegistrationLayout>
    </>
  );
};

export default ChoosePlan;

export const getServerSideProps = withSessionSsr(async ({ req, res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  // Get the `user` session if it exists and set a couple helper variables
  const user = req.session.user;
  const isLoggedIn = user?.isLoggedIn || false;
  const isRegistered = user?.registrationComplete || false;

  // Redirect authenticated and registered users to the browse page
  if (!isLoggedIn) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  // Initialize Stripe
  const stripe = new Stripe(process.env.STRIPE_SK, {
    apiVersion: "2020-08-27",
  });

  // Get available plans from Stripe
  const stripeSubscriptionPlans = await stripe.prices.list({
    active: true,
    expand: ["data.product"],
  });

  const strapiResponse = await axios.get(`${API_URL}/api/subscriptions`, {
    headers: {
      Authorization: `Bearer ${user?.strapiToken}`,
    },
  });

  // Get the subscription plan data json response
  const strapiSubscriptionPlans = await strapiResponse.data;

  let customer = null;

  // Add current user session token to Stripe
  if (!customer && user?.stripeCustomerId && isLoggedIn) {
    customer = await stripe.customers.update(user?.stripeCustomerId, {
      metadata: {
        token: user?.strapiToken,
      },
    });
  }

  // Set the default plan
  const defaultPlan =
    stripeSubscriptionPlans.data.find(
      (plan) => plan.product.name === "Premium"
    ) ?? "";

  // Redirect authenticated and registered users to the browse page
  if (isLoggedIn && isRegistered) {
    return {
      redirect: { destination: "/browse", permanent: false },
      props: { user, isLoggedIn, isRegistered },
    };
  }
  // Send props to the frontend
  return {
    props: {
      user,
      customer,
      isLoggedIn,
      isRegistered,
      strapiSubscriptionPlans,
      defaultPlan,
      selectedPlan: user?.plan?.id || null,
      stripeSubscriptionPlans: stripeSubscriptionPlans.data,
    },
  };
});

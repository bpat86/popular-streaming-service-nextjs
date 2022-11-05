import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useState } from "react";

import { NEXT_URL } from "@/config/index";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [formDataContext, setFormDataContext] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    plan: [],
    registrationStep: 0,
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  /**
   * Reset form errors on page load
   */
  const resetErrors = async () => {
    setError(null);
  };

  /**
   * Collect the user's email from the Get Started / Home page
   * @param {object} email
   */
  const getStarted = async (props) => {
    setLoading(true);

    // Destructure the user props
    const { email } = props;

    if (!user) {
      setLoading(false);
      setFormDataContext({
        email,
      });
      router.push("/signup");
    } else {
      setLoading(false);
      router.push("/signup");
    }
  };

  /**
   * Update the user's registration process.
   */
  const registrationStepOne = async () => {
    setLoading(true);

    if (!user) {
      setLoading(false);
      router.push("/signup/register");
    } else {
      setLoading(false);
      router.push("/signup/plans");
    }
  };

  /**
   * Register a user
   * @param {any} props
   */
  const registrationStepTwo = async (props) => {
    setLoading(true);

    try {
      // Destructure the user props
      const { email, password } = props;

      // Define the Strapi api url
      const registerUserUrl = `${NEXT_URL}/api/strapi/users/authRegister`;

      // Register the new user in Strapi
      const strapiResponse = await axios.post(registerUserUrl, {
        email,
        password,
        registrationStep: 2,
      });

      // Strapi JSON response
      const userData = await strapiResponse.data;

      // If successful, update the `user` state and redirect to the next step
      if (strapiResponse.status === 200) {
        setLoading(false);
        setUser(userData.user);
        setFormDataContext(userData.user);
        router.push("/signup/plans");
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a customer in Stripe and update the user's registration process.
   */
  const registrationStepThree = async (email) => {
    setLoading(true);

    try {
      // Define the Stripe api url
      const createCustomerUrl = `${NEXT_URL}/api/stripe/createCustomer`;

      // Create a customer in Stripe
      const stripeResponse = await axios.post(createCustomerUrl, {
        email,
      });

      // Stripe JSON response
      const customerData = await stripeResponse.data;

      // Define the API url
      const updateUserUrl = `${NEXT_URL}/api/strapi/users/updateUser`;

      // Update the user's / customer's data in Strapi
      const strapiResponse = await axios.put(updateUserUrl, {
        registrationStep: 3,
        stripeCustomerId: customerData.customer.id,
      });

      // Strapi JSON response
      const userData = await strapiResponse.data;

      // If successful, update the `user` state and redirect to the next step
      if (strapiResponse.status === 200) {
        setLoading(false);
        setUser(userData.user);
        setFormDataContext(userData.user);
        redirectUser(userData.user);
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   *
   * @param {any} props
   * @returns
   */

  const registrationStepFour = async (props) => {
    setLoading(true);

    try {
      // Destructure the plan id from the user props
      const { id } = props;

      // Define the API url
      const updateUserUrl = `${NEXT_URL}/api/strapi/users/updateUser`;

      // Send updated user registration data to Strapi
      const strapiResponse = await axios.put(updateUserUrl, {
        plan: id,
        registrationStep: 4,
      });

      // Strapi JSON response
      const userData = await strapiResponse.data;

      // If successful, update the `user` state and redirect to the next step
      if (strapiResponse.status === 200) {
        setLoading(false);
        setUser(userData.user);
        setFormDataContext(userData.user);
        redirectUser(userData.user);
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user information in Strapi and redirect to next step
   * @param {any} props
   */
  const registrationStepFive = async (props) => {
    setLoading(true);

    try {
      // Destructure the user props
      const { plan, customerId, subscriptionId } = props;

      // Define the API url
      const updateUserUrl = `${NEXT_URL}/api/strapi/users/updateUser`;

      // Send updated user registration data to Strapi
      const strapiResponse = await axios.put(updateUserUrl, {
        plan,
        customerId,
        subscriptionId,
        registrationStep: 5,
      });

      // Strapi JSON response
      const userData = await strapiResponse.data;
      await userData.user.order;
      if (strapiResponse.status === 200) {
        // If successful, update the `user` state and redirect to the next step
        setLoading(false);
        setUser(userData.user);
        setFormDataContext(userData.user);
        redirectUser(userData.user);
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user's information in Strapi, create customer in Stripe, Process user's payment information,
   * and subscribe them to their chosen subscription plan
   * @param {any} props
   */
  const registrationCompleted = async (props) => {
    setLoading(true);

    try {
      // Destructure the user parameters
      const { firstName, lastName } = props;

      // Define the API url
      const updateUserUrl = `${NEXT_URL}/api/strapi/users/updateUser`;

      // Send the updated user information to Strapi
      const updateUserResponse = await axios.put(updateUserUrl, {
        firstName,
        lastName,
        registrationStep: 6,
        registrationComplete: true,
      });

      // Get back the updated user
      const updateUserData = await updateUserResponse.data;

      // If successful, update the user in our state / context and then redirect the user
      if (updateUserResponse.status === 200) {
        setLoading(false);
        setUser(updateUserData.user);
        setFormDataContext(updateUserData.user);
        redirectUser(updateUserData.user);
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (props) => {
    const {
      email,
      plan,
      subscriptionId,
      customerId,
      currency,
      monthlyPrice,
      startDate,
      currentPeriodStart,
      currentPeriodEnd,
    } = props;

    const bodyParams = {
      email,
      plan,
      subscriptionId,
      customerId,
      currency,
      monthlyPrice,
      startDate,
      currentPeriodStart,
      currentPeriodEnd,
    };
    // Define the create order api url
    const createOrderUrl = `${NEXT_URL}/api/strapi/orders/createOrder`;

    // Create an `incomplete` order in Strapi
    const { data } = await axios.post(createOrderUrl, bodyParams);

    // Get back the user's / customer's order data
    return data;
  };

  /**
   *
   * Direct user to where they need to go
   * @param {object} user
   */
  const redirectUser = async (user = null) => {
    if (!user) {
      router.push("/");
      return;
    }

    if (user.registrationStep < 2) {
      router.push("/signup/plans");
      return;
    } else if (user.registrationStep === 2) {
      router.push("/signup/plans");
      return;
    } else if (user.registrationStep === 3) {
      router.push("/signup/choose-plan");
      return;
    } else if (user.registrationStep === 4) {
      router.push("/signup/payment");
      return;
    } else if (user.registrationStep === 5) {
      router.push("/signup/credit-option");
      return;
    } else if (user.registrationStep === 6) {
      router.push("/browse");
      return;
    }
  };

  /**
   * Login a user
   * @param {object} user
   */
  const login = async (props) => {
    setLoading(true);

    try {
      // Destructure the user props
      const { email: identifier, password } = props;

      // Define the API url
      const loginUrl = `${NEXT_URL}/api/strapi/users/authLogin`;

      // Send updated user registration data to Strapi
      const strapiResponse = await axios.post(loginUrl, {
        identifier,
        password,
      });

      // Strapi JSON response
      const userData = await strapiResponse.data;

      // If successful, login the user and redirect them to the authenticated home page
      if (strapiResponse.status === 200) {
        setLoading(false);
        setUser(userData.user);
        setFormDataContext(userData.user);
        redirectUser(userData.user);
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout a user
   */
  const logout = async () => {
    setLoading(true);

    try {
      // Define the API url
      const logoutUrl = `${NEXT_URL}/api/strapi/users/authLogout`;

      // Send updated user registration data to Strapi
      const strapiResponse = await axios.post(logoutUrl, {});

      // If successful, logout the user and redirect them to the home page
      if (strapiResponse.status === 200) {
        setLoading(false);
        setUser(null);
        router.push("/");
        // Remove active profile from session storage and force a page refresh
        window.sessionStorage.removeItem("activeProfile");
        window.location.reload();
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Persist the logged in user otherwise, set user to null
   */
  const isLoggedIn = async () => {
    setLoading(true);

    try {
      // Define the API url
      const isLoggedInUrl = `${NEXT_URL}/api/strapi/users/isLoggedIn`;
      const strapiResponse = await axios.get(isLoggedInUrl);
      const userData = await strapiResponse.data;

      if (strapiResponse.status === 200) {
        setLoading(false);
        // Define the form context
        const updatedFormDataContext = {
          email: userData.user.email,
          plan: userData.user.selectedPlan,
          registrationStep: userData.user.registrationStep,
        };
        // Update our form state / context
        setUser(userData.user);
        setFormDataContext(updatedFormDataContext);
      }
    } catch (error) {
      setLoading(false);
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        formDataContext,
        setFormDataContext,
        user,
        error,
        setError,
        resetErrors,
        redirectUser,
        getStarted,
        registrationStepOne,
        registrationStepTwo,
        registrationStepThree,
        registrationStepFour,
        registrationStepFive,
        registrationCompleted,
        login,
        logout,
        createOrder,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

import axios from "axios";
import { useRouter } from "next/router";
import { createContext, ReactNode, useState } from "react";

import { AuthContextType, IUser } from "@/@types/auth";
import { NEXT_URL } from "@/config/index";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formDataContext, setFormDataContext] = useState<object>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    plan: [],
    registrationStep: 0,
  });
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  /**
   * Reset form errors on page load
   */
  const resetErrors = async () => {
    setError(null);
  };

  /**
   * Collect the user's email from the Get Started / Home page

   */
  const getStarted = async ({ email }: IUser) => {
    setLoading(true);

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
  const registrationStepTwo = async ({ email, password }: IUser) => {
    setLoading(true);

    try {
      // Define the Strapi api url
      const registerUserUrl = `${NEXT_URL}/api/strapi/users/authRegister`;

      // Register the new user in Strapi
      const strapiResponse = await axios.post(registerUserUrl, {
        email,
        password,
        registrationStep: 2,
      });

      // Strapi JSON response
      const {
        data: { user },
      } = strapiResponse;

      // If successful, update the `user` state and redirect to the next step
      if (strapiResponse.status === 200) {
        setLoading(false);
        setUser(user);
        setFormDataContext(user);
        router.push("/signup/plans");
      }
    } catch (error: any) {
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
  const registrationStepThree = async ({ email }: IUser) => {
    setLoading(true);

    try {
      // Define the Stripe api url
      const createCustomerUrl = `${NEXT_URL}/api/stripe/createCustomer`;
      // Create a customer in Stripe
      const stripeResponse = await axios.post(createCustomerUrl, {
        email,
      });
      // Stripe JSON response
      const { customer } = stripeResponse.data;
      // Define the API url
      const updateUserUrl = `${NEXT_URL}/api/strapi/users/updateUser`;
      // Update the user's / customer's data in Strapi
      const strapiResponse = await axios.put(updateUserUrl, {
        registrationStep: 3,
        stripeCustomerId: customer.id,
      });
      // Strapi JSON response
      const { user } = await strapiResponse.data;
      // If successful, update the `user` state and redirect to the next step
      if (strapiResponse.status === 200) {
        setLoading(false);
        setUser(user);
        setFormDataContext(user);
        redirectUser(user);
      }
    } catch (error: any) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Redirect the user to the next step in the registration process
   */
  const registrationStepFour = async ({ id }: IUser) => {
    setLoading(true);
    try {
      // Define the API url
      const updateUserUrl = `${NEXT_URL}/api/strapi/users/updateUser`;
      // Send updated user registration data to Strapi
      const strapiResponse = await axios.put(updateUserUrl, {
        plan: id,
        registrationStep: 4,
      });
      // Strapi JSON response
      const { user } = await strapiResponse.data;
      // If successful, update the `user` state and redirect to the next step
      if (strapiResponse.status === 200) {
        setLoading(false);
        setUser(user);
        setFormDataContext(user);
        redirectUser(user);
      }
    } catch (error: any) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user information in Strapi and redirect to next step
   */
  const registrationStepFive = async ({
    plan,
    customerId,
    subscriptionId,
  }: IUser) => {
    setLoading(true);
    try {
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
      const { user } = await strapiResponse.data;
      await user.order;
      if (strapiResponse.status === 200) {
        // If successful, update the `user` state and redirect to the next step
        setLoading(false);
        setUser(user);
        setFormDataContext(user);
        redirectUser(user);
      }
    } catch (error: any) {
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
  const registrationCompleted = async ({ firstName, lastName }: IUser) => {
    setLoading(true);

    try {
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
      const { user } = await updateUserResponse.data;
      // If successful, update the user in our state / context and then redirect the user
      if (updateUserResponse.status === 200) {
        setLoading(false);
        setUser(user);
        setFormDataContext(user);
        redirectUser(user);
      }
    } catch (error: any) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async ({
    email,
    plan,
    subscriptionId,
    customerId,
    currency,
    monthlyPrice,
    startDate,
    currentPeriodStart,
    currentPeriodEnd,
  }: IUser) => {
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
   * Redirect the user to the next step in the registration Process
   */
  const redirectUser = async ({ registrationStep }: IUser) => {
    if (!registrationStep) return router.push("/");
    switch (registrationStep) {
      case 1: {
        return router.push("/signup/plans");
      }
      case 2: {
        return router.push("/signup/plans");
      }
      case 3: {
        return router.push("/signup/choose-plan");
      }
      case 4: {
        return router.push("/signup/payment");
      }
      case 5: {
        return router.push("/signup/credit-option");
      }
      case 6: {
        return router.push("/browse");
      }
    }
  };

  /**
   * Login a user
   */
  const login = async ({ email, password }: IUser) => {
    setLoading(true);
    try {
      // Define the API url
      const loginUrl = `${NEXT_URL}/api/strapi/users/authLogin`;
      // Send updated user registration data to Strapi
      const strapiResponse = await axios.post(loginUrl, {
        identifier: email,
        password,
      });
      // Strapi JSON response
      const { user } = await strapiResponse.data;
      // If successful, login the user and redirect them to the authenticated home page
      if (strapiResponse.status === 200) {
        setLoading(false);
        setUser(user);
        setFormDataContext(user);
        redirectUser(user);
      }
    } catch (error: any) {
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
    } catch (error: any) {
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
      const { user } = await strapiResponse.data;
      if (strapiResponse.status === 200) {
        setLoading(false);
        // Define the form context
        const updatedFormDataContext = {
          email: user.email,
          plan: user.selectedPlan,
          registrationStep: user.registrationStep,
        };
        // Update our form state / context
        setUser(user);
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

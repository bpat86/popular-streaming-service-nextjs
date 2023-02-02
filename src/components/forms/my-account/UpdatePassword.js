import axios from "axios";
import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import * as yup from "yup";

import InputLight from "@/components/fields/InputLight";
import { NEXT_URL } from "@/config/index";
import AuthContext from "@/context/AuthContext";

const validationSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be 6 characters minimum")
    .notOneOf(
      [yup.ref("currentPassword"), null],
      "New password must be different"
    ),
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const UpdatePassword = (props) => {
  const { initialValue, mutateUser } = props;
  const { setUser, setFormDataContext } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    currentPassword: initialValue || "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  /**
   * Register a user
   * @param {any} props
   */
  const updatePassword = async (values, actions) => {
    setLoading(true);
    setFormData(values);

    try {
      // Destructure the user parameters
      const { user, newPassword } = values;
      const { setStatus } = actions;

      // Define the API url
      const updateUserUrl = `${NEXT_URL}/api/strapi/users/updateUser`;

      // Send the updated user information to Strapi
      const updateAccountPasswordResponse = await axios.put(updateUserUrl, {
        ...user,
        password: newPassword,
      });

      // Get back the updated user
      const updateAccountPasswordData =
        await updateAccountPasswordResponse.data;

      // If successful, update the user in our state / context and then redirect the user
      if (updateAccountPasswordResponse.status === 200) {
        setLoading(false);
        setStatus({
          success: true,
          message: "Password updated successfully.",
        });
        mutateUser();
        setUser(updateAccountPasswordData.user);
        setFormDataContext(updateAccountPasswordData.user);
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error.response.data.message);
    }
  };

  return (
    <>
      {error && (
        <>
          <div className="mt-2 mb-3 w-full rounded-sm bg-netflix-orange-light p-3">
            <h3 className="text-base font-semibold leading-tight text-white">
              {error}
            </h3>
          </div>
        </>
      )}
      <Formik
        initialValues={formData}
        onSubmit={async (values, actions) => {
          await sleep(500);
          await updatePassword(values, actions);
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          status,
        }) => (
          <Form className="mb-3 w-full">
            <div className="relative mb-6 w-full sm:max-w-md">
              <InputLight
                autoComplete="current-password"
                type="password"
                id="currentPassword"
                name="currentPassword"
                maxLength="62"
                minLength="6"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.currentPassword}
                errors={errors.currentPassword}
                touched={touched.currentPassword}
                label="Current password"
              />
            </div>
            <div className="relative w-full sm:max-w-md">
              <InputLight
                autoComplete="new-password"
                type="password"
                id="newPassword"
                name="newPassword"
                maxLength="62"
                minLength="6"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.newPassword}
                errors={errors.newPassword}
                touched={touched.newPassword}
                label="New password"
              />
            </div>
            {/* Submit button */}
            <div className="mt-6 sm:flex sm:items-center sm:space-x-4 sm:space-x-reverse">
              {status && status.success ? (
                <div className="order-1 -mt-3 mb-6 flex items-center space-x-2 text-base font-semibold text-zinc-800 sm:my-0">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-zinc-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>{status.message}</span>
                </div>
              ) : (
                <></>
              )}
              {loading || isSubmitting ? (
                <button
                  disabled
                  type="submit"
                  className="flex items-center rounded bg-red-800 bg-opacity-80 py-3 px-4 text-base font-semibold tracking-wide text-white transition duration-700 ease-out focus:outline-none"
                >
                  Processing
                  <svg
                    className="ml-2 -mr-1 h-5 w-5 text-white motion-safe:animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </button>
              ) : (
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="flex items-center rounded bg-netflix-red py-3 px-4 text-base font-semibold tracking-wide text-white transition duration-700 ease-out hover:bg-netflix-red-light focus:outline-none"
                >
                  Update password
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

UpdatePassword.propTypes = {
  formData: PropTypes.object,
  setFormData: PropTypes.func,
};

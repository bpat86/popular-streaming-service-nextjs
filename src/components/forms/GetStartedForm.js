import { Form, Formik } from "formik";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useContext } from "react";
import * as yup from "yup";

import AuthContext from "@/context/AuthContext";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export const GetStartedForm = (props) => {
  // Destructure the props
  const { formData, setFormData } = props;
  const { getStarted } = useContext(AuthContext);

  // Set a cookie with the value of email
  const setCookie = (email) => {
    Cookies.set("email", email);
  };

  return (
    <>
      <Formik
        initialValues={formData}
        onSubmit={async (values) => {
          await sleep(250);
          setFormData(values);
          setCookie(values.email);
          getStarted(values);
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
        }) => (
          <Form className="mt-8 h-20 sm:flex">
            <div className="get-started-input relative w-full focus-within:border-transparent">
              <input
                aria-invalid={
                  errors.email && touched.email && errors.email
                    ? "true"
                    : "false"
                }
                autoComplete="email"
                autoCapitalize="off"
                autoCorrect="off"
                tabIndex="0"
                id="email"
                name="email"
                type="email"
                placeholder=" "
                maxLength="50"
                minLength="5"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                className={`input-light block h-18 w-full appearance-none rounded-sm border-0 border-transparent bg-white px-3 pt-6 text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:rounded-r-none sm:rounded-l-sm sm:text-base ${
                  errors.email && touched.email && errors.email
                    ? "border-b-2 border-netflix-orange-light focus:border-netflix-orange-light"
                    : ""
                }`}
              />
              <label
                htmlFor="email"
                className="pointer-events-none absolute top-0 bottom-0 flex h-18 origin-0 select-none items-center px-3 py-4 text-base font-medium text-gray-500 duration-200"
              >
                Email
              </label>
              {errors.email && touched.email && errors.email && (
                <div className="input-error mt-1 px-1 text-left text-sm font-medium text-netflix-orange-light">
                  {errors.email}
                </div>
              )}
            </div>
            {/* Submit button */}
            <div className="mt-3 rounded-sm shadow sm:mt-0 sm:flex-shrink-0">
              <button
                disabled={isSubmitting}
                type="submit"
                className={`duration-400 mx-auto mt-5 flex h-12 items-center justify-center rounded-sm px-5 py-2 text-2xl font-semibold tracking-wide text-white transition ease-out focus:outline-none sm:mt-0 sm:h-18 sm:w-64 sm:rounded-l-none sm:rounded-r-sm sm:py-4 ${
                  isSubmitting
                    ? "bg-red-800 bg-opacity-80"
                    : "bg-netflix-red hover:bg-netflix-red-light focus:bg-red-700 focus:ring-2 focus:ring-inset focus:ring-red-900"
                }`}
              >
                {isSubmitting ? (
                  <>
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
                  </>
                ) : (
                  <>
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 h-5 w-5 sm:h-7 sm:w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

GetStartedForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};

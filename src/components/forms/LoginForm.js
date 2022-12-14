import { Form, Formik } from "formik";
import Link from "next/link";
import PropTypes from "prop-types";
import * as yup from "yup";

import InputDark from "@/components/fields/InputDark";

const validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const LoginForm = (props) => {
  const { loading, formData, setFormData, login, strapiError } = props;
  return (
    <>
      <Formik
        initialValues={formData}
        onSubmit={async (values) => {
          setFormData(values);
          login(values);
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
          <Form className="space-y-5">
            {strapiError && (
              <>
                <div className="my-2 mb-6 rounded-sm bg-netflix-orange p-3">
                  <h3 className="text-base font-semibold leading-tight text-white">
                    {strapiError}
                  </h3>
                </div>
              </>
            )}
            {/* Email */}
            <InputDark
              autoComplete="email"
              type="email"
              id="email"
              name="email"
              maxLength="50"
              minLength="5"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.email}
              errors={errors.email}
              touched={touched.email}
              label="Email"
            />
            {/* Password */}
            <InputDark
              autoComplete="password"
              type="password"
              id="password"
              name="password"
              maxLength="50"
              minLength="5"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.password}
              errors={errors.password}
              touched={touched.password}
              label="Password"
            />
            {/* Submit */}
            <div>
              {loading || isSubmitting ? (
                <button
                  disabled
                  type="submit"
                  className="mt-6 flex h-14 w-full items-center justify-center rounded-sm bg-red-800 bg-opacity-80 py-3 px-4 text-base font-semibold tracking-wide text-white transition duration-700 ease-out focus:outline-none"
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
                  className="mt-6 flex h-14 w-full items-center justify-center rounded-sm bg-netflix-red py-3 px-4 text-base font-semibold tracking-wide text-white transition duration-700 ease-out hover:bg-netflix-red-light focus:outline-none"
                >
                  Sign In
                </button>
              )}
            </div>
            <div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 rounded-sm border-gray-400 bg-gray-400 text-gray-600 focus:outline-none focus:ring-0"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm font-medium text-gray-500"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/">
                    <a className="font-medium text-gray-500 hover:underline focus:outline-none">
                      Need Help?
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

LoginForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};

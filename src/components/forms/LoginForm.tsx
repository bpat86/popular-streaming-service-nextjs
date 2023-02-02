import { Form, Formik } from "formik";
import Link from "next/link";
import { ChangeEvent, FocusEvent } from "react";
import * as yup from "yup";

import { AuthContextType, IUser } from "@/@types/auth";
import InputDark from "@/components/fields/InputDark";

const validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormProps = {
  loading: boolean;
  formData: object;
  setFormData: (formData: object) => void;
  login: AuthContextType["login"];
  strapiError: AuthContextType["error"];
};

type FormikProps = {
  values: Partial<IUser>;
  errors: Partial<IUser>;
  touched: Partial<IUser>;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
};

const LoginForm = ({
  loading,
  formData,
  setFormData,
  login,
  strapiError,
}: LoginFormProps) => {
  return (
    <>
      <Formik
        initialValues={formData}
        onSubmit={async (values) => {
          if (!values) return;
          setFormData(values);
          login(values as IUser);
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
        }: FormikProps) => (
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
              maxLength={50}
              minLength={5}
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
              maxLength={50}
              minLength={5}
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
                    className="h-4 w-4 rounded-sm border-zinc-400 bg-zinc-400 text-zinc-600 focus:outline-none focus:ring-0"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm font-medium text-zinc-500"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/" legacyBehavior>
                    <a className="font-medium text-zinc-500 hover:underline focus:outline-none">
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

export default LoginForm;

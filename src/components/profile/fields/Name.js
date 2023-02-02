const InputDark = ({
  strapiError,
  errors,
  touched,
  value,
  type,
  id,
  name,
  autoComplete = "none",
  tabIndex = 0,
  minLength = 1,
  maxLength = 24,
  placeholder,
  handleChange,
  handleBlur,
}) => {
  return (
    <>
      <div className="mt-2 flex h-12 w-full flex-col justify-start sm:h-14">
        <div className="profile-input relative focus-within:border-transparent">
          <input
            aria-invalid={
              (errors && touched && errors) || strapiError ? "true" : "false"
            }
            autoComplete={autoComplete}
            tabIndex={tabIndex}
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            minLength={minLength}
            onChange={handleChange}
            onBlur={handleBlur}
            value={value}
            className="input-profile block h-10 w-full appearance-none rounded-sm border-0 bg-zinc-500 px-3 text-lg tracking-wider placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500 sm:h-12 sm:text-xl"
          />
          {errors && touched && errors && (
            <div className="input-error mt-1 px-1 text-left text-sm font-medium text-netflix-red-light">
              {errors && touched && errors}
            </div>
          )}
          {strapiError && (
            <div className="input-error mt-1 px-1 text-left text-sm font-medium text-netflix-red-light">
              {strapiError}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InputDark;

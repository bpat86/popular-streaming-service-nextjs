const InputLight = ({
  errors,
  touched,
  value,
  type,
  id,
  name,
  label,
  autoComplete = "none",
  tabIndex = 0,
  minLength = 1,
  maxLength = 100,
  classes,
  handleChange,
  handleBlur,
}) => {
  return (
    <>
      <div className="flex flex-col justify-start w-full h-18">
        <div className="auth-focus-input relative focus-within:border-transparent">
          <input
            aria-invalid={errors && touched && errors ? "true" : "false"}
            autoComplete={autoComplete}
            tabIndex={tabIndex}
            type={type}
            id={id}
            name={name}
            placeholder=" "
            maxLength={maxLength}
            minLength={minLength}
            onChange={handleChange}
            onBlur={handleBlur}
            value={value}
            className={`${
              classes
                ? classes
                : "input-light block w-full h-14 px-3 pt-6 appearance-none bg-white border border-gray-200 focus:border-gray-400 focus:ring-gray-400 focus:outline-none focus:ring-0 focus:ring-inset text-base text-gray-800 rounded-sm ease-out duration-150"
            } ${errors && touched && errors ? "border-netflix-red" : ""}`}
          />
          <label
            htmlFor={name}
            className="flex text-base font-normal text-gray-500 items-center absolute top-0 bottom-0 px-3 py-4 h-14 duration-200 origin-0 select-none pointer-events-none"
          >
            {label}
          </label>
          {errors && touched && errors && (
            <div className="input-error text-netflix-red text-xs font-normal tracking-wide mt-1 px-1">
              {errors && touched && errors}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InputLight;

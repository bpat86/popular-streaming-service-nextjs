import { useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

export const useMotionValueState = (initialValue) => {
  const value = useMotionValue(initialValue);
  const [valueState, setValueState] = useState(value.get());

  useEffect(() => value.onChange(setValueState)), [];

  return [valueState, value];
};

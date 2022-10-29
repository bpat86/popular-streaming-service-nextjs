import { useEffect, useState } from "react";

const getIsXl = () => window.innerWidth >= 1400;
const getIsLg = () => window.innerWidth >= 1100 && window.innerWidth <= 1399;
const getIsMd = () => window.innerWidth >= 800 && window.innerWidth <= 1099;
const getIsSm = () => window.innerWidth >= 500 && window.innerWidth <= 799;

export default function useWindowResize() {
  const [isXl, setIsXl] = useState(getIsXl());
  const [isLg, setIsLg] = useState(getIsLg());
  const [isMd, setIsMd] = useState(getIsMd());
  const [isSm, setIsSm] = useState(getIsSm());

  useEffect(() => {
    const onResize = () => {
      setIsXl(getIsXl());
      setIsLg(getIsLg());
      setIsMd(getIsMd());
      setIsSm(getIsSm());
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return { isXl, isLg, isMd, isSm };
}

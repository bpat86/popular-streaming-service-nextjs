import Image from "next/image";
import { useContext } from "react";

import ProfileContext from "@/context/ProfileContext";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";

const spinnerSrc =
  "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI2LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA2MyA2MyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjMgNjM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRTUwOTE0O30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyLjYsMTJjLTMuMS0xLjctNi43LTIuNy0xMC4yLTIuOGMtMy43LTAuMi03LjUsMC42LTExLDIuM2MtMC40LDAuMi0wLjgsMC40LTEuMiwwLjZMMjAsMTIuMQoJYy0wLjEsMC4xLTAuMywwLjItMC40LDAuMmMtMC4zLDAuMi0wLjYsMC4zLTAuOSwwLjVjLTAuMiwwLjItMC40LDAuMy0wLjYsMC40Yy0wLjYsMC40LTEuMSwwLjgtMS42LDEuM2MtMS43LDEuNC0yLjksMy0zLjksNC4zCgljLTIuMiwzLjItMy41LDctMy44LDEwLjdsMCwwLjVjMCwwLjgtMC4xLDEuNSwwLDIuM2MwLDAuMiwwLDAuMywwLDAuNWMwLDAuMywwLDAuNiwwLjEsMWwwLjIsMS42YzAsMC4yLDAsMC4zLDAuMSwwLjVsMC41LDIKCWwwLjUsMS40YzAuMSwwLjQsMC4zLDAuOCwwLjUsMS4xYzEuNCwzLjIsMy41LDYsNi4xLDguMmMyLjMsMS45LDUuMSwzLjQsOCw0LjNsMS41LDAuNGMwLjEsMCwwLjMsMC4xLDAuNCwwLjFsMC4yLDAKCWMwLjIsMCwwLjQsMC4xLDAuNywwLjFjMC40LDAuMSwwLjgsMC4xLDEuMywwLjJsMS45LDAuMWMwLjQsMCwwLjgsMCwxLjEsMGMwLjIsMCwwLjQsMCwwLjYsMGMyLjItMC4yLDQuMi0wLjYsNS43LTEuMgoJYzAuMSwwLDAuMi0wLjEsMC40LTAuMWMwLjItMC4xLDAuNS0wLjIsMC43LTAuM2wxLjctMC44bDEuNy0xYzAuMy0wLjIsMC41LTAuNiwwLjMtMWMtMC4yLTAuMy0wLjYtMC41LTEtMC4zbC0xLjcsMC45bC0xLjcsMC43CgljLTAuMiwwLjEtMC40LDAuMS0wLjYsMC4yYy0wLjEsMC0wLjMsMC4xLTAuNCwwLjFjLTEuNCwwLjUtMy4zLDAuOC01LjMsMC45Yy0wLjIsMC0wLjQsMC0wLjYsMGMtMC4zLDAtMC43LDAtMSwwbC0xLjctMC4yCgljLTAuNC0wLjEtMC43LTAuMS0xLjEtMC4yYy0wLjItMC4xLTAuNC0wLjEtMC43LTAuMWwtMC4yLDBjLTAuMSwwLTAuMiwwLTAuMiwwbC0xLjQtMC40Yy0yLjYtMC45LTUtMi4zLTcuMS00LjEKCWMtMi4yLTItNC00LjUtNS4xLTcuNEMxMiwzNi42LDExLjYsMzMuMywxMiwzMGMwLjMtMywxLjQtNS44LDMuMi04LjVjMC4xLTAuMiwwLjItMC4zLDAuMy0wLjVjMC45LTEuMiwyLTIuNSwzLjQtMy41CgljMC40LTAuMywwLjgtMC42LDEuMy0wLjljMC4yLTAuMSwwLjQtMC4zLDAuNi0wLjRjMC4yLTAuMSwwLjQtMC4yLDAuNi0wLjRjMC4xLTAuMSwwLjMtMC4yLDAuNC0wLjJsMC4yLTAuMQoJYzAuMy0wLjIsMC42LTAuMywwLjktMC40bDEuMS0wLjVjMC4yLTAuMSwwLjUtMC4yLDAuNy0wLjJjMC4yLDAsMC4zLTAuMSwwLjUtMC4xYzAuNS0wLjIsMS4xLTAuMywxLjYtMC40YzAuMiwwLDAuNC0wLjEsMC43LTAuMQoJYzAuMiwwLDAuNC0wLjEsMC42LTAuMWMwLjIsMCwwLjMsMCwwLjQsMGMwLjIsMCwwLjMsMCwwLjUsMGMwLjIsMCwwLjUtMC4xLDAuNy0wLjFjMC4zLDAsMC42LDAsMC44LDBjMC41LDAsMSwwLDEuNSwwLjEKCWMyLjksMC4yLDUuNywxLjEsOC4yLDIuNmMyLjEsMS4zLDQuMSwzLjEsNS42LDUuMmMxLjMsMS44LDIuMiwzLjgsMi43LDUuOGMwLjEsMC4zLDAuMSwwLjYsMC4yLDAuOGMwLDAuMiwwLjEsMC4zLDAuMSwwLjUKCWMwLDAuMSwwLDAuMiwwLjEsMC4zYzAsMC4xLDAuMSwwLjIsMC4xLDAuM2wwLjEsMC42YzAsMC4yLDAsMC4zLDAuMSwwLjVjMCwwLjIsMC4xLDAuNSwwLjEsMC43bDAsMS4xYzAsMC40LDAsMC44LTAuMSwxLjIKCWMwLDAuMiwwLDAuNCwwLDAuNWMwLDAuMSwwLDAuMiwwLDAuM2MwLDAuMSwwLDAuMiwwLDAuNGwtMC40LDIuMWMtMC4yLDEuNiwwLjgsMywyLjQsMy4zYzEuMSwwLjIsMi4yLTAuMywyLjgtMS4yCgljMC4yLTAuMywwLjQtMC43LDAuNS0xLjJsMC4zLTEuOWMwLTAuMiwwLjEtMC40LDAuMS0wLjdsMC0wLjNjMC0wLjIsMC0wLjQsMC0wLjZjMC0wLjYsMC4xLTEuMiwwLTEuOWwtMC4xLTEuNGMwLTAuMy0wLjEtMC43LTAuMS0xCgljMC0wLjItMC4xLTAuMy0wLjEtMC41bC0wLjEtMC44YzAtMC4yLTAuMS0wLjQtMC4xLTAuNmwtMC4xLTAuM2MwLTAuMi0wLjEtMC40LTAuMS0wLjVjLTAuMS0wLjQtMC4yLTAuOC0wLjMtMS4yCgljLTAuOC0yLjUtMi4xLTUtMy44LTcuM0M0Ny45LDE1LjcsNDUuMywxMy41LDQyLjYsMTJ6Ii8+Cjwvc3ZnPgo=";

const LoadingSpinner = (): JSX.Element => {
  const { activeProfile } = useContext(ProfileContext);
  return (
    <MotionDivWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex w-full items-center justify-center overflow-hidden"
    >
      {activeProfile ? (
        <>
          <div
            className="profile-avatar absolute z-10 h-12 w-12 rounded-md bg-cover"
            style={{
              backgroundImage: `url("/images/profiles/avatars/${activeProfile.attributes.avatar}.png")`,
            }}
          />
          <div className="absolute h-[10.5rem] w-[10.5rem] fill-netflix-red text-netflix-red motion-safe:animate-spin">
            <Image fill src={spinnerSrc} alt="Loading spinner" />
          </div>
        </>
      ) : (
        <div className="absolute h-24 w-24 fill-netflix-red text-netflix-red motion-safe:animate-spin">
          <Image fill src={spinnerSrc} alt="Loading spinner" />
        </div>
      )}
    </MotionDivWrapper>
  );
};

export default LoadingSpinner;

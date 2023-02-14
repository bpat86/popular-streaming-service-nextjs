import {
  KeyboardEvent,
  MouseEvent,
  MutableRefObject,
  ReactNode,
  useRef,
} from "react";

import UnstyledLink from "@/components/ui/links/UnstyledLink";

type TitleCardLinkProps = {
  children: ReactNode;
  className?: string;
  itemTabbable?: boolean;
  onClick: (
    e: MouseEvent<HTMLAnchorElement> | KeyboardEvent<HTMLAnchorElement>,
    ref: MutableRefObject<HTMLAnchorElement>
  ) => void;
  onFocus: () => void;
  watchURL: string;
};

const TitleCardLink = ({
  children,
  className = "",
  itemTabbable,
  onClick,
  watchURL,
  onFocus,
}: TitleCardLinkProps) => {
  const watchLinkAnchorRef = useRef<HTMLAnchorElement | null>(null);
  return (
    <UnstyledLink
      ref={watchLinkAnchorRef}
      className={className}
      tabIndex={itemTabbable ? 0 : -1}
      aria-hidden={itemTabbable ? false : true}
      onClick={(e) =>
        onClick(e, watchLinkAnchorRef as MutableRefObject<HTMLAnchorElement>)
      }
      onFocus={onFocus}
      href={watchURL}
    >
      {children}
    </UnstyledLink>
  );
};

export default TitleCardLink;

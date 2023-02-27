import { KeyboardEvent, MouseEvent, ReactNode } from "react";

import UnstyledLink from "@/components/ui/links/UnstyledLink";

import EventStopper from "../EventStopper";

type TitleCardLinkProps = {
  children: ReactNode;
  className?: string;
  itemTabbable?: boolean;
  onClick: (
    e: MouseEvent<HTMLAnchorElement> | KeyboardEvent<HTMLAnchorElement>
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
  return (
    <EventStopper>
      <UnstyledLink
        className={className}
        tabIndex={itemTabbable ? 0 : -1}
        aria-hidden={itemTabbable ? false : true}
        onClick={onClick}
        onFocus={onFocus}
        href={watchURL}
      >
        {children}
      </UnstyledLink>
    </EventStopper>
  );
};

export default TitleCardLink;

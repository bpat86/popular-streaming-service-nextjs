import { forwardRef } from "react";
import Link from "next/link";

const TitleCardLink = forwardRef(
  ({ children, className, href, itemTabbable }, ref) => {
    return (
      <Link href={href}>
        <a
          ref={ref}
          className={className}
          tabIndex={itemTabbable ? "0" : "-1"}
          aria-hidden={`${itemTabbable ? false : true}`}
          role={"link"}
        >
          {children}
        </a>
      </Link>
    );
  }
);

TitleCardLink.displayName = "TitleCardLink";
export default TitleCardLink;

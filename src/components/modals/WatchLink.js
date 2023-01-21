import Link from "next/link";

export const WatchLink = ({
  children,
  className = undefined,
  href,
  onClick,
  tabIndex,
}) => {
  return (
    <Link href={href} legacyBehavior={true} prefetch={false}>
      <a
        className={className}
        onClick={onClick}
        tabIndex={tabIndex}
        role="link"
      >
        {children}
      </a>
    </Link>
  );
};

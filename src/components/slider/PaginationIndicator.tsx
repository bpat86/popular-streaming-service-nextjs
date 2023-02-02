import clsxm from "@/lib/clsxm";

type PaginationIndicatorProps = {
  activePage: number;
  totalPages: number;
};

const PaginationIndicator = ({
  activePage,
  totalPages,
}: PaginationIndicatorProps): JSX.Element => {
  // If there's only one page, don't show the dots
  if (!totalPages) return <></>;
  // Return a list of dots, one for each page
  return (
    <ul className="pagination-indicator">
      {Array.from(Array(totalPages), (_z, i) => {
        return (
          <li key={i} className={clsxm([activePage === i ? "active" : ""])} />
        );
      })}
    </ul>
  );
};

export default PaginationIndicator;

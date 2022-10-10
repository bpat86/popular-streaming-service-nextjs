const PaginationIndicator = ({ activePage, totalPages }) => {
  return (
    <ul className="pagination-indicator">
      {Array.from(Array(totalPages), (e, i) => (
        <li key={i} className={activePage === i ? "active" : ""}></li>
      ))}
    </ul>
  );
};

export default PaginationIndicator;

const Synopsis = ({ synopsis }) => {
  function extractFirstSentence(str) {
    return str.substring(0, str.indexOf("."));
  }

  return (
    <div className="synopsis">
      {synopsis?.length > 0
        ? `${extractFirstSentence(synopsis)}.`
        : "No synopsis available."}
    </div>
  );
};

export default Synopsis;

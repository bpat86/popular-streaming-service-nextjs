const Synopsis = ({ synopsis }) => {
  function extractFirstSentence(str) {
    return str.substring(0, str.indexOf("."));
    /* This gets a substring from the beginning of the string 
      to the first index of the character ".".
   */
  }

  return (
    <div className="text-xl text-white">
      {synopsis?.length > 0
        ? `${extractFirstSentence(synopsis)}.`
        : "No synopsis available."}
    </div>
  );
};

export default Synopsis;

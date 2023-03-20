import { IVideoModel } from "@/store/types";

type SynopsisProps = {
  synopsis: IVideoModel["synopsis"];
};

export default function Synopsis({ synopsis }: SynopsisProps) {
  function extractFirstSentence(str: SynopsisProps["synopsis"]) {
    if (!str) return "";
    return str.substring(0, str.indexOf("."));
  }

  if (!synopsis) return <></>;
  return (
    <div className="synopsis">
      {synopsis.length > 0
        ? `${extractFirstSentence(synopsis)}.`
        : "No synopsis available."}
    </div>
  );
}

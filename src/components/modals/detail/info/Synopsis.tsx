import { IVideoModel } from "@/store/types";

type SynopsisProps = {
  synopsis: IVideoModel["overview"];
};

const extractFirstSentence = (str: string) => {
  return str.substring(0, str.indexOf("."));
};

const Synopsis = ({ synopsis = "" }: SynopsisProps) => {
  if (!synopsis) return <></>;
  return (
    <div className="text-xl text-white">
      {synopsis.length > 0
        ? `${extractFirstSentence(synopsis)}.`
        : "No synopsis available."}
    </div>
  );
};

export default Synopsis;

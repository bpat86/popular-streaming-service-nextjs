import axios from "axios";

export const getFetch = async (...args) => {
  const res = await axios.get(...args);
  return res;
};

export default getFetch;

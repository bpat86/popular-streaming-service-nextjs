import axios from "axios";

export const getFetch = (...args) => {
  return axios.get(...args);
};

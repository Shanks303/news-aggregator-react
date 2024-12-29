import moment from "moment";

export const header = (category) => `News - Top ${category} Headlines`;
export const summary = "More Info";
export const newsChannel = (channel) => `${channel}`;
export const lastUpdate = (published) =>
  `${moment(published).format("ddd, DD MMM YYYY HH:mm:ss")}`;
export const noResultFound = "No Results Found";

export const sources = [
  {
    name: "All Data Sources",
    key: "all",
  },
  {
    name: "News API",
    key: "news-api",
  },
  {
    name: "The Guardian API",
    key: "guardian-api",
  },
  {
    name: "New York Times API",
    key: "ny-times",
  }
];

export const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

export const capitaLize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
import { GraphQLClient } from "graphql-request";

const endpoint = process.env.REACT_APP_HYGRAPH_ENDPOINT || "";
const token = process.env.REACT_APP_HYGRAPH_TOKEN || "";

if (!endpoint) {
  console.error(
    "[Hygraph] REACT_APP_HYGRAPH_ENDPOINT is missing.\n" +
    "Create a .env file in the project root with:\n" +
    "  REACT_APP_HYGRAPH_ENDPOINT=https://...\n" +
    "  REACT_APP_HYGRAPH_TOKEN=...\n" +
    "Then restart the dev server (npm start)."
  );
}

if (!token) {
  console.warn("[Hygraph] REACT_APP_HYGRAPH_TOKEN is missing. Requests may fail due to missing authorization.");
}

const hygraphClient = new GraphQLClient(endpoint || "https://placeholder.invalid", {
  headers: {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

export default hygraphClient;
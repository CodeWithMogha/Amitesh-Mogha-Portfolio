import { gql } from "graphql-request";
import hygraphClient from "./hygraphClient";
import { Recommendation } from "../types";

export const getRecommendations = async (): Promise<Recommendation[]> => {
    const query = gql`
    query GetRecommendations {
      recommendations(stage: PUBLISHED) {
        name
        designation
        organization
        message
        linkedin
        link
        photo {
          url
        }
      }
    }
  `;

    try {
        const data = await hygraphClient.request<{ recommendations: Recommendation[] }>(query);
        return data.recommendations;
    } catch (error) {
        console.error("Error fetching recommendations details:", error);
        return [];
    }
};

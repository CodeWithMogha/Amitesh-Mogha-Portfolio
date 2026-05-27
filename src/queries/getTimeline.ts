import hygraphClient from './hygraphClient';

const QUERY = `
  query {
    experiences(stage: PUBLISHED, orderBy: order_ASC) {
      title
      yearRange
      description{
      text
      }
      order
    }
  }
`;

export async function getTimeline() {
  try {
    const data = await hygraphClient.request<{
      experiences: {
        title: string;
        yearRange: string;
        description: {
          text: string;
        };
        order: number;
      }[];
    }>(QUERY);

    return data.experiences ?? [];
  } catch (error) {
    console.error("[Hygraph] getTimeline failed:", error);
    return [];
  }
}
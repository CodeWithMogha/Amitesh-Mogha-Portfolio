import hygraphClient from './hygraphClient';

export interface Experience {
  title: string;
  yearRange: string;
  description: {
    text: string;
  };
  order: number;
}

const GET_EXPERIENCE = `
  query {
    experiences(orderBy: order_ASC) {
      title
      yearRange
      description {
        text
      }
      order
    }
  }
`;

export async function getExperience(): Promise<Experience[]> {
  const data = await hygraphClient.request<{ experiences: Experience[] }>(
    GET_EXPERIENCE
  );

  return data.experiences ?? [];
}
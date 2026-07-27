import hygraphClient from "./hygraphClient";

export interface Learning {
  title: string;
  description: string;
  logo: {
    url: string;
  };
}

const GET_LEARNING = `
query GetLearning {
  learnings(stage: PUBLISHED) {
    title
    description
    logo {
      url
    }
  }
}
`;

export async function getLearning(): Promise<Learning[]> {
  try {
    const data = await hygraphClient.request<{ learnings: Learning[] }>(GET_LEARNING);
    return data.learnings;
  } catch (error) {
    console.error("Hygraph Learning Error:", error);
    return [];
  }
}

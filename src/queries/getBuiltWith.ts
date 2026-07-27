import hygraphClient from "./hygraphClient";

export interface BuiltWith {
  title: string;
  description: string;
  logo: {
    url: string;
  };
}

const GET_BUILT_WITH = `
query GetBuiltWith {
  buildS(stage: PUBLISHED) {
    title
    description
    logo {
      url
    }
  }
}
`;

export async function getBuiltWith(): Promise<BuiltWith[]> {
  try {
    const data = await hygraphClient.request<{ buildS: BuiltWith[] }>(GET_BUILT_WITH);
    return data.buildS;
  } catch (error) {
    console.error("Hygraph BuiltWith Error:", error);
    return [];
  }
}

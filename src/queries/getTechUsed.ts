import hygraphClient from "./hygraphClient";

export interface TechUsedItem {
  title: string;
  image: {
    url: string;
  } | null;
}

const GET_TECH_USED = `
query GetTechUsed {
  techUseds(stage: PUBLISHED, first: 100) {
    title
    image {
      url
    }
  }
}
`;

export async function getTechUsed(): Promise<TechUsedItem[]> {
  try {
    const data = await hygraphClient.request<{ techUseds: TechUsedItem[] }>(GET_TECH_USED);
    return data.techUseds || [];
  } catch (error) {
    console.error("Hygraph Tech Used Error:", error);
    return [];
  }
}

import hygraphClient from './hygraphClient';

export async function getSkills() {
  const QUERY = `
    query {
      skills(stage: PUBLISHED, orderBy: order_ASC, first: 100) {
        title
        category
        image {
          url
        }
      }
    }
  `;

  try {
    const data: any = await hygraphClient.request(QUERY);
    return data.skills ?? [];
  } catch (error) {
    console.error("[Hygraph] getSkills failed:", error);
    return [];
  }
}
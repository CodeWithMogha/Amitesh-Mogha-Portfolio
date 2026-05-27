import hygraphClient from './hygraphClient';

export async function getProfileBanner() {
  const query = `
    query {
      profileBanners {
        headline
        profileSummary
        resumeLink
        linkedinLink
      }
    }
  `

  try {
    const data: any = await hygraphClient.request(query);
    return data.profileBanners ? data.profileBanners[0] : null;
  } catch (error) {
    console.error("[Hygraph] getProfileBanner failed:", error);
    return null;
  }
}
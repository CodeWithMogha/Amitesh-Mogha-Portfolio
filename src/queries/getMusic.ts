import hygraphClient from './hygraphClient';

export interface Music {
  title: string;
  artist: string;
  order: number;
  coverPage?: {
    url: string;
  };
}

const GET_MUSIC = `
  query {
    musiccs(
      stage: PUBLISHED
      orderBy: order_ASC
    ) {
      title
      artist
      order
      coverPage {
        url
      }
    }
  }
`;

export async function getMusic(): Promise<Music[]> {
  const data = await hygraphClient.request<{ musiccs: Music[] }>(
    GET_MUSIC
  );

  return data.musiccs ?? [];
}
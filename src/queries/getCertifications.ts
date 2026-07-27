import hygraphClient from './hygraphClient';
import { Certification } from '../types';

const GET_CERTIFICATIONS = `
  query {
    certificates(
      stage: PUBLISHED
      orderBy: number_ASC
      first: 50
    ) {
      title
      issuer
      year
      category
      credentialUrl
      number
      logo {
        url
      }
    }
  }
`;

export async function getCertifications(): Promise<Certification[]> {
  const data = await hygraphClient.request<{ certificates: Certification[] }>(
    GET_CERTIFICATIONS
  );

  return data.certificates ?? [];
}
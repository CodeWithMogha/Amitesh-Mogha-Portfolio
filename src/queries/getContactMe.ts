// queries/getContactMe.ts
import datoCMSClient from './hygraphClient';
import { ContactMe } from '../types';

const GET_CONTACT_ME = `
  query {
    contactMe {
      profilePicture {
        url
      }
      name
      title
      summary
      companyUniversity
      linkedinLink
      email
      phoneNumber
    }
  }
`;

export async function getContactMe(): Promise<ContactMe> {
  const data = await datoCMSClient.request<{ contactMe: ContactMe }>(GET_CONTACT_ME);
  return data.contactMe;
}

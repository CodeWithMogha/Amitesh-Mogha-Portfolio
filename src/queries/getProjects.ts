import hygraphClient from './hygraphClient';
import { Project } from '../types';

const GET_PROJECTS = `
query GetProjects {
  projects(stage: PUBLISHED) {
    title
    link
    image {
      url
    }
  }
}
`;

export async function getProjects(): Promise<Project[]> {
  try {
    const data = await hygraphClient.request<{ projects: Project[] }>(GET_PROJECTS);
    return data.projects || [];
  } catch (error) {
    console.error('Error fetching projects from Hygraph:', error);
    return [];
  }
}
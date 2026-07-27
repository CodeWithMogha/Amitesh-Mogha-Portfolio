// types.ts

export interface ProfileBanner {
  headline: string;
  resumeLink: string;
  linkedinLink: string;
  profileSummary: string;
}

export interface WorkPermit {
  visaStatus: string;
  expiryDate: Date;
  summary: string;
  additionalInfo: string;
}

export interface TimelineItem {
  timelineType: 'work' | 'education';
  name: string;
  title: string;
  techStack: string;
  summaryPoints: string[];
  dateRange: string;
}

export interface Project {
  title: string;
  link?: string;
  image?: {
    url: string;
  };
}

export type Certification = {
  title: string;
  issuer: string;
  year: string;
  category: string;
  credentialUrl: string;
  number: number;
  logo?: {
    url: string;
  };
};

export interface ContactMe {
  profilePicture: { url: string };
  name: string;
  title: string;
  summary: string;
  companyUniversity: string;
  linkedinLink: string;
  email: string;
  phoneNumber: string;
}

export interface Skill {
  title: string;
  category: string;
  image?: {
    url: string;
  } | null;
}

export interface Recommendation {
  name: string;
  designation: string;
  organization: string;
  message: string;
  linkedin?: string;
  email?: string;
  link?: string;
  photo: {
    url: string;
  };
  order: number;
}

export interface Blog {
  title: string;
  slug: string;
  description: string;
  tag: string;
  published: string;
  img?: {
    url: string;
  };
}

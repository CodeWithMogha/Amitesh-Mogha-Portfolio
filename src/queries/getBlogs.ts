import hygraphClient from "./hygraphClient";

export interface Blog {
  title: string
  slug: string
  description: string
  tag: string
  published: string
  img?: {
    url: string
  }
}

const GET_BLOGS = `
query GetBlogs {
  blogs(stage: PUBLISHED, orderBy: published_DESC) {
    title
    slug
    description
    tag
    published
    img {
      url
    }
  }
}
`;

export async function getBlogs(): Promise<Blog[]> {
  try {
    const data = await hygraphClient.request<{ blogs: Blog[] }>(GET_BLOGS)
    return data.blogs
  } catch (error) {
    console.error("Hygraph Blogs Error:", error)
    return []
  }
}
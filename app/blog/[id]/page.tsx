import { BlogDetailPage } from "../../../src/app/pages/BlogDetailPage";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BlogDetailPage id={id} />;
}

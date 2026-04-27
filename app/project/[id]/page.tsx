import { ProjectDetailPage } from "../../../src/app/pages/ProjectDetailPage";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetailPage id={id} />;
}

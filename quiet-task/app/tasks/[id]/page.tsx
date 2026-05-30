import { TaskDetailView } from "@/features/tasks/TaskDetailView";

type PageProps = {
  params: { id: string };
};

export default function TaskDetailPage({ params }: PageProps) {
  return <TaskDetailView taskId={params.id} />;
}

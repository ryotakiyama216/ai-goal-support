import { MemoDetailView } from "@/features/memos/MemoDetailView";

type PageProps = {
  params: { id: string };
};

export default function MemoDetailPage({ params }: PageProps) {
  return <MemoDetailView memoId={params.id} />;
}

import { CurriculumForm } from "@/components/admin/curriculum-form";

export default function NewCurriculumPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">새 커리큘럼 추가</h1>
        <p className="text-muted-foreground">
          새로운 커리큘럼을 생성하고 아티클을 추가하세요
        </p>
      </div>

      <CurriculumForm mode="create" />
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface EnrollButtonProps {
  curriculumId: string;
  isEnrolled: boolean;
  isLoggedIn: boolean;
}

export function EnrollButton({
  curriculumId,
  isEnrolled: initialIsEnrolled,
  isLoggedIn,
}: EnrollButtonProps) {
  const router = useRouter();
  const [isEnrolled, setIsEnrolled] = useState(initialIsEnrolled);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      // Trigger Google OAuth login
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/curriculums/${curriculumId}`,
        },
      });

      if (error) {
        toast.error("로그인 중 오류가 발생했습니다.");
        console.error("Login error:", error);
      }
      return;
    }

    // User is logged in, create enrollment
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("사용자 정보를 가져올 수 없습니다.");
        setIsLoading(false);
        return;
      }

      console.log('[Enroll] Attempting to enroll:', { userId: user.id, curriculumId });

      const { data, error } = await supabase.from("enrollments").insert({
        user_id: user.id,
        curriculum_id: curriculumId,
      }).select();

      console.log('[Enroll] Result:', { data, error });

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation - already enrolled
          toast.info("이미 등록된 커리큘럼입니다.");
        } else {
          toast.error(`등록 중 오류가 발생했습니다: ${error.message}`);
          console.error("Enrollment error:", error);
        }
      } else {
        setIsEnrolled(true);
        toast.success("학습 공간에 담았습니다! 내 학습 페이지로 이동합니다.");
        setTimeout(() => {
          router.push("/my-learning");
        }, 1000);
      }
    } catch (error) {
      console.error("Enrollment error (catch):", error);
      toast.error("등록 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.push("/my-learning")}
          size="lg"
          className="flex items-center gap-2"
        >
          <CheckCircle2 className="h-5 w-5" />
          학습 계속하기
        </Button>
        <p className="text-sm text-muted-foreground">이미 등록된 커리큘럼입니다</p>
      </div>
    );
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={isLoading}
      size="lg"
      className="min-w-[200px]"
    >
      {isLoading ? "등록 중..." : "이 커리큘럼 시작하기"}
    </Button>
  );
}

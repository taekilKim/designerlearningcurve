"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { signOutAction } from "@/lib/auth-actions";

export function GNB() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .single();
      if (error) {
        console.error("[GNB] Profile query error:", error.message);
        return false;
      }
      return profile?.is_admin === true;
    } catch (error) {
      console.error("[GNB] Failed to fetch admin status:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
        setIsAdmin(user ? await checkAdminStatus(user.id) : false);
      } catch (error) {
        console.error("[GNB] Failed to fetch user:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAdmin(currentUser ? await checkAdminStatus(currentUser.id) : false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold cursor-pointer">
            <span className="hidden md:inline">Designer Learning Curve</span>
            <span className="md:hidden">DLC</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/curriculums"
              className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                pathname?.startsWith("/curriculums")
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              커리큘럼
            </Link>
            {user && (
              <Link
                href="/my-learning"
                className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                  pathname?.startsWith("/my-learning")
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                내 학습
              </Link>
            )}
            {!isLoading && isAdmin && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                  pathname?.startsWith("/admin")
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                관리자
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden md:block">
                {user.email}
              </span>
              <form action={signOutAction}>
                <Button
                  type="submit"
                  variant="outline"
                  className="hidden md:flex cursor-pointer"
                >
                  로그아웃
                </Button>
              </form>
            </>
          ) : (
            <Button onClick={handleSignIn} className="hidden md:flex cursor-pointer">
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

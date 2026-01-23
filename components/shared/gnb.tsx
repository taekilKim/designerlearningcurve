"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export function GNB() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        // Check admin status
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", user.id)
            .single();
          setIsAdmin(profile?.is_admin === true);
        }
      } catch (error) {
        console.error("[GNB] Failed to fetch user:", error);
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      // Check admin status on auth change
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();
          setIsAdmin(profile?.is_admin === true);
        } catch (error) {
          console.error("[GNB] Failed to fetch admin status:", error);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      // Force reload to clear all state
      window.location.replace("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

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
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
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
            {isAdmin && (
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
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="hidden md:flex"
              >
                로그아웃
              </Button>
            </>
          ) : (
            <Button onClick={handleSignIn} className="hidden md:flex">로그인</Button>
          )}
        </div>
      </div>
    </header>
  );
}

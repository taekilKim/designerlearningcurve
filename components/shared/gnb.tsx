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
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
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
          <Link href="/" className="text-xl font-bold">
            Designer Learning Curve
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/curriculums"
              className={`text-sm font-medium transition-colors hover:text-primary ${
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
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname?.startsWith("/my-learning")
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                내 학습
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden md:inline">
                {user.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                로그아웃
              </Button>
            </div>
          ) : (
            <Button onClick={handleSignIn}>로그인</Button>
          )}
        </div>
      </div>
    </header>
  );
}

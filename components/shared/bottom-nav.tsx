"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { House, BookOpen, GraduationCap, UserGear, SignOut, SignIn } from "@phosphor-icons/react";
import { toast } from "sonner";

export function BottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
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

      setLoading(false);
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      // Check admin status on auth change
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();
        setIsAdmin(profile?.is_admin === true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  if (loading) return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("로그아웃되었습니다");
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

  const navItems = [
    {
      href: "/",
      label: "홈",
      icon: House,
      show: true,
    },
    {
      href: "/curriculums",
      label: "커리큘럼",
      icon: BookOpen,
      show: true,
    },
    {
      href: "/my-learning",
      label: "내 학습",
      icon: GraduationCap,
      show: !!user,
    },
    {
      href: "/admin",
      label: "관리자",
      icon: UserGear,
      show: isAdmin,
    },
  ];

  const visibleItems = navItems.filter((item) => item.show);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex items-center justify-around h-16">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1"
            >
              <Icon
                size={24}
                weight={isActive ? "fill" : "regular"}
                className={isActive ? "text-primary" : "text-muted-foreground"}
              />
              <span
                className={`text-xs ${
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        {/* Login/Logout Button */}
        {user ? (
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center flex-1 h-full gap-1"
          >
            <SignOut
              size={24}
              weight="regular"
              className="text-muted-foreground"
            />
            <span className="text-xs text-muted-foreground">
              로그아웃
            </span>
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="flex flex-col items-center justify-center flex-1 h-full gap-1"
          >
            <SignIn
              size={24}
              weight="regular"
              className="text-muted-foreground"
            />
            <span className="text-xs text-muted-foreground">
              로그인
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}

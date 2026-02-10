"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { House, BookOpen, GraduationCap, UserGear, SignOut, SignIn } from "@phosphor-icons/react";
import { signOutAction } from "@/lib/auth-actions";

export function BottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .single();
      if (error) return false;
      return profile?.is_admin === true;
    } catch {
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
        console.error("[Bottom Nav] Failed to fetch user:", error);
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
          <form
            action={signOutAction}
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            <button
              type="submit"
              className="flex flex-col items-center justify-center gap-1"
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
          </form>
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

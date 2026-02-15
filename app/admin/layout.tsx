import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    redirect("/");
  }

  return (
    <div className="min-h-screen md:flex">
      <AdminNav />
      <main className="min-w-0 flex-1 overflow-x-auto p-4 md:p-8">{children}</main>
    </div>
  );
}

import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "./components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-gray-50">
        {session && (
          <header className="bg-[#2D2D2D] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-8">
                  <Link
                    href="/admin"
                    className="text-lg font-medium hover:text-[#219CB8] transition-colors"
                  >
                    Administration
                  </Link>
                  <nav className="flex gap-6 text-sm">
                    <Link
                      href="/admin"
                      className="hover:text-[#219CB8] transition-colors"
                    >
                      Posts
                    </Link>
                    <Link
                      href="/"
                      target="_blank"
                      className="hover:text-[#219CB8] transition-colors"
                    >
                      Voir le site →
                    </Link>
                  </nav>
                </div>
                <AdminNav />
              </div>
            </div>
          </header>
        )}
        <main>{children}</main>
      </div>
    </SessionProvider>
  );
}

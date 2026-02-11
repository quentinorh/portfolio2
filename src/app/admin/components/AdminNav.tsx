"use client";

import { signOut, useSession } from "next-auth/react";

export default function AdminNav() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-300">{session.user?.email}</span>
      <button
        onClick={() =>
          signOut({ callbackUrl: `${window.location.origin}/admin/login` })
        }
        className="text-sm px-3 py-1.5 bg-white/10 rounded hover:bg-white/20 transition-colors"
      >
        Déconnexion
      </button>
    </div>
  );
}

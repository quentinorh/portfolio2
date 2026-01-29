import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#2D2D2D] antialiased">
      <header className="border-b border-[#2D2D2D]/10 px-6 py-5 md:px-12">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between">
          <Link href="/" className="text-lg font-medium uppercase tracking-wide md:text-xl">
            Quentin Orhant
          </Link>
          <nav className="flex gap-6 text-xs md:text-sm">
            <Link href="/" className="hover:text-[#219CB8]">Projets</Link>
            <Link href="/#about" className="hover:text-[#219CB8]">À propos</Link>
            <Link href="/contact" className="hover:text-[#219CB8]">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-6 py-16 md:px-12">
        <h1 className="mb-6 text-2xl font-medium md:text-3xl">Contact</h1>
        <p className="mb-8 text-[#2D2D2D]/80">
          Formulaire à brancher (API Route + envoi email ou enregistrement en BDD).
        </p>
        <Link href="/" className="text-[#219CB8] hover:underline">← Retour à l’accueil</Link>
      </main>
    </div>
  );
}

import Link from "next/link";
import Header from "@/components/Header";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight mb-4">
              On discute ?
            </h1>
            <p className="text-lg text-stone-500">
              Vous avez un projet en tête, une question, n&apos;hésitez pas à me contacter.
            </p>
          </div>

          {/* Contact Options */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden mb-8">
            <a
              href="mailto:quentin.orhant@mailo.fr"
              className="flex items-center gap-4 p-6 border-b border-stone-100 hover:bg-stone-50 transition-colors group"
            >
              <div className="flex-1">
                <p className="text-sm text-stone-500 text-center">Email</p>
                <p className="text-stone-900 font-medium text-center">quentin.orhant@mailo.fr</p>
              </div>
            </a>

            <a
              href="tel:0676544311"
              className="flex items-center gap-4 p-6 border-b border-stone-100 hover:bg-stone-50 transition-colors group"
            >
              <div className="flex-1">
                <p className="text-sm text-stone-500 text-center">Téléphone</p>
                <p className="text-stone-900 font-medium text-center">06 76 54 43 11</p>
              </div>
            </a>
          </div>

          {/* Location */}
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-2 text-accent mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">Basé en Bretagne</span>
            </div>
            <p className="text-sm text-stone-500">
              Mais on peut travailler ensemble de n&apos;importe où, c&apos;est ça la magie d&apos;internet !
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

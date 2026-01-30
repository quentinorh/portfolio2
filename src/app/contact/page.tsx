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
              <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center group-hover:bg-accent-light transition-colors">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-stone-500">Email</p>
                <p className="text-stone-900 font-medium">quentin.orhant@mailo.fr</p>
              </div>
            </a>

            <a
              href="tel:0676544311"
              className="flex items-center gap-4 p-6 border-b border-stone-100 hover:bg-stone-50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-stone-500">Téléphone</p>
                <p className="text-stone-900 font-medium">06 76 54 43 11</p>
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

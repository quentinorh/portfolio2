import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16 mb-16">
            <div className="flex flex-col items-center lg:items-start">
              <Image
                src="/avatar2.png"
                alt="Quentin Orhant"
                width={250}
                height={250}
                className="rounded-2xl object-cover shadow-lg shadow-stone-200/50 mb-6"
              />
              <div className="text-center lg:text-left">
                <h1 className="text-2xl font-semibold text-stone-900 mb-6">
                  Quentin Orhant
                </h1>
                <div className="flex flex-col items-center lg:items-start gap-3">
                  <a
                    href="mailto:quentin.orhant@mailo.fr"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
                  >
                    quentin.orhant@mailo.fr
                  </a>
                  <a
                    href="tel:0676544311"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-200 transition-colors"
                  >
                    06 76 54 43 11
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-lg text-stone-600 leading-relaxed mb-6">
                Maker et développeur freelance basé en Bretagne, je mets en avant
                une approche éthique et écologique dans tous mes projets.
              </p>  
              <p className="text-lg text-stone-600 leading-relaxed  mb-6">
                Chaque projet est le fruit d'une réflexion sur les enjeux environnementaux actuels. 
                Découvrez mes réalisations allant du recyclage des plastiques à la fabrication d’une balise pour les tortues marines.
              </p>
              <p className="text-lg text-stone-600 leading-relaxed">
                Explorez mes travaux qui fusionnent art, science et technologie pour un futur plus durable. 
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Expériences */}
            <div className="bg-white rounded-2xl border border-stone-200 p-8">
              <h2 className="flex items-center gap-3 text-sm font-medium uppercase tracking-wider text-accent mb-6">
                <span className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                Expériences
              </h2>

              <div className="space-y-6">
                <div className="border-l-2 border-accent/30 pl-4">
                  <span className="text-xs font-medium text-accent uppercase tracking-wider">
                    2013 - Aujourd&apos;hui
                  </span>
                  <h3 className="text-base font-medium text-stone-900 mt-1">
                    Maker / Développeur freelance
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">
                    Prototypage, programmation, créations artistiques, médiation et ateliers.
                  </p>
                </div>

                <div className="border-l-2 border-stone-200 pl-4">
                  <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                    2019 - 2022
                  </span>
                  <h3 className="text-base font-medium text-stone-900 mt-1">
                    Coordinateur / Fabmanager
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">
                    Création et coordination de L&apos;Atelier Commun. Tiers-lieu associatif dédié 
                    à l&apos;écologie et au réemploi.
                  </p>
                </div>

                <div className="border-l-2 border-stone-200 pl-4">
                  <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                    2011 - 2013
                  </span>
                  <h3 className="text-base font-medium text-stone-900 mt-1">
                    Animateur / Médiateur scientifique
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">
                    Animation et accompagnement des groupes à L&apos;Espace des sciences de Rennes.
                  </p>
                </div>
              </div>
            </div>

            {/* Formation & Compétences */}
            <div className="space-y-8">
              {/* Formations */}
              <div className="bg-white rounded-2xl border border-stone-200 p-8">
                <h2 className="flex items-center gap-3 text-sm font-medium uppercase tracking-wider text-accent mb-6">
                  <span className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </span>
                  Formations
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="text-sm font-semibold text-accent whitespace-nowrap">
                      2022
                    </span>
                    <div>
                      <h3 className="text-sm font-medium text-stone-900">
                        Bootcamp Développeur Web
                      </h3>
                      <p className="text-sm text-stone-500">Le Wagon Rennes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="text-sm font-semibold text-stone-400 whitespace-nowrap">
                      2011
                    </span>
                    <div>
                      <h3 className="text-sm font-medium text-stone-900">
                        Licence géo & aménagement
                      </h3>
                      <p className="text-sm text-stone-500">Université Rennes 2</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="text-sm font-semibold text-stone-400 whitespace-nowrap">
                      2010
                    </span>
                    <div>
                      <h3 className="text-sm font-medium text-stone-900">
                        Licence énergie environnement
                      </h3>
                      <p className="text-sm text-stone-500">Université de Clermont-Ferrand</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compétences */}
              <div className="bg-white rounded-2xl border border-stone-200 p-8">
                <h2 className="flex items-center gap-3 text-sm font-medium uppercase tracking-wider text-accent mb-6">
                  <span className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </span>
                  Compétences
                </h2>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Programmation",
                    "Design d'objets",
                    "Design graphique",
                    "Gestion de projet",
                    "Médiation",
                    "Prototypage",
                    "Low-tech",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm rounded-full bg-stone-100 text-stone-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="mt-8 bg-white rounded-2xl border border-stone-200 p-8">
            <h2 className="flex items-center gap-3 text-sm font-medium uppercase tracking-wider text-accent mb-6">
              <span className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </span>
              Langages et outils
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                // Langages
                "Python",
                "Ruby",
                "Javascript",
                "TypeScript",
                "HTML/CSS",
                "SQL",
                // Frameworks & backend
                "React",
                "Next.js",
                "Node.js",
                "Tailwind",
                "API REST",
                // CMS
                "WordPress",
                // Outils dev
                "Git",
                "Github",
                // Design
                "Figma",
                "Photoshop",
                "Illustrator",
                // Maker & CAO
                "Arduino",
                "Sketchup",
                "Fusion 360",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-sm font-medium rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

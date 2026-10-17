import { NavBarDemo } from "@/components/ui/demo"

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24 text-center">
      {/* Tubelight Navbar */}
      <NavBarDemo />

      {/* Hero Showcase Content */}
      <div className="max-w-3xl mx-auto space-y-6 pt-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-widest text-[#d4af37] border border-[#d4af37]/30 rounded-full bg-[#d4af37]/5 backdrop-blur-md">
          ✦ Tubelight Navbar Active
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight text-white">
          Furniture of <span className="italic font-serif text-[#d4af37]">distinction.</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Integrated with Next.js, TypeScript, Tailwind CSS, and Framer Motion spring physics with animated tubelight lamp glow.
        </p>

        <div className="pt-8 flex flex-wrap gap-4 justify-center">
          <a
            href="http://localhost:8080"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full bg-[#d4af37] text-black font-medium hover:bg-[#e2c15c] transition-all"
          >
            Open Live HTML Showcase (Port 8080) ↗
          </a>
        </div>
      </div>
    </main>
  )
}

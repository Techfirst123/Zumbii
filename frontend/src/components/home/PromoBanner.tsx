import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/container";

const stats: [string, string][] = [
  ["1200+", "Franchise Sq.Ft"],
  ["2", "Free Staff"],
  ["6 mo", "Support Money"],
];

export default function PromoBanner() {
  return (
    <section className="py-4">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-red-700 via-brand-red-600 to-zumbii-950 px-8 py-12 sm:px-14 sm:py-16">
          <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-gold-400/10 blur-2xl" />
          <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                Franchise Opportunity
              </span>
              <h3 className="mt-4 text-2xl font-black text-white sm:text-3xl">
                Own Your Own Zumbii Store
              </h3>
              <p className="mt-3 max-w-lg text-white/80">
                Complete retail setup, free product stock, dedicated staff, and monthly support
                money — everything you need to run a thriving Zumbii franchise.
              </p>
              <Link href="/franchise">
                <Button variant="gold" size="lg" className="mt-6">
                  Explore Franchise
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {stats.map(([n, l]) => (
                <div key={l} className="rounded-2xl bg-white/10 py-5 backdrop-blur">
                  <div className="text-xl font-black text-gold-400">{n}</div>
                  <div className="mt-1 text-[11px] text-white/70">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between px-6 py-4 lg:px-12">
        <h1 className="font-display text-2xl font-bold text-terracotta">
          Naya Dream Home
        </h1>
        <Link
          href="/signin"
          className="rounded-lg bg-terracotta px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-terracotta-dark"
        >
          Sign In
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-12">
        <h2 className="font-display text-4xl font-bold text-brown-dark md:text-5xl lg:text-6xl">
          Your Home,
          <br />
          <span className="text-terracotta">Beautifully Organized</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-warm-gray">
          Plan weekly chores, create meal plans, and keep your household running
          smoothly — with a little help from AI.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/signin"
            className="rounded-lg bg-terracotta px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-terracotta-dark"
          >
            Get Started
          </Link>
          <Link
            href="#features"
            className="rounded-lg border-2 border-terracotta px-8 py-3 text-base font-semibold text-terracotta transition-colors hover:bg-terracotta hover:text-white"
          >
            Learn More
          </Link>
        </div>

        <section id="features" className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-cream-dark bg-white p-8 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage/10 text-2xl">
              🧹
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-brown">
              Chore Scheduling
            </h3>
            <p className="mt-2 text-sm text-warm-gray">
              Create weekly chore schedules and assign tasks to household members
              based on age and ability.
            </p>
          </div>
          <div className="rounded-xl border border-cream-dark bg-white p-8 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10 text-2xl">
              🍽️
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-brown">
              Meal Planning
            </h3>
            <p className="mt-2 text-sm text-warm-gray">
              Plan breakfast, lunch, dinner, and snacks for every day of the
              week with dietary preferences.
            </p>
          </div>
          <div className="rounded-xl border border-cream-dark bg-white p-8 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brown/10 text-2xl">
              🤖
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-brown">
              AI-Powered
            </h3>
            <p className="mt-2 text-sm text-warm-gray">
              Let AI generate personalized chore schedules and meal plans
              tailored to your household.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-cream-dark py-8 text-center text-sm text-warm-gray-light">
        &copy; {new Date().getFullYear()} Naya Dream Home. All rights reserved.
      </footer>
    </div>
  );
}

"use client";

import Link from "next/link";
import Spline from "@splinetool/react-spline/next";

const DEFAULT_SPLINE_SCENE = "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode";

export function SplineShowcase() {
  const sceneUrl = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL?.trim() || DEFAULT_SPLINE_SCENE;

  return (
    <section className="mx-auto mt-16 max-w-7xl px-6 md:px-12">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-start">
        <article className="glass-card rounded-3xl p-7 md:p-9">
          <p className="text-xs uppercase tracking-[0.2em] text-luxury-amber">Spline Design Lab</p>
          <h2 className="mt-3 text-luxury-heading text-3xl md:text-4xl">
            Interactive 3D Art Direction Layer
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
            This module adds a cinematic Spline scene directly into your storefront so brand
            storytelling feels alive. We can replace this default scene with your own custom Spline
            project URL without changing any code.
          </p>

          <div className="mt-6 grid gap-3 text-sm text-white/75 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              Real-time 3D composition
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              No-code scene updates via Spline
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              Optimized for desktop and mobile
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              Blended with existing WebGL style
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="https://spline.design"
              target="_blank"
              rel="noreferrer"
              aria-label="Open Spline website in a new tab"
              className="rounded-xl bg-luxury-amber px-4 py-2 text-sm font-semibold text-black"
            >
              Create Your Spline Scene
            </Link>
            <Link
              href="/products"
              aria-label="Browse products page"
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-luxury-amber hover:text-luxury-amber"
            >
              See Products In Motion
            </Link>
          </div>
        </article>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,166,35,0.2),transparent_55%)]" />
          <div
            className="relative h-[520px] w-full rounded-2xl"
            role="img"
            aria-label="Interactive Spline 3D showroom scene"
          >
            <Spline scene={sceneUrl} renderOnDemand />
          </div>
        </div>
      </div>
    </section>
  );
}

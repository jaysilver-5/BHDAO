import Hero from "@/components/landing/Hero";
import { Sections } from "@/components/landing/Sections";
import WhatWeBuild from "@/components/landing/WhatWeBuild";

export default function Page() {
  return (
    <main className="grain">
      <Hero />
      <WhatWeBuild />
      <Sections />
    </main>
  );
}

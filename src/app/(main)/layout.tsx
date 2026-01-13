import React from "react";
import Header from "@/components/parts/Header";
import Navigation from "@/components/parts/Navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Header />
      <Navigation />
      <main>{children}</main>
    </section>
  );
}
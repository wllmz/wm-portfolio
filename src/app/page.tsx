import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Services } from "@/components/services";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

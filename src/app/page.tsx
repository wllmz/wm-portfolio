import { CubeStage } from "@/components/cube/cube-stage";
import { Projects } from "@/components/projects";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <main>
        <CubeStage />
        {/* la feuille : glisse par-dessus le hero épinglé, coins
            arrondis en écho au cadre */}
        <div className="relative z-10 rounded-t-[26px] bg-cream shadow-[0_-28px_70px_rgba(35,43,78,0.22)]">
          <Projects />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}

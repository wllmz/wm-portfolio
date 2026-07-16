import { CubeStage } from "@/components/cube/cube-stage";
import { Projects } from "@/components/projects";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <main>
        <CubeStage />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

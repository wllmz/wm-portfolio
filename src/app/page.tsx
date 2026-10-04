import { TopBar } from "@/components/top-bar";
import { CubeStage } from "@/components/cube/cube-stage";
import { Projects } from "@/components/projects";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { ScreenScroll } from "@/components/screen-scroll";

export default function Home() {
  return (
    <>
      <TopBar />
      <main className="home">
        <CubeStage />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
      <ScreenScroll />
    </>
  );
}

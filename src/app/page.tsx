import { Slider } from "@/components/slider";
import { CubeStage } from "@/components/cube/cube-stage";
import { Projects } from "@/components/projects";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <Slider>
      {/* écran 1 : le hero (cube) */}
      <CubeStage />
      {/* écran 2 : les projets */}
      <Projects />
      {/* écran 3 : à propos */}
      <About />
      {/* écran 4 : contact + footer */}
      <div className="contact-slide">
        <Contact />
        <Footer />
      </div>
    </Slider>
  );
}

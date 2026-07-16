"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
  CHAOS,
  FACES,
  FACE_LAYOUT,
  NAV_ORDER,
  ORIENT,
  type FaceKey,
  type PanelKey,
} from "./cube-data";

/** État mutable de l'animation — hors React pour la boucle rAF. */
type CubeState = {
  rotX: number;
  rotY: number;
  velX: number;
  velY: number;
  dragging: boolean;
  dragDist: number;
  lastPX: number;
  lastPY: number;
  idle: number;
  mx: number;
  my: number;
  cmx: number;
  cmy: number;
  exp: number;
  cur: number;
  dim: number;
  started: boolean;
  orientTarget: [number, number] | null;
};

const smooth = (t: number) => t * t * (3 - 2 * t); // smoothstep
const ramp = (v: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));

function nearestAngle(current: number, target: number) {
  const k = Math.round((current - target) / 360);
  return target + k * 360;
}

export function CubeStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const facenavRef = useRef<HTMLElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [clock, setClock] = useState("--:--:--");
  const [openKey, setOpenKey] = useState<PanelKey | null>(null);
  // dernière face sélectionnée — garde le contenu pendant l'animation de sortie
  const [activeKey, setActiveKey] = useState<PanelKey>("design");

  const openKeyRef = useRef<PanelKey | null>(null);
  const reduceRef = useRef(false);

  const state = useRef<CubeState>({
    rotX: -12,
    rotY: 28,
    velX: 0,
    velY: 0,
    dragging: false,
    dragDist: 0,
    lastPX: 0,
    lastPY: 0,
    idle: 0,
    mx: 0,
    my: 0,
    cmx: 0,
    cmy: 0,
    exp: 2.6,
    cur: 0,
    dim: 1,
    started: false,
    orientTarget: null,
  });

  /* ── ouverture / fermeture des faces ── */
  const openFace = useCallback((key: PanelKey) => {
    const s = state.current;
    stageRef.current?.classList.add("interacting");
    openKeyRef.current = key;
    setOpenKey(key);
    setActiveKey(key);
    const [tx, ty] = ORIENT[key];
    s.orientTarget = [tx, nearestAngle(s.rotY, ty)];
  }, []);

  const closeFace = useCallback(() => {
    if (!openKeyRef.current) return;
    const s = state.current;
    openKeyRef.current = null;
    setOpenKey(null);
    s.orientTarget = null;
    s.idle = 0;
  }, []);

  const toggleFace = useCallback(
    (key: PanelKey) => {
      if (openKeyRef.current === key) closeFace();
      else openFace(key);
    },
    [openFace, closeFace],
  );

  /* ── drag du cube ── */
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    s.dragging = true;
    s.dragDist = 0;
    s.lastPX = e.clientX;
    s.lastPY = e.clientY;
    s.velX = 0;
    s.velY = 0;
    sceneRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastPX;
    const dy = e.clientY - s.lastPY;
    s.dragDist += Math.abs(dx) + Math.abs(dy);
    s.lastPX = e.clientX;
    s.lastPY = e.clientY;
    if (openKeyRef.current) return;
    s.velY = dx * 0.4;
    s.velX = -dy * 0.4;
    s.rotY += s.velY;
    s.rotX += s.velX;
    s.idle = 0;
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    s.dragging = false;
    if (s.dragDist < 8) {
      const face = (e.target as HTMLElement).closest<HTMLElement>(".face");
      if (face && face.dataset.key) {
        toggleFace(face.dataset.key as FaceKey);
      } else if (openKeyRef.current) {
        closeFace();
      }
    }
  };

  /* ── horloge ── */
  useEffect(() => {
    const upd = () => setClock(new Date().toLocaleTimeString("fr-FR"));
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, []);

  /* ── listeners globaux ── */
  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const onMouseMove = (e: MouseEvent) => {
      state.current.mx = e.clientX / window.innerWidth - 0.5;
      state.current.my = e.clientY / window.innerHeight - 0.5;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFace();
    };
    const onDocPointerDown = (e: globalThis.PointerEvent) => {
      if (!openKeyRef.current) return;
      const t = e.target as HTMLElement;
      if (t.closest(".scene") || t.closest(".facenav")) return;
      closeFace();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onDocPointerDown);
    };
  }, [closeFace]);

  /* ── boucle : rotation, déstructuration au scroll, émergence du titre ── */
  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));

    const s = state.current;
    const reduceMotion = reduceRef.current;
    if (reduceMotion) s.exp = 1;

    const startTimer = window.setTimeout(() => (s.started = true), 350);

    const stage = stageRef.current;
    const cube = cubeRef.current;
    const center = centerRef.current;
    const title = titleRef.current;
    if (!stage || !cube || !center || !title) return;

    const faces = Array.from(cube.querySelectorAll<HTMLElement>(".face"));
    const facenav = facenavRef.current;
    const scrollLine = scrollLineRef.current;

    let rafId: number;

    const tick = () => {
      /* progression 0→1 sur la hauteur de la scène épinglée */
      const stageH = stage.offsetHeight - window.innerHeight;
      const target = reduceMotion
        ? 0
        : Math.min(Math.max(window.scrollY / stageH, 0), 1);
      s.cur += (target - s.cur) * 0.09;
      const p = smooth(s.cur);
      stage.classList.toggle("scrolling", s.cur > 0.02);

      s.cmx += (s.mx - s.cmx) * 0.06;
      s.cmy += (s.my - s.cmy) * 0.06;

      /* LA DÉSTRUCTURATION : les faces s'éloignent du centre (jusqu'à 8x)
         en tournant chacune sur elle-même, puis s'estompent.
         Une face ouverte déstructure aussi le cube (plus doucement) pour
         venir seule au premier plan. */
      let expTarget = 1 + p * 8;
      if (!s.started) expTarget = 2.6;
      if (openKeyRef.current) expTarget = Math.max(expTarget, 1.55);
      s.exp += (expTarget - s.exp) * 0.09;
      cube.style.setProperty("--exp", s.exp.toFixed(4));

      /* le cube s'estompe légèrement pendant qu'une face est ouverte,
         mais reste bien présent — retour en douceur à la fermeture */
      s.dim += ((openKeyRef.current ? 0.6 : 1) - s.dim) * 0.08;

      faces.forEach((f, i) => {
        const position = FACE_LAYOUT[i].position;
        f.style.setProperty("--cz", (CHAOS[position] * p).toFixed(2) + "deg");
        if (s.started) {
          const base = Math.max(0, 1 - ramp(p, 0.55, 0.92));
          f.style.opacity = String(base * s.dim);
        }
      });

      /* rotation : s'accélère pendant la déstructuration */
      if (s.orientTarget) {
        s.rotX += (s.orientTarget[0] - s.rotX) * 0.08;
        s.rotY += (s.orientTarget[1] - s.rotY) * 0.08;
      } else if (!s.dragging) {
        s.velY *= 0.95;
        s.velX *= 0.95;
        s.rotY += s.velY;
        s.rotX += s.velX;
        s.idle++;
        if (s.idle > 30) {
          s.rotY += (reduceMotion ? 0.04 : 0.12) + p * 1.8;
          s.rotX += (-12 - s.rotX) * 0.012;
        }
      }
      cube.style.transform = `rotateX(${s.rotX}deg) rotateY(${s.rotY}deg)`;

      if (!reduceMotion) {
        /* le cube grossit légèrement vers toi en éclatant */
        center.style.transform = `scale(${1 + p * 0.3}) translate(${s.cmx * 12}px, ${s.cmy * 9}px)`;

        /* le titre émerge au cœur de l'explosion */
        const tShow = ramp(p, 0.45, 0.8);
        title.style.opacity = String(tShow);
        title.style.transform = `translateY(${(1 - tShow) * 34}px)`;

        /* l'habillage du cube s'efface — les quatre coins (wm, fullstack,
           heure, dispo) et le cadre restent visibles */
        if (facenav) {
          facenav.style.opacity = String(Math.max(0, 1 - p * 4));
          facenav.style.pointerEvents = p > 0.1 ? "none" : "";
        }
        if (scrollLine)
          scrollLine.style.opacity = String(Math.max(0, 1 - p * 4));

        if (p > 0.08 && openKeyRef.current) closeFace();
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(startTimer);
    };
  }, [closeFace]);

  return (
    <div
      ref={stageRef}
      className={`stage${loaded ? " loaded" : ""}`}
      id="stage"
    >
      <section className="hero" aria-label="William Martinez — fullstack">
        <div className="frame" aria-hidden="true" />

        <p className="corner tl">
          <span className="wm-mini" aria-label="wm">
            wm<span className="accent">.</span>
          </span>
          <br />
          William Martinez
        </p>
        <p className="corner tr">
          Fullstack
          <br />
          <span className="accent">React · Node</span>
        </p>
        <p className="corner bl">
          <span className="clock" suppressHydrationWarning>
            {clock}
          </span>
        </p>
        <p className="corner br">
          <span className="dot-live" aria-hidden="true" />
          Dispo <span className="accent">Freelance · Remote</span>
        </p>

        {/* le titre qui émerge quand le cube se déstructure */}
        <div className="stage-title" ref={titleRef} aria-hidden="true">
          <div>
            <span className="eyebrow">Projets — les vrais, en prod</span>
            <h2>
              trois projets,
              <br />
              <span className="g">six faces couvertes.</span>
            </h2>
          </div>
        </div>

        <div className="center" ref={centerRef}>
          <div
            className="scene"
            ref={sceneRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (state.current.dragging = false)}
          >
            <div className="cube" ref={cubeRef}>
              {FACE_LAYOUT.map(({ position, key }) => (
                <div
                  key={key}
                  className={`face f-${position}${openKey === key ? " is-open" : ""}`}
                  data-key={key}
                >
                  <span className="num" aria-hidden="true">
                    {FACES[key].num}
                  </span>
                  <span className="lbl">{FACES[key].title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <nav
          className="facenav"
          ref={facenavRef}
          aria-label="Explorer les six faces"
        >
          {NAV_ORDER.map((key) => (
            <button
              key={key}
              className={openKey === key ? "active" : undefined}
              onClick={() => toggleFace(key)}
            >
              {FACES[key].title}
            </button>
          ))}
        </nav>

        {/* la face détachée : même matière qu'une face du cube, mais plate,
            face caméra, taille maîtrisée — elle atterrit au premier plan
            pendant que le cube se déstructure derrière */}
        <div
          className={`face-card pos-${activeKey}${openKey ? " open" : ""}`}
          aria-live="polite"
        >
          {/* key = la face : le contenu se remonte (et rejoue son fondu)
              à chaque changement, pendant que la carte glisse */}
          <div className="fc-inner" key={activeKey}>
            <span className="num" aria-hidden="true">
              {FACES[activeKey].num}
            </span>
            <span className="fc-title">{FACES[activeKey].title}</span>
            <span className="fc-skills">
              {FACES[activeKey].skills.join(" · ")}
            </span>
            <p className="fc-ex">{FACES[activeKey].ex}</p>
          </div>
        </div>

        <div className="scroll-line" ref={scrollLineRef} aria-hidden="true" />
      </section>
    </div>
  );
}

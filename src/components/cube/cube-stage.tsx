"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
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
  dim: number;
  started: boolean;
  orientTarget: [number, number] | null;
};

function nearestAngle(current: number, target: number) {
  const k = Math.round((current - target) / 360);
  return target + k * 360;
}

/** Le hero : un cube 3D interactif, plein écran. Le cube ne vit QUE là. */
export function CubeStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const facenavRef = useRef<HTMLElement>(null);

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
    exp: 1.7,
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
      if (
        t.closest(".scene") ||
        t.closest(".facenav") ||
        t.closest(".face-card")
      )
        return;
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

  /* ── boucle : rotation du cube, parallaxe souris, ouverture des faces ── */
  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));

    const s = state.current;
    const reduceMotion = reduceRef.current;
    if (reduceMotion) s.exp = 1;

    const startTimer = window.setTimeout(() => (s.started = true), 80);

    const cube = cubeRef.current;
    const center = centerRef.current;
    if (!cube || !center) return;

    const faces = Array.from(cube.querySelectorAll<HTMLElement>(".face"));

    let rafId: number;

    const tick = () => {
      s.cmx += (s.mx - s.cmx) * 0.06;
      s.cmy += (s.my - s.cmy) * 0.06;

      /* le cube reste assemblé — il se desserre pendant qu'une face est
         ouverte, et se pose à l'arrivée sur la page */
      let expTarget = openKeyRef.current ? 1.55 : 1;
      if (!s.started) expTarget = 1.7;
      s.exp += (expTarget - s.exp) * 0.13;
      cube.style.setProperty("--exp", s.exp.toFixed(4));

      s.dim += ((openKeyRef.current ? 0.8 : 1) - s.dim) * 0.08;
      faces.forEach((f) => {
        if (Math.abs(s.dim - 1) > 0.003) f.style.opacity = s.dim.toFixed(3);
        else f.style.removeProperty("opacity");
      });

      /* rotation : orientation vers la face ouverte, ou rotation lente */
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
          s.rotY += reduceMotion ? 0.04 : 0.12;
          s.rotX += (-12 - s.rotX) * 0.012;
        }
      }
      cube.style.transform = `rotateX(${s.rotX}deg) rotateY(${s.rotY}deg)`;

      /* parallaxe souris */
      if (!reduceMotion) {
        center.style.transform = `translate(${s.cmx * 12}px, ${s.cmy * 9}px)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(startTimer);
    };
  }, []);

  return (
    <div ref={stageRef} className={`stage${loaded ? " loaded" : ""}`} id="stage">
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

        <div className="scroll-line" aria-hidden="true" />

        <div
          className={`face-card pos-${activeKey}${openKey ? " open" : ""}`}
          aria-live="polite"
        >
          <button className="fc-close" aria-label="Fermer" onClick={closeFace}>
            ✕
          </button>
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
      </section>
    </div>
  );
}

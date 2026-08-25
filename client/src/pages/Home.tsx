/**
 * Style reminder — Field Manual for Browser Magic:
 * Near-black creative-coding editorial layout, signal-lime actions, mono technical artifacts,
 * and a narrow instructional runway faithful to the supplied Invisibility Cloak Guide reference.
 */
import { useState } from "react";
import {
  ArrowDown,
  Check,
  ChevronRight,
  Clipboard,
  Code2,
  Frame,
  Github,
  Hand,
  Laptop,
  Play,
  ScanLine,
  Sparkles,
  Video,
} from "lucide-react";

type PromptId = "main" | "flicker" | "alignment" | "feather" | "learn";

const prompts: Record<PromptId, string> = {
  main: `Build me a single-file web app (one index.html, everything inline) that creates an "invisibility cloak" effect:

Step 1 — Use my laptop camera (getUserMedia) and stream the live video full-screen onto the page, mirrored like a selfie.

Step 2 — Use Google's free MediaPipe hand-tracking library (load @mediapipe/tasks-vision from the CDN, HandLandmarker, up to 2 hands) to track my fingers in real time.

Step 3 — When both hands are visible, draw a polygon connecting four points: the tips of both index fingers (landmark 8) and both thumbs (landmark 4).

Step 4 — Take one snapshot of the camera the moment the stream starts (that's my empty room). Fill the polygon with the MATCHING section of that snapshot, so whatever is behind me gets painted over my body and I look invisible inside the frame.

Also add: a button to re-take the background snapshot, and comment all the code clearly so I can read through and understand the logic.`,
  flicker:
    "The polygon flickers when my hands move fast. Smooth the fingertip positions over the last few frames so the cloak feels stable.",
  alignment:
    "The background inside the polygon doesn't line up with the real background around it. Make sure the snapshot and the live video are drawn at exactly the same size and mirroring.",
  feather:
    'Soften the edges of the polygon with a slight feather/blur so the cloak blends into the live video instead of having a hard edge.',
  learn:
    "Walk me through this code like I'm an engineer who's never used MediaPipe. What are hand landmarks 4 and 8? How does canvas clipping make the fill only appear inside the polygon? Quiz me at the end.",
};

const processSteps = [
  { icon: Video, label: "Camera" },
  { icon: Hand, label: "Hand tracking" },
  { icon: Frame, label: "Polygon" },
  { icon: Sparkles, label: "Fill with background" },
];

function CopyButton({ id, compact = false }: { id: PromptId; compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompts[id]);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = prompts[id];
      fallback.setAttribute("readonly", "");
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      document.body.removeChild(fallback);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      className={`copy-button ${compact ? "copy-button--compact" : ""} ${copied ? "is-copied" : ""}`}
      onClick={copy}
      aria-label={`Copy ${id} prompt`}
    >
      {copied ? <Check size={compact ? 13 : 15} strokeWidth={2.5} /> : <Clipboard size={compact ? 13 : 15} />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function SectionTag({ children }: { children: string }) {
  return <span className="section-tag">{children}</span>;
}

export default function Home() {
  const scrollToBuild = () => document.getElementById("build")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="guide-shell">
      <header className="site-header">
        <a href="#top" className="brand" aria-label="Invisibility Cloak Guide home">
          <img src="/manus-storage/cloak-aperture-mark_2003c067.png" alt="" className="brand-mark" />
          <span>INVISIBILITY / GUIDE</span>
        </a>
        <button type="button" className="header-cta" onClick={scrollToBuild}>
          <Code2 size={15} />
          Build it
        </button>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-art" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow"><span className="eyebrow-dot" />VIBE-CODED FX · NO TOUCHDESIGNER NEEDED</p>
            <h1 id="page-title">Build your own<br /><em>Invisibility Cloak</em></h1>
            <p className="hero-intro">
              The cinematic hand-frame effect from a reel — built with <strong>zero</strong> new software.
              Just your laptop camera, your browser, and Claude writing the code.
            </p>
            <div className="maker-line"><span>Made by</span> <strong>@kaylanrupa</strong></div>
            <div className="ingredient-row" aria-label="What you need at a glance">
              <span><Sparkles size={14} />Claude</span>
              <span><Laptop size={14} />Laptop camera</span>
              <span><ScanLine size={14} />Any browser</span>
              <span><span className="mini-cash">$</span>100% free</span>
            </div>
            <button type="button" className="primary-action" onClick={scrollToBuild}>
              <Play size={15} fill="currentColor" />
              Read the recipe <ArrowDown size={15} />
            </button>
          </div>
          <div className="hero-index" aria-hidden="true"><span>01</span><i /></div>
        </section>

        <article className="guide-runway">
          <section className="chapter chapter--trick">
            <div className="chapter-heading">
              <SectionTag>The trick</SectionTag>
              <h2>How it actually works</h2>
            </div>
            <div className="chapter-body">
              <p>
                There&apos;s no magic and no AI image generation. The app takes a photo of your <strong>empty room</strong> the moment it starts. Then, wherever you stretch a frame between your fingers, it paints that saved background <strong>back over you.</strong> Empty room on top of your body = you look invisible.
              </p>
              <div className="process-strip" role="list" aria-label="How the invisibility effect works">
                {processSteps.map(({ icon: Icon, label }, index) => (
                  <div className="process-node" role="listitem" key={label}>
                    <span><Icon size={15} /></span><b>{label}</b>
                    {index < processSteps.length - 1 && <ChevronRight className="process-arrow" size={16} />}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="chapter chapter--needs">
            <div className="chapter-heading">
              <SectionTag>Before you start</SectionTag>
              <h2>What you need</h2>
            </div>
            <div className="chapter-body checklist">
              <div className="check-item"><span>1</span><p><strong>Claude</strong> — claude.ai works fine (free tier included). If you use Claude Code, even better: it saves the file for you.</p></div>
              <div className="check-item"><span>2</span><p><strong>A laptop with a webcam</strong> and Chrome, Safari, or any modern browser.</p></div>
              <div className="check-item"><span>3</span><p><strong>Nothing else.</strong> No TouchDesigner, no After Effects, no installs. Google&apos;s hand-tracking tool (MediaPipe) loads free from the web inside your app.</p></div>
            </div>
          </section>

          <section className="chapter chapter--build" id="build">
            <div className="chapter-heading">
              <SectionTag>The build</SectionTag>
              <h2>One prompt does it all</h2>
            </div>
            <div className="chapter-body">
              <p>
                This is the exact recipe from the reel — the same four steps rolled into one copy-paste prompt. Paste it, wait, and Claude gives you a single HTML file.
              </p>
              <div className="prompt-card prompt-card--main">
                <div className="prompt-topline"><span>Paste this into Claude</span><CopyButton id="main" /></div>
                <pre><code>{prompts.main}</code></pre>
              </div>
              <aside className="callout"><i>!</i><p><strong>Take the empty-room snapshot first.</strong> Step out of frame (or duck!) before your camera starts — otherwise, the cloak will paint you back over yourself.</p></aside>
            </div>
          </section>

          <section className="chapter chapter--run">
            <div className="chapter-heading">
              <SectionTag>Run it</SectionTag>
              <h2>Open your app</h2>
            </div>
            <div className="chapter-body">
              <p>Browsers only allow camera access on a proper local address, so don&apos;t just double-click the file.</p>
              <ol className="run-list">
                <li><span>01</span><p>Save Claude&apos;s code as <code>index.html</code> in a new folder.</p></li>
                <li><span>02</span><p>Open Terminal in that folder and run <code>python3 -m http.server 8000</code>.</p></li>
                <li><span>03</span><p>Go to <code>http://localhost:8000</code> in your browser and allow the camera.</p></li>
                <li><span>04</span><p>Step out for the snapshot, come back, make a frame with your fingers — you&apos;re invisible.</p></li>
              </ol>
              <div className="pose-note"><Hand size={19} /><p><b>The pose:</b> thumbs together at the bottom, index fingers up — like you&apos;re framing a photo with both hands. Those four fingertips are the corners of your cloak.</p></div>
            </div>
          </section>

          <section className="chapter chapter--polish">
            <div className="chapter-heading">
              <SectionTag>Polish</SectionTag>
              <h2>Fix the bits that look off</h2>
            </div>
            <div className="chapter-body">
              <p>Mine wasn&apos;t perfect on the first try either. Test it, describe the issue precisely, and use one of these refinements.</p>
              <div className="prompt-stack">
                <div className="prompt-card prompt-card--short"><div className="prompt-topline"><span>If the edges flicker</span><CopyButton id="flicker" compact /></div><p>{prompts.flicker}</p></div>
                <div className="prompt-card prompt-card--short"><div className="prompt-topline"><span>If the patch doesn&apos;t line up</span><CopyButton id="alignment" compact /></div><p>{prompts.alignment}</p></div>
                <div className="prompt-card prompt-card--short"><div className="prompt-topline"><span>If it looks too “cut out”</span><CopyButton id="feather" compact /></div><p>{prompts.feather}</p></div>
              </div>
            </div>
          </section>

          <section className="chapter chapter--learn">
            <div className="chapter-heading">
              <SectionTag>The engineer bit</SectionTag>
              <h2>Actually understand it</h2>
            </div>
            <div className="chapter-body engineer-body">
              <div className="engineer-art" aria-hidden="true" />
              <div className="engineer-copy">
                <p>Don&apos;t stop at “it works.” The prompt already asks Claude to comment every block — now <strong>read them.</strong> Then test yourself:</p>
                <div className="prompt-card prompt-card--learn"><div className="prompt-topline"><span>Ask Claude</span><CopyButton id="learn" /></div><p>{prompts.learn}</p></div>
                <p className="closing-line">Because as an engineer, you don&apos;t just want it to work — you want to know <em>how.</em></p>
              </div>
            </div>
          </section>
        </article>
      </main>

      <footer className="site-footer">
        <div><img src="/manus-storage/cloak-aperture-mark_2003c067.png" alt="" /><span>BUILD STRANGE THINGS IN THE BROWSER.</span></div>
        <a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to top <ArrowDown size={14} /></a>
      </footer>
    </div>
  );
}

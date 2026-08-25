/**
 * Style reminder — Retro-OS Cloak Utility:
 * Use the supplied Retro-OS kit as ground truth: off-white scanline workspace, blue title bars,
 * 1px black borders, bitmap-like typography, and squared system controls around the live effect.
 */
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Aperture,
  Camera,
  Check,
  ChevronRight,
  CircleHelp,
  Hand,
  LoaderCircle,
  Maximize2,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  VideoOff,
  X,
} from "lucide-react";

type Point = { x: number; y: number };
type AppState = "idle" | "loading" | "active" | "error";
type TrackingState = "idle" | "searching" | "ready" | "cloak";

const VISION_MODULE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm";
const WASM_ROOT = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const HAND_MODEL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task";

function drawMirrored(context: CanvasRenderingContext2D, source: CanvasImageSource, width: number, height: number) {
  context.save();
  context.translate(width, 0);
  context.scale(-1, 1);
  context.drawImage(source, 0, 0, width, height);
  context.restore();
}

function drawPolygon(context: CanvasRenderingContext2D, points: Point[]) {
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) context.lineTo(points[index].x, points[index].y);
  context.closePath();
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const maskRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const landmarkerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const smoothedPolygonRef = useRef<Point[] | null>(null);
  const trackingStateRef = useRef<TrackingState>("idle");
  const handCountRef = useRef(0);
  const backgroundCapturedRef = useRef(false);
  const mountedRef = useRef(true);

  const [appState, setAppState] = useState<AppState>("idle");
  const [trackingState, setTrackingState] = useState<TrackingState>("idle");
  const [handCount, setHandCount] = useState(0);
  const [backgroundCaptured, setBackgroundCaptured] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Camera is off. Step out of frame, then start the camera.");
  const [errorMessage, setErrorMessage] = useState("");

  const updateTrackingState = (next: TrackingState) => {
    if (trackingStateRef.current !== next) {
      trackingStateRef.current = next;
      setTrackingState(next);
    }
  };

  const updateHandCount = (next: number) => {
    if (handCountRef.current !== next) {
      handCountRef.current = next;
      setHandCount(next);
    }
  };

  const captureBackground = () => {
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return false;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return false;

    const background = backgroundRef.current;
    background.width = width;
    background.height = height;
    const backgroundContext = background.getContext("2d");
    if (!backgroundContext) return false;
    backgroundContext.clearRect(0, 0, width, height);
    drawMirrored(backgroundContext, video, width, height);
    backgroundCapturedRef.current = true;
    setBackgroundCaptured(true);
    setStatusMessage("Background captured. Step into frame and show both hands.");
    updateTrackingState("searching");
    return true;
  };

  const normalizeHandToPoint = (landmark: { x: number; y: number }, width: number, height: number): Point => ({
    x: (1 - landmark.x) * width,
    y: landmark.y * height,
  });

  const renderFrame = () => {
    const video = videoRef.current;
    const output = canvasRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !output || !landmarker || !streamRef.current || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      animationRef.current = window.requestAnimationFrame(renderFrame);
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) {
      animationRef.current = window.requestAnimationFrame(renderFrame);
      return;
    }

    if (output.width !== width || output.height !== height) {
      output.width = width;
      output.height = height;
      maskRef.current.width = width;
      maskRef.current.height = height;
    }

    const outputContext = output.getContext("2d");
    const maskContext = maskRef.current.getContext("2d");
    if (!outputContext || !maskContext) {
      animationRef.current = window.requestAnimationFrame(renderFrame);
      return;
    }

    outputContext.clearRect(0, 0, width, height);
    drawMirrored(outputContext, video, width, height);

    let detectedHands: any[] = [];
    try {
      const result = landmarker.detectForVideo(video, performance.now());
      detectedHands = result.landmarks ?? [];
    } catch {
      detectedHands = [];
    }
    updateHandCount(detectedHands.length);

    const background = backgroundRef.current;
    const hasMatchingBackground = background.width === width && background.height === height;
    if (detectedHands.length >= 2 && hasMatchingBackground) {
      const handPairs = detectedHands
        .slice(0, 2)
        .map((hand) => ({
          index: normalizeHandToPoint(hand[8], width, height),
          thumb: normalizeHandToPoint(hand[4], width, height),
        }))
        .sort((a, b) => a.index.x - b.index.x);
      const targetPolygon = [handPairs[0].index, handPairs[1].index, handPairs[1].thumb, handPairs[0].thumb];
      const priorPolygon = smoothedPolygonRef.current;
      const polygon = targetPolygon.map((point, index) => {
        const prior = priorPolygon?.[index];
        return prior
          ? { x: prior.x + (point.x - prior.x) * 0.31, y: prior.y + (point.y - prior.y) * 0.31 }
          : point;
      });
      smoothedPolygonRef.current = polygon;

      maskContext.clearRect(0, 0, width, height);
      maskContext.save();
      maskContext.filter = `blur(${Math.max(3, Math.round(width / 420))}px)`;
      maskContext.fillStyle = "#ffffff";
      drawPolygon(maskContext, polygon);
      maskContext.fill();
      maskContext.restore();
      maskContext.globalCompositeOperation = "source-in";
      maskContext.drawImage(background, 0, 0, width, height);
      maskContext.globalCompositeOperation = "source-over";
      outputContext.drawImage(maskRef.current, 0, 0, width, height);

      outputContext.save();
      outputContext.lineWidth = Math.max(1.5, width / 780);
      outputContext.strokeStyle = "rgba(124, 255, 107, 0.9)";
      outputContext.shadowColor = "rgba(124, 255, 107, 0.72)";
      outputContext.shadowBlur = Math.max(4, width / 175);
      drawPolygon(outputContext, polygon);
      outputContext.stroke();
      polygon.forEach((point) => {
        outputContext.beginPath();
        outputContext.fillStyle = "#7cff6b";
        outputContext.arc(point.x, point.y, Math.max(3, width / 210), 0, Math.PI * 2);
        outputContext.fill();
      });
      outputContext.restore();
      updateTrackingState("cloak");
      setStatusMessage("Cloak active. Keep your index fingers high and thumbs together.");
    } else {
      smoothedPolygonRef.current = null;
      if (backgroundCapturedRef.current) {
        updateTrackingState(detectedHands.length ? "ready" : "searching");
        if (detectedHands.length < 2) setStatusMessage("Show both hands to make a four-corner frame.");
        else setStatusMessage("Two hands found. Bring index fingers up and thumbs together.");
      }
    }

    animationRef.current = window.requestAnimationFrame(renderFrame);
  };

  const loadHandLandmarker = async () => {
    if (landmarkerRef.current) return;
    const tasksVision = await import(/* @vite-ignore */ VISION_MODULE);
    const vision = await tasksVision.FilesetResolver.forVisionTasks(WASM_ROOT);
    landmarkerRef.current = await tasksVision.HandLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: HAND_MODEL, delegate: "GPU" },
      runningMode: "VIDEO",
      numHands: 2,
      minHandDetectionConfidence: 0.55,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.55,
    });
  };

  const startCamera = async () => {
    if (appState === "loading") return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setAppState("error");
      setErrorMessage("This browser does not expose webcam access. Open the app over HTTPS or localhost in a current browser.");
      return;
    }

    setAppState("loading");
    setErrorMessage("");
    setStatusMessage("Loading hand tracking and requesting camera access…");
    try {
      await loadHandLandmarker();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error("The camera preview could not initialize.");
      video.srcObject = stream;
      await video.play();
      await new Promise((resolve) => window.setTimeout(resolve, 180));
      captureBackground();
      setAppState("active");
      updateTrackingState("searching");
      animationRef.current = window.requestAnimationFrame(renderFrame);
    } catch (error) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setAppState("error");
      const name = error instanceof DOMException ? error.name : "";
      setErrorMessage(
        name === "NotAllowedError"
          ? "Camera permission was blocked. Allow camera access in your browser settings, then try again."
          : "The camera or hand-tracking model could not start. Check your connection, then try again.",
      );
      setStatusMessage("Camera unavailable.");
    }
  };

  const stopCamera = () => {
    if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    const output = canvasRef.current;
    output?.getContext("2d")?.clearRect(0, 0, output.width, output.height);
    backgroundRef.current.width = 0;
    backgroundRef.current.height = 0;
    smoothedPolygonRef.current = null;
    backgroundCapturedRef.current = false;
    setAppState("idle");
    setBackgroundCaptured(false);
    setHandCount(0);
    handCountRef.current = 0;
    updateTrackingState("idle");
    setStatusMessage("Camera is off. Step out of frame, then start the camera.");
  };

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      landmarkerRef.current?.close?.();
    };
  }, []);

  const appIsActive = appState === "active";
  const stageLabel = appState === "loading" ? "INITIALIZING" : appIsActive ? "LIVE CAMERA" : appState === "error" ? "SETUP BLOCKED" : "CAMERA OFF";
  const trackingLabel = trackingState === "cloak" ? "CLOAK ACTIVE" : trackingState === "ready" ? "ALIGNING HANDS" : trackingState === "searching" ? "SEARCHING" : "STANDBY";

  return (
    <div className="cloak-app">
      <video ref={videoRef} className="camera-source" playsInline muted aria-hidden="true" />
      <header className="app-header">
        <a className="app-brand" href="#top" aria-label="Now You See Me application home">
          <span className="app-logo-mark" aria-hidden="true" />
          <span>NOWYOUSEEME.EXE</span>
        </a>
        <div className="header-status"><span className={appIsActive ? "status-lamp status-lamp--live" : "status-lamp"} />{appIsActive ? "CAMERA CONNECTED" : "SYSTEM READY"}</div>
      </header>

      <main id="top" className="app-main">
        <section className="app-intro" aria-labelledby="app-title">
          <p className="eyebrow"><span />CAMERA MASK UTILITY · V1.0</p>
          <h1 id="app-title">NOW YOU<br />SEE ME</h1>
          <p>Capture the room, step back in, then frame the space between your hands. The canvas restores your original background inside the polygon.</p>
        </section>

        <section className="cloak-stage" aria-label="Live invisibility cloak camera stage">
          <div className="stage-corners" aria-hidden="true"><i /><i /><i /><i /></div>
          <canvas ref={canvasRef} className={`camera-canvas ${appIsActive ? "is-live" : ""}`} />
          {!appIsActive && appState !== "loading" && (
            <div className="stage-placeholder">
              {appState === "error" ? <AlertTriangle size={33} /> : <Aperture size={38} />}
              <p className="placeholder-kicker">{appState === "error" ? "CAMERA SETUP NEEDS ATTENTION" : "VIEWFINDER / OFFLINE"}</p>
              <strong>{appState === "error" ? "Permission or setup issue" : "Awaiting camera input"}</strong>
              <span>{appState === "error" ? errorMessage : "Step out of frame before starting so the first snapshot has no subject in it."}</span>
            </div>
          )}
          {appState === "loading" && (
            <div className="stage-placeholder stage-placeholder--loading"><LoaderCircle size={34} className="spin" /><strong>Warming up the hand tracker</strong><span>Requesting the camera and downloading the local model.</span></div>
          )}
          <div className="stage-hud">
            <div><span className={appIsActive ? "hud-live-dot" : "hud-dot"} />{stageLabel}</div>
            <div className={`tracking-chip tracking-chip--${trackingState}`}><ScanLine size={13} />{trackingLabel}</div>
          </div>
          <div className="hand-meter"><Hand size={14} /><span><strong>{Math.min(handCount, 2)}</strong> / 2 HANDS</span></div>
          <div className="resolution-meter"><Maximize2 size={13} />MIRRORED VIEW</div>
        </section>

        <section className="control-deck" aria-label="Camera controls">
          <div className="control-status" aria-live="polite">
            <span className={`signal-disc signal-disc--${trackingState}`} />
            <p><b>{trackingState === "cloak" ? "Effect running" : appState === "loading" ? "Setting up" : "System note"}</b>{statusMessage}</p>
          </div>
          <div className="control-actions">
            {!appIsActive ? (
              <button type="button" className="button button--primary" onClick={startCamera} disabled={appState === "loading"}>
                {appState === "loading" ? <LoaderCircle className="spin" size={16} /> : <Camera size={16} />}
                {appState === "error" ? "Try camera again" : "Start camera"}
              </button>
            ) : (
              <>
                <button type="button" className="button button--primary" onClick={captureBackground}><RefreshCw size={16} />Retake background</button>
                <button type="button" className="button button--quiet" onClick={stopCamera}><VideoOff size={15} />Stop</button>
              </>
            )}
          </div>
        </section>

        <section className="live-guide" aria-label="How to use the live effect">
          <div className="guide-title"><CircleHelp size={16} /><span>HOW TO MAKE THE WINDOW</span></div>
          <div className="live-steps">
            <div><b>01</b><p><strong>Start empty.</strong> Leave the frame before the initial snapshot.</p></div>
            <ChevronRight size={16} />
            <div><b>02</b><p><strong>Step back in.</strong> Raise both index fingers and join your thumbs below.</p></div>
            <ChevronRight size={16} />
            <div><b>03</b><p><strong>Hold the frame.</strong> The green outline means your cloak is active.</p></div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span><ShieldCheck size={14} />Your video stays in this browser session.</span>
        <span>CAMERA · HANDS · POLYGON · BACKGROUND</span>
      </footer>
    </div>
  );
}

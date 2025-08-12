import { createVideoHandler } from "./videoHandler.js";

const canvas = document.getElementById("videoCanvas");
const ctx = canvas.getContext("2d");
const loadingDiv = document.getElementById("loading");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const lever = document.getElementById("throttle-lever");
const leverTrack = document.getElementById("lever-track");
const handle = document.getElementById("lever-handle");
const brakeBtn = document.querySelector(".brake");
const hornBtn = document.querySelector(".horn");

let frames = [];
let currentFrame = 0;
let frameRate = 30;
let speedMultiplier = 0;
let lastTime = 0;

const throttleStates = ["-3/3", "-2/3", "-1/3", "0", "1/3", "2/3", "3/3"];
let throttleIndex = 3; // start at '0'

const videoHandler = createVideoHandler((newSpeed) => {
  speedMultiplier = newSpeed;
});

function setThrottleByIndex(index) {
  throttleIndex = Math.max(0, Math.min(throttleStates.length - 1, index));
  const levelStr = throttleStates[throttleIndex];
  videoHandler.setThrottle(levelStr);
  positionHandleByLevel(parseInt(levelStr) || 0);
}

function positionHandleByLevel(level) {
  const trackRect = leverTrack.getBoundingClientRect();
  const H = trackRect.height;
  const handleH = handle.offsetHeight;
  const normalized = (level + 3) / 6;
  const y = H * (1 - normalized);
  const top = Math.max(0, Math.min(y - handleH / 2, H - handleH));
  handle.style.top = `${top}px`;
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp") {
    setThrottleByIndex(throttleIndex + 1);
  } else if (e.code === "ArrowDown") {
    setThrottleByIndex(throttleIndex - 1);
  } else if (e.code === "Space") {
    videoHandler.applyBrake();
    throttleIndex = 3;
    positionHandleByLevel(0);
  } else if (e.code === "KeyH") {
    videoHandler.playHorn();
  }
});

// Mouse drag for lever
let dragging = false;
handle.addEventListener("pointerdown", (ev) => {
  dragging = true;
  handle.setPointerCapture(ev.pointerId);
});
handle.addEventListener("pointerup", (ev) => {
  dragging = false;
  handle.releasePointerCapture(ev.pointerId);
});
handle.addEventListener("pointermove", (ev) => {
  if (!dragging) return;
  const rect = leverTrack.getBoundingClientRect();
  let y = Math.max(0, Math.min(ev.clientY - rect.top, rect.height));
  const level = Math.round(((rect.height - y) / rect.height) * 6 - 3);
  const idx = throttleStates.indexOf(level === 0 ? "0" : `${level}/3`);
  if (idx !== -1) {
    setThrottleByIndex(idx);
  }
});

// Brake + Horn buttons
brakeBtn.addEventListener("click", () => {
  videoHandler.applyBrake();
  throttleIndex = 3;
  positionHandleByLevel(0);
});
hornBtn.addEventListener("click", () => {
  videoHandler.playHorn();
});

// Load frames
async function loadFrames() {
  try {
    const resp = await fetch('/frames');
    const data = await resp.json();
    frameRate = data.frame_rate;
    const totalFrames = data.total_frames;

    frames = data.frames.map(url => {
        const img = new Image();
        img.src = url;
        return img;
    });

    let loaded = 0;
    await Promise.all(
      frames.map(
        (img) =>
          new Promise((res) => {
            img.onload = () => {
              loaded++;
              progressFill.style.width = `${(loaded / totalFrames) * 100}%`;
              progressText.textContent = `${Math.floor(
                (loaded / totalFrames) * 100
              )}%`;
              res();
            };
            img.onerror = () => res();
          })
      )
    );

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    canvas.style.display = "block";
    lever.style.display = "flex";
    loadingDiv.style.display = "none";

    positionHandleByLevel(0);
    startAnimation();
  } catch (err) {
    loadingDiv.textContent = `Error: ${err.message}`;
  }
}

function startAnimation() {
  function animate(time) {
    if (!lastTime) lastTime = time;
    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;

    const frameIncrement = speedMultiplier * deltaTime * frameRate;
    currentFrame += frameIncrement;

    if (currentFrame >= frames.length) currentFrame = 0;
    else if (currentFrame < 0) currentFrame = frames.length - 1;

    const frameIndex = Math.floor(currentFrame) % frames.length;
    if (frames[frameIndex]?.complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(frames[frameIndex], 0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

loadFrames();


//content protection 
function stopPlague() {
    // Disable right-click
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
    document.addEventListener("keydown", function (e) {
        if (
            e.key === "F12" ||
            (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) ||
            (e.ctrlKey && ["c","u","p","s"].includes(e.key.toLowerCase()))
        ) {
            e.preventDefault();
        }
    });
};

stopPlague();
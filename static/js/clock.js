(function () {
  "use strict";

  const face = document.querySelector(".clock-face");
  const hourHand = document.querySelector(".hour-hand");
  const minuteHand = document.querySelector(".minute-hand");
  const secondHand = document.querySelector(".second-hand");
  const status = document.getElementById("status");
  const tzEl = document.getElementById("tz");
  const clock = document.querySelector(".clock");

  // Build hour markers
  if (face) {
    for (let i = 0; i < 12; i++) {
      const m = document.createElement("div");
      m.className = "marker" + (i % 3 === 0 ? " major" : "");
      m.style.transform = "rotate(" + i * 30 + "deg)";
      face.appendChild(m);
    }
  }

  let offsetMs = 0; // estimatedServerTime - clientTime
  let hasSync = false;

  async function sync() {
    const t0 = performance.now();
    try {
      const res = await fetch("/api/time", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const t1 = performance.now();
      const wall1 = Date.now();
      const rtt = t1 - t0;
      const serverMs = data.timestamp * 1000;
      // Estimate server time at the midpoint of the request.
      const estimatedServer = serverMs + rtt / 2;
      offsetMs = estimatedServer - wall1;
      hasSync = true;
      if (status) status.textContent = "Synchronizováno se serverem";
      if (tzEl && data.timezone) tzEl.textContent = data.timezone;
    } catch (e) {
      if (status) status.textContent = "Offline – lokální čas";
    }
  }

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const now = new Date(Date.now() + offsetMs);
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ms = now.getMilliseconds();

    const secondDeg = (s + ms / 1000) * 6;
    const minuteDeg = (m + (s + ms / 1000) / 60) * 6;
    const hourDeg = ((h % 12) + (m + (s + ms / 1000) / 60) / 60) * 30;

    if (secondHand) secondHand.style.transform = "rotate(" + secondDeg + "deg)";
    if (minuteHand) minuteHand.style.transform = "rotate(" + minuteDeg + "deg)";
    if (hourHand) hourHand.style.transform = "rotate(" + hourDeg + "deg)";

    if (clock) {
      clock.setAttribute(
        "aria-label",
        "Čas serveru: " + pad(h) + ":" + pad(m) + ":" + pad(s)
      );
    }
  }

  // Initial sync, then re-sync every 60s.
  sync();
  setInterval(sync, 60000);

  // Smooth animation loop.
  function loop() {
    tick();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

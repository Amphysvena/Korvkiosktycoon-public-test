// gameLoop.js
const updateCallbacks = new Set();

let lastTick = Date.now();

// Main global loop — 30 Hz (every ~33ms)
setInterval(() => {
  const now = Date.now();
  const delta = now - lastTick;  // ms since last tick
  lastTick = now;

  // Run all registered callbacks
  updateCallbacks.forEach(fn => {
    try {
      fn(delta);
    } catch (err) {
      console.error("Error in gameLoop update:", err);
    }
  });

}, 1000 / 30);

// Allow other modules to register a callback
export function registerUpdateCallback(fn) {
  updateCallbacks.add(fn);
}

// Allow removal (optional)
export function unregisterUpdateCallback(fn) {
  updateCallbacks.delete(fn);
}


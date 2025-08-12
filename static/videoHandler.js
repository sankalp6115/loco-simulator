// videoHandler.js
const throttleMap = {
  '3/3': 4,
  '2/3': 3,
  '1/3': 2,
  '0': 0,
  '-1/3': -2,
  '-2/3': -3,
  '-3/3': -4
};

export function createVideoHandler(setSpeed) {
  let currentThrottle = '0';
  let targetSpeed = 0;
  let speedMultiplier = 0;
  let accelInterval = null;

  function updateSpeed() {
    setSpeed(speedMultiplier);
  }

  function startAccelerationTo(target) {
    clearInterval(accelInterval);
    accelInterval = setInterval(() => {
      if (speedMultiplier === target) return clearInterval(accelInterval);

      const delta = 0.1 * Math.sign(target - speedMultiplier);
      speedMultiplier = parseFloat((speedMultiplier + delta).toFixed(2));

      if (Math.abs(speedMultiplier - target) < 0.1) {
        speedMultiplier = target;
        clearInterval(accelInterval);
      }
      updateSpeed();
    }, 50);
  }

  function setThrottle(throttleLevel) {
    const desiredSpeed = throttleMap[throttleLevel];
    if (Math.sign(speedMultiplier) !== Math.sign(desiredSpeed) && speedMultiplier !== 0) {
      // Reverse direction? Decelerate to 0 first
      startAccelerationTo(0);
      setTimeout(() => startAccelerationTo(desiredSpeed), 1000);
    } else {
      startAccelerationTo(desiredSpeed);
    }
    currentThrottle = throttleLevel;
  }

  function applyBrake() {
    startAccelerationTo(0);
    currentThrottle = '0';
  }

  function playHorn() {
    const horn = new Audio('static/horn.mp3');
    horn.play()
    setTimeout(() => {
      horn.pause();
    }, 4000);
  }

  return { setThrottle, applyBrake, playHorn };
}

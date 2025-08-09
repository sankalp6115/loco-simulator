// controlsHandler.js
export function initControls(videoHandler) {
  const throttleLevels = ['3/3', '2/3', '1/3', '-1/3', '-2/3', '-3/3'];
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.right = '20px';
  container.style.top = '50%';
  container.style.transform = 'translateY(-50%)';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '10px';
  container.style.zIndex = 999;

  const throttleButtons = {};

  throttleLevels.forEach(level => {
    const btn = document.createElement('button');
    btn.textContent = level;
    btn.dataset.level = level;
    btn.className = 'throttle-button';
    btn.onclick = () => {
      videoHandler.setThrottle(level);
      updateActiveButton(level);
    };
    throttleButtons[level] = btn;
    container.appendChild(btn);
  });

  const brakeBtn = document.createElement('button');
  brakeBtn.textContent = 'Brake';
  brakeBtn.className = 'control-button brake';
  brakeBtn.onclick = () => {
    videoHandler.applyBrake();
    updateActiveButton('0');
  };

  const hornBtn = document.createElement('button');
  hornBtn.textContent = 'Horn 🚂';
  hornBtn.className = 'control-button horn';
  hornBtn.onclick = () => videoHandler.playHorn();

  container.appendChild(brakeBtn);
  container.appendChild(hornBtn);
  document.body.appendChild(container);

  function updateActiveButton(activeLevel) {
    for (const level in throttleButtons) {
      throttleButtons[level].classList.remove('active-throttle');
    }
    if (throttleButtons[activeLevel]) {
      throttleButtons[activeLevel].classList.add('active-throttle');
    }
  }

  // Keyboard mapping
  const throttleStates = ['-3/3', '-2/3', '-1/3', '0', '1/3', '2/3', '3/3'];
  let index = 3;
  document.addEventListener('keydown', e => {
    if (e.code === 'ArrowUp') {
      index = Math.min(throttleStates.length - 1, index + 1);
      const level = throttleStates[index];
      videoHandler.setThrottle(level);
      updateActiveButton(level);
    } else if (e.code === 'ArrowDown') {
      index = Math.max(0, index - 1);
      const level = throttleStates[index];
      videoHandler.setThrottle(level);
      updateActiveButton(level);
    } else if (e.code === 'Space') {
      videoHandler.applyBrake();
      index = 3;
      updateActiveButton('0');
    } else if (e.code === 'KeyH') {
      videoHandler.playHorn();
    }
  });
}

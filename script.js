const car = document.getElementById("car");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const startStopBtn = document.getElementById("startStopBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");

let carPosition = 125;
let keys = {};
let score = 0;
let gameOver = false;
let paused = false;
let running = false;
let obstacles = [];
let gameLoopId = null;
let obstacleInterval = null;

let leftPressed = false;
let rightPressed = false;

// Keyboard Controls
document.addEventListener("keydown", (e) => {
  if (running && !paused) keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  if (running && !paused) keys[e.key] = false;
});

// Touch / Mouse Controls for arrows
leftArrow.addEventListener("mousedown", () => leftPressed = true);
leftArrow.addEventListener("mouseup", () => leftPressed = false);
leftArrow.addEventListener("touchstart", (e) => { e.preventDefault(); leftPressed = true; });
leftArrow.addEventListener("touchend", (e) => { e.preventDefault(); leftPressed = false; });

rightArrow.addEventListener("mousedown", () => rightPressed = true);
rightArrow.addEventListener("mouseup", () => rightPressed = false);
rightArrow.addEventListener("touchstart", (e) => { e.preventDefault(); rightPressed = true; });
rightArrow.addEventListener("touchend", (e) => { e.preventDefault(); rightPressed = false; });

startStopBtn.addEventListener("click", () => {
  if (!running) {
    startGame();
  } else {
    stopGame();
  }
});
pauseBtn.addEventListener("click", togglePause);
resetBtn.addEventListener("click", resetGame);

function startGame() {
  running = true;
  paused = false;
  gameOver = false;
  score = 0;
  carPosition = 125;
  obstacles.forEach(obs => obs.remove());
  obstacles = [];
  scoreDisplay.textContent = "Score: 0";
  car.style.left = "125px";

  pauseBtn.disabled = false;
  resetBtn.disabled = false;
  startStopBtn.textContent = "■ Stop";
  pauseBtn.textContent = "⏸ Pause";

  obstacleInterval = setInterval(() => {
    if (!paused && !gameOver) createObstacle();
  }, 1000);

  gameLoop();
}

function stopGame() {
  running = false;
  paused = false;
  gameOver = false;
  score = 0;
  keys = {};
  leftPressed = false;
  rightPressed = false;

  clearInterval(obstacleInterval);
  cancelAnimationFrame(gameLoopId);

  obstacles.forEach(obs => obs.remove());
  obstacles = [];

  scoreDisplay.textContent = "Score: 0";
  car.style.left = "125px";
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
  startStopBtn.textContent = "▶ Start";
  pauseBtn.textContent = "⏸ Pause";
}

function togglePause() {
  if (!running) return;

  paused = !paused;
  pauseBtn.textContent = paused ? "▶ Resume" : "⏸ Pause";

  if (!paused) {
    gameLoop();
  } else {
    cancelAnimationFrame(gameLoopId);
  }
}

function moveCar() {
  if (keys["ArrowLeft"] && carPosition > 0) carPosition -= 5;
  if (keys["ArrowRight"] && carPosition < 250) carPosition += 5;

  // Also handle arrow buttons pressed
  if (leftPressed && carPosition > 0) carPosition -= 5;
  if (rightPressed && carPosition < 250) carPosition += 5;

  // Clamp carPosition within 0-250
  carPosition = Math.max(0, Math.min(carPosition, 250));

  car.style.left = carPosition + "px";
}

function createObstacle() {
  const obs = document.createElement("div");
  obs.classList.add("obstacle");
  obs.style.left = `${Math.floor(Math.random() * 6) * 50}px`;
  obs.style.top = "-100px";
  gameArea.appendChild(obs);
  obstacles.push(obs);
}

function moveObstacles() {
  obstacles.forEach((obs, index) => {
    const top = parseInt(obs.style.top.replace("px", ""));
    obs.style.top = (top + 5) + "px";

    const obsLeft = parseInt(obs.style.left.replace("px", ""));

    if (
      top > 390 &&
      top < 500 &&
      Math.abs(carPosition - obsLeft) < 50
    ) {
      alert("💥 Game Over! Your score: " + score);
      gameOver = true;
      paused = true;
      pauseBtn.textContent = "▶ Resume";
      cancelAnimationFrame(gameLoopId);
    }

    if (top > 500) {
      obstacles.splice(index, 1);
      obs.remove();
    }
  });
}

function updateScore() {
  score++;
  scoreDisplay.textContent = "Score: " + score;
}

function gameLoop() {
  if (paused || gameOver || !running) return;

  moveCar();
  moveObstacles();
  updateScore();

  gameLoopId = requestAnimationFrame(gameLoop);
}

function resetGame() {
  if (!running) return;

  carPosition = 125;
  score = 0;
  gameOver = false;
  paused = false;
  keys = {};
  leftPressed = false;
  rightPressed = false;

  obstacles.forEach(obs => obs.remove());
  obstacles = [];

  scoreDisplay.textContent = "Score: 0";
  car.style.left = "125px";
  pauseBtn.textContent = "⏸ Pause";

  if (!paused) {
    gameLoop();
  }
}

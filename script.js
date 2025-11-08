let board;
let board_w = 500;
let board_h = 700;
let context;

let hitSound = new Audio('img/hitSound.wav');
let jumpSound = new Audio('img/jumpSound.wav');
let pointSound = new Audio('img/pointSound.wav');

let playerWidth = 60;
let playerHeight = 60;

let player_x = board_w / 2 - playerWidth/2;
let player_y = 350;

let pipeWidth = 80;
let pipeHeight = 360;
let pipeX = board_w + 50;
let pipeY = getRandomInt(50, 400);
let pipeGap = 170;
let pipeVelocity = -3;
let pipePassed = false;
let score = 0;

let musicList = [
    new Audio('img/pw.wav'),
    new Audio('img/SN.mp3'),
    new Audio('img/pw.mp3'),
    new Audio('img/TMWSTW.mp3'),
    new Audio('img/HD.mp3')
];

let bgX = 0;
let bgScrollSpeed = 1.5;
let bgWidth = 500;

let gameStarted = false;

let playerImg, pipeUpImg, pipeDownImg, bgImg;

window.onload = function() {
  board = document.getElementById("board");
  board.height = board_h;
  board.width = board_w;
  context = board.getContext("2d");

  bgImg = new Image();
  bgImg.src = "img/bgImg.png";

  playerImg = new Image();
  playerImg.src = "img/playerImg.png";

  pipeUpImg = new Image();
  pipeUpImg.src = "img/pipeUpImg.png";

  pipeDownImg = new Image();
  pipeDownImg.src = "img/pipeDownImg.png";

  requestAnimationFrame(update);
  document.addEventListener("keydown", jump);
}

function update() {
  requestAnimationFrame(update);

  bgX -= bgScrollSpeed;
  if (bgX <= -bgWidth) bgX = 0;

  if (gameStarted) {
    velocity += 0.25;
    player_y += velocity;
    pipeX += pipeVelocity;
  }

  if (pipeX < -pipeWidth) {
    pipeRespawn();
  }

  if (
    checkCollision(player_x + 3, player_y + 3, 50, 50, pipeX, pipeY - pipeHeight, pipeWidth, pipeHeight) ||
    checkCollision(player_x + 3, player_y + 3, 50, 50, pipeX, pipeY + pipeGap, pipeWidth, pipeHeight)
  ) {
    gameOver();
  }

  if (!pipePassed && player_x > pipeX) {
    score += 1;
    pipePassed = true;
    pointSound.play();
  }

  context.clearRect(0, 0, board.width, board.height);

  context.drawImage(bgImg, bgX, 0, bgWidth, board_h);
  context.drawImage(bgImg, bgX + bgWidth, 0, bgWidth, board_h);

  context.drawImage(playerImg, player_x, player_y, playerWidth, playerHeight);

  context.drawImage(pipeDownImg, pipeX, 0 - pipeHeight + pipeY, pipeWidth, pipeHeight);
  context.drawImage(pipeUpImg, pipeX, pipeY + pipeGap, pipeWidth, pipeHeight);

  if (player_y < -playerHeight || player_y > board_h - playerHeight) {
    gameOver();
  }

  context.fillStyle = "red";
  context.font = "60px Times New Roman";
  context.fillText(score, board_w/2 - 30, 80);
}

function jump(event) {
  if (!gameStarted){
    gameStarted = true;
    currentMusic.play();
  }
  if (event.code === "Space") {
    velocity = -6;
    jumpSound.currentTime = 0;
    jumpSound.play();
  }
}

function gameOver() {
  player_x = board_w / 2 - playerWidth/2;
  player_y = 350;
  score = 0;
  gameStarted = false;
  pipeReset();
  hitSound.play();
}

function pipeRespawn() {
  pipeX = board_w + 50;
  pipeY = getRandomInt(50, 400);
  pipePassed = false;
}

function pipeReset() {
  pipeX = board_w + 50;
  pipeY = getRandomInt(50, 400);
  pipePassed = false;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 &&
         x2 < x1 + w1 &&
         y1 < y2 + h2 &&
         y2 < y1 + h1;
}

musicList.forEach(music => {
    music.loop = true;
    music.volume = 0.3;
});

let currentMusic = musicList[0];

const changeBtn = document.getElementById("changeMusicBtn");
changeBtn.addEventListener("click",(event) => {
    let randNum = Math.floor(Math.random() * 5);
    event.stopPropagation();
    if (currentMusic) currentMusic.pause();
    currentMusic = musicList[randNum];
    currentMusic.play();
});

changeBtn.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();
    }
});

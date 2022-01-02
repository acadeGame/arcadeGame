const playGame = document.getElementById('playGame');
let ctx = playGame.getContext('2d');

const gameBoxCont = document.querySelector('.game-box');
const gameScoreCont = document.querySelector('.show-score');
const gameOverCont = document.querySelector('.game-over');
const nextPlayBtn = document.querySelector('.next-btn');
const gameScore = document.querySelector('#score1');
const gameOverScore = document.querySelector('#score2');

// 캔버스 크기 설정
playGame.width = 550;
playGame.height = 460;

// 공 클래스(그리기, 움직이기)
let ballSpeed = 4;
class Ball {
  constructor() {
    this.size = 15;
    this.x = playGame.width / 2;
    this.y = playGame.height - 100;
    this.xSpeed = ballSpeed;
    this.ySpeed = -ballSpeed;
  }
  draw(){
    displayFlex(gameBoxCont);
    ctx.beginPath();
    ctx.fillStyle = '#FFFFFF';
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
  move(paddle) {
    if(this.x + this.size >= playGame.width || this.x - this.size <= 0) {
      this.xSpeed *= -1;
    }
    if(this.y - this.size <= 0) {
      this.ySpeed *= -1;
    }
    else if(this.x >= paddle.x && this.x <= paddle.x + paddle.wSize && this.y + this.ySpeed == paddle.y) {
      this.ySpeed *= -1;
    }
    else if(this.y + this.ySpeed > playGame.height - this.size) {
      if(!playerLife) {
        gameOver();
      } else {
          playerLife--;
          this.x = playGame.width / 2;
          this.y = playGame.height - 100;
          this.xSpeed = ballSpeed;
          this.ySpeed = -ballSpeed;
          paddle.x = (playGame.width - paddle.wSize)/2;
      }
    }
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
}

let rightSwitch = false;
let leftSwitch = false;

// 패들(생성, 이동)
class Paddle {
  constructor(){
    this.wSize = 120;
    this.hSize = 25;
    this.x = (playGame.width - this.wSize)/ 2;
    this.y = playGame.height - 40;
  }
  draw(){
    this.move();
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.wSize, this.hSize);
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#111D28';
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.closePath();
  }
  move() {
    if(rightSwitch) {
      if (this.x + this.wSize < playGame.width){
        this.x += 9;
      }  
    } else if(leftSwitch) {
      if (this.x >= 0){
        this.x -= 9;
      }
    } 
  }
}

// 벽돌(생성, 위치 잡기, 공이랑 부딪혔는지 확인, 벽돌의 목숨 설정(0 ~ 2))
const brickWidth = 75;
const brickHeight = 30;
const brickPadding = 10;
const brickOffsetTop = 40;
const brickOffsetLeft = 25;
const bricksArr = [];
let brickCount = 0;
let brickRow = 2;
let brickColumn = 6;

// 벽돌을 생성하는 함수
function setBricks() {
  for(let col = 0; col < brickColumn; col++) {
    bricksArr[col] = [];
    for(let row = 0; row < brickRow; row++) {
      bricksArr[col][row] = { x: 0, y: 0, brickLife: Math.floor(Math.random() * 3) };
      brickCount += bricksArr[col][row].brickLife;
    } 
  }
}

// 행마다 설정해줄 벽돌의 색상 배열
const bicksColorArr = [
  '#05C343',
  '#D30404',
  '#1D6CE2',
  '#F139F7',
  '#E3A508',
  '#85D914'
];

setBricks();

// 벽돌 그리는 함수
function drawBricks() {
  for(let col = 0; col < brickColumn; col++) {
    for(let row = 0; row < brickRow; row++) {
      if(bricksArr[col][row].brickLife >= 1 ){
        let brickX = (col * (brickWidth + brickPadding) + brickOffsetLeft);
        let brickY = (row * (brickHeight + brickPadding) + brickOffsetTop);
        bricksArr[col][row].x = brickX;
        bricksArr[col][row].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.strokeStyle = 'rgb(240, 240, 240)';
        ctx.stroke();
        if(bricksArr[col][row].brickLife == 2) {
          ctx.lineWidth = 2;
          ctx.fillStyle = bicksColorArr[row];
        } else {
          ctx.globalAlpha = 0.4;
          ctx.fillStyle = bicksColorArr[row];
        }
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;
      }
    }
  }
}

// 공과 부딪혔을 때 실행할 함수
function collisionCheck(ball) {
  for(let col = 0; col < brickColumn; col++) {
    for(let row = 0; row < brickRow; row++) {
      let brick = bricksArr[col][row];
      if(brick.brickLife >= 1 ){
        if(ball.x > brick.x && ball.x < brick.x + brickWidth && ball.y > brick.y && ball.y < brick.y+brickHeight) {
          ball.ySpeed *= -1;
          brick.brickLife -= 1;
          brickCount -= 1;
          if(brick.brickLife <=0) {
            score += 1;
          }
          if(brickCount == 0) {
            showScore();
          }
        }
      }
    }
  }
}

// Score(점수 설정, 점수 출력)
let score = 0;
let playerLife = 3;
let playLevel = 1;

function showPlayValue() {
  ctx.font = '18px Arial';
  ctx.fillStyle = "white";
  ctx.fillText('SCORE: '+ score, 15, 25);
  ctx.fillText('LIFE: '+ playerLife, 475, 25);
  ctx.fillText('LEVEL '+ playLevel, 235, 25);
}

function showScore() {
  paused = true;
  gameScore.innerText = score;
  displayFlex(gameScoreCont);
  displayNone(gameBoxCont);
}

// next level div를 누르면 실행되는 함수.
nextPlayBtn.addEventListener(('click'), (e) => {
  paused = false;
  displayNone(gameScoreCont);
  displayFlex(gameBoxCont);
  levelDifficulty();
  setBricks();
});

// 난이도 조절 함수
function levelDifficulty() {
  playerLife += 1;
  playLevel += 1;
  if(brickRow < 6) {
    brickRow += 1;
  }
  if(ballSpeed < 6 && brickRow >= 4) {
    ballSpeed += 1;
  }
  ball.x = playGame.width / 2;
  ball.y = playGame.height - 100;
  ball.xSpeed = ballSpeed;
  ball.ySpeed = -ballSpeed;
  paddle.x = (playGame.width - paddle.wSize)/2;
}

const ball = new Ball();
const paddle = new Paddle();

let timer = 0;
let paused = false;

// 프레임으로 실행되는 Animation 함수
function frame() {
  animation = requestAnimationFrame(frame);
  if(paused) {return;}
  ctx.clearRect(0, 0, playGame.width, playGame.height);
  ball.draw();
  ball.move(paddle);
  paddle.draw();

  drawBricks();
  collisionCheck(ball);
  showPlayValue();
}
frame();

// 패들을 좌우로 이동시키기 위한 방향키 이벤트 리스너
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if(e.key == "ArrowRight") {
    rightSwitch = true;
  }
  else if(e.key == "ArrowLeft") {
    leftSwitch = true;
  }
}

function keyUpHandler(e) {
  if(e.key == "ArrowRight") {
    rightSwitch = false;
  }
  else if(e.key == "ArrowLeft") {
    leftSwitch = false;
  }
}

// 게임오버
function gameOver() {
  cancelAnimationFrame(animation);
  displayNone(gameBoxCont);
  displayNone(gameScoreCont);
  displayFlex(gameOverCont);
  gameOverScore.innerText = score;
  
  document.addEventListener(('keydown'), (e) => {
    if(e.code === 'Space') {
      document.location.reload();
    }
  });
}

function displayNone(name) {
  name.classList.add('displayNone');
  name.classList.remove('displayFlex');
}
function displayFlex(name) {
  name.classList.remove('displayNone');
  name.classList.add('displayFlex');
}
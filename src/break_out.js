const playGame = document.getElementById('playGame');
let ctx = playGame.getContext('2d');

// 캔버스 크기 설정
playGame.width = 550;
playGame.height = 500;

// 공 클래스
class Ball {
  constructor() {
    this.size = 15;
    this.x = playGame.width / 2;
    this.y = playGame.height - 100;
    this.xSpeed = 5;
    this.ySpeed = -5;
  }
  draw(paddle){
    ctx.beginPath();
    ctx.fillStyle = '#FFFFFF';
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    this.move(paddle);
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
      gameOver();
    }
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
}

var rightSwitch = false;
var leftSwitch = false;

// 패들(공 받쳐주는 사각형) 클래스
class Paddle {
  constructor(){
    this.wSize = 120;
    this.hSize = 25;
    this.x = playGame.width / 2 - this.wSize / 2;
    this.y = playGame.height - 40;
    this.color = '#312b3b';
  }
  draw(){
    this.move();
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.wSize, this.hSize);
    ctx.fillStyle = this.color;
    ctx.fill();
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

let timer = 0;
const ball = new Ball();
const paddle = new Paddle();

function frame() {
  animation = requestAnimationFrame(frame);
  timer += 1;
  ctx.clearRect(0, 0, playGame.width, playGame.height);
  ball.draw(paddle);
  paddle.draw();
}
frame();

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

function gameOver() {
  // ctx.clearRect(0, 0, playGame.width, playGame.height);
  cancelAnimationFrame(animation);
  // document.location.reload();
}
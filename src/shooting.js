const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.canvas.width = 500;
ctx.canvas.height = 498;

let levelNum = 1;
let scoreNum = 0;
let lifeNum = 5;
const lifeArr = document.querySelectorAll("#life span");

class Airplane {
  //비행기 class
  ctx;
  x;
  y;
  img;
  bim_x;
  bim_y;
  color;
  constructor(ctx) {
    this.ctx = ctx;
    this.img = new Image();
    this.color = "yellow";
    this.position();
    this.bimPosition();
  }
  position(x = 4, y = 8) {
    this.x = x;
    this.y = y;
  }
  initMake() {
    this.img.src = "./img/airplane.png";
    this.img.onload = () => {
      this.make();
    };
  }
  make() {
    this.ctx.drawImage(this.img, this.x * 50, this.y * 50, 50, 50);
  }
  move(x, y) {
    this.position(x, y);
    this.make();
  }
  // Laserbim
  bimPosition() {
    this.bim_x = bim_x;
    this.bim_y = bim_y;
  }
  bimMake() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.bim_x * 50 + 8, this.bim_y * 50 + 5, 3, 20);
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.bim_x * 50 + 24, this.bim_y * 50 - 5, 3, 20);
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.bim_x * 50 + 40, this.bim_y * 50 + 5, 3, 20);
  }
  bimMove(bim_x, bim_y) {
    this.bimPosition(bim_x, bim_y);
    this.bimMake();
  }
  clear() {
    this.ctx.clearRect(0, 0, 500, 500);
  }
}

class Monster {
  //몬스터 class
  x;
  y;
  ctx;
  img;
  img_arr;
  constructor(ctx) {
    this.ctx = ctx;
    this.img = new Image();
    this.position();
    this.img_arr = [
      "./img/monster0.png",
      "./img/monster1.png",
      "./img/monster2.png",
      "./img/monster3.png",
      "./img/monster4.png",
    ];
  }
  position(x = 0, y = -1) {
    this.x = x;
    this.y = y;
  }
  initMake(num) {
    this.img.src = this.img_arr[num];
    this.img.onload = () => {
      this.make();
    };
  }
  make() {
    this.ctx.drawImage(this.img, this.x * 50, this.y * 50, 50, 50);
  }
  clear() {
    this.ctx.clearRect(0, 0, 500, 500);
  }
}

let move_x = 4;
let move_y = 8;
let bim_x = move_x;
let bim_y = move_y;
let bimStatus = false;

let airplane = new Airplane(ctx);
airplane.initMake(); //비행기 생성

let bimAni;
function bimMoving() {
  //빔 쏘기
  clearInterval(bimAni);
  if (bimStatus) {
    bim_x = move_x;
    bim_y = move_y;
    bimAni = setInterval(() => {
      airplane.clear();
      airplane.move(move_x, move_y);
      airplane.bimMove(bim_x, bim_y);
      monster.make();
      bim_y--;
      if (bim_y < -1) {
        clearInterval(bimAni);
        bimStatus = false;
      }
    }, 50);
  }
}

let monster = new Monster(ctx);
let mon_x, mon_y, monAni;

function monsterMaking() {
  //움직이는 몬스터 생성 함수
  let num = Math.floor(Math.random() * 5);
  mon_x = Math.floor(Math.random() * 9);
  mon_y = 0;

  monAni = setInterval(() => {
    monster.position(mon_x, mon_y);
    monster.initMake(num);
    monster.clear();
    monster.make();
    airplane.make();
    mon_y += 0.5;
    if (mon_y > 10) {
      clearInterval(monAni);
      mon_y = 0;
      monsterMaking();
    }
    if (bimStatus && mon_x == bim_x && mon_y <= bim_y) {
      //빔으로 몬스터 맞추기
      clearInterval(monAni);
      mon_y = 0;
      monsterMaking();
      scoreNum += 100;
      score.innerText = scoreNum;
      if (Math.floor(scoreNum / 1000) == levelNum) {
        //레벨업
        ++levelNum;
        level.innerText = levelNum;
      }
    }
    monFight();
  }, 170 - 25 * levelNum);
}

function monFight() {
  if (mon_x == move_x && mon_y == move_y) {
    --lifeNum;
    lifeArr[lifeNum].classList.add("off");
    damageMusic.play();
    if (lifeNum == 0) {
      gameOver(); //생명 0일땐 게임오버
    } else {
      clearInterval(monAni);
      monsterMaking();
    }
  }
} //몬스터와 비행기 충돌

function airplaneMoving() {
  airplane.clear();
  airplane.move(move_x, move_y);
  monster.make();
  monFight();
} //키 이벤트 시 비행기 움직임

let keyStatus = false;
window.onkeydown = (e) => {
  //비행기 키 이벤트
  if (keyStatus) {
    if (e.code == "ArrowLeft" && move_x > 0) {
      move_x--;
      keyLeft.classList.add("key-down");
      airplaneMoving();
    }
    if (e.code == "ArrowRight" && move_x < 9) {
      move_x++;
      keyRight.classList.add("key-down");
      airplaneMoving();
    }
    if (e.code == "ArrowUp" && move_y > 0) {
      move_y--;
      keyUp.classList.add("key-down");
      airplaneMoving();
    }
    if (e.code == "ArrowDown" && move_y < 9) {
      move_y++;
      keyDown.classList.add("key-down");
      airplaneMoving();
    }
    if (e.code == "Space") {
      bimStatus = true;
      bimMoving();
      keySpace.classList.add("key-down");
      bimMusic.play(); //효과음
    } //빔 쏘기

    if (bim_y == -30) {
      clearInterval(bimAni);
    }
  }
};

window.onkeyup = (e) => {
  if (e.code == "ArrowLeft") {
    keyLeft.classList.remove("key-down");
  }
  if (e.code == "ArrowRight") {
    keyRight.classList.remove("key-down");
  }
  if (e.code == "ArrowUp") {
    keyUp.classList.remove("key-down");
  }
  if (e.code == "ArrowDown") {
    keyDown.classList.remove("key-down");
  }
  if (e.code == "Space") {
    keySpace.classList.remove("key-down");
  }
};

function gameSetting() {
  //생명, 레벨, 점수 초기화
  lifeNum = 5;
  for (const item of lifeArr) {
    item.classList.remove("off");
  }
  levelNum = 1;
  level.innerText = levelNum;
  scoreNum = 0;
  score.innerText = scoreNum;
  //비행기 초기화+ 몬스터 생성
  move_x = 4;
  move_y = 8;
  airplane.clear();
  airplane.move(move_x, move_y);
} //게임 다시 시작 시 셋팅 함수

function gameOver() {
  gameOverPage.classList.remove("close_page");
  clearInterval(monAni);
  keyStatus = false;
  bgMusic.pause();
} //게임 오버 함수

startBtn.onclick = () => {
  keyStatus = true;
  startPage.classList.add("close_page");
  bgMusic.play();
  monsterMaking();
}; //게임 시작 버튼

yesBtn.onclick = () => {
  keyStatus = true;
  gameOverPage.classList.add("close_page");
  bgMusic.play();
  gameSetting();
  monsterMaking();
}; //게임오버 > 예스 버튼 => 다시 시작

noBtn.onclick = () => {
  startPage.classList.remove("close_page");
  gameOverPage.classList.add("close_page");
  gameSetting();
}; //게임오버 > 노 버튼 => 시작화면으로

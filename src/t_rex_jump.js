const playGame = document.getElementById('playGame');
let ctx = playGame.getContext('2d');

const bgmToggle = document.querySelector('#bgmToggle');
const scoreText = document.querySelector('#score');
const gameBox = document.querySelector('.game-box');
const characterContainer = document.querySelector('.game-character-selector-container');
const gameOverContainer = document.querySelector('.game-over-container');

const characterBtns = document.querySelectorAll('.game-character-selector button');

// 캔버스 크기 설정
playGame.width = 600;
playGame.height = 400;

// 배경 이미지 설정
let ground = new Image();
ground.src = './img/t-rex/ground.png';

// 보통 공룡, 앉은 공룡, 놀란 공룡 이미지 설정
const dinoArr = [
  './img/t-rex/trexs.png',
  './img/t-rex/trexs_down.png',
  './img/t-rex/omg.png',
];
const eggBirdArr = [
  './img/t-rex/egg.png',
  './img/t-rex/egg_down.png',
  './img/t-rex/egg_omg.png',
];
const halloweenArr = [
  './img/t-rex/hlw.png',
  './img/t-rex/hlw_down.png',
  './img/t-rex/hlw_omg.png',
];



// audio 파일 설정
const collisionSound = new Audio("./sound/t-rex/collision.wav");
collisionSound.volume = .1;
const scoreTenSound = new Audio("./sound/t-rex/score_ten_point.mp3");
scoreTenSound.volume = .1;
const slowBgm = new Audio("./sound/t-rex/slow_bgm.mp3");
slowBgm.volume = .5;
slowBgm.muted = true; 

// 배경 sptite 설정
this.numRows = 1;

let numColumns_ground = 5;
let frameWidth_ground = ground.width / numColumns_ground;
let frameHeight_ground = ground.height / numRows;

// frame 함수에서 필요한 변수들
let animation;
let timer = 0; // 프레임의 시간이 흘러가는데 필요한 timer 변수
let jumpTimer = 0;
let obstacleCounter = 0;
let jumpBoolean = false;
let mainDownSwitch = false;
let score = 0;
let speed = 6;
let currentFrame = 0;

// 많아질 장애물들을 담을 배열
const cactusArr = [];
const birdsArr = [];

// 메인 캐릭터 Object
// 등장 좌표, 사이즈, 각 상황별 공룡을 그리는 함수
const numColumns = 3;
const numColumns_down = 2;

class MainCharacter {
  constructor(characterArr) {
    this.x = 30;
    this.y = 200;
    this.width = 60;
    this.height = 60;

    this.main = new Image();
    this.main_down = new Image();
    this.main_omg = new Image();

    this.main.src = characterArr[0];
    this.main_down.src = characterArr[1];
    this.main_omg.src = characterArr[2];


    this.frameWidth = this.main.width / numColumns;
    this.frameHeight = this.main.height / numRows;
    
    this.frameWidth_down = this.main_down.width / numColumns_down;
    this.frameHeight_down = this.main_down.height / numRows;
  }
  draw(column, row) {
    ctx.drawImage(this.main, column * this.frameWidth, row * this.frameHeight, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height);
  }
  downDraw(column, row) {
    ctx.drawImage(this.main_down, column * this.frameWidth_down, row * this.frameHeight_down, this.frameWidth_down, this.frameHeight_down, this.x, this.y + 20, this.width, this.height - 20);
  }
  omgDraw() {
    this.main.src = '';
    this.main_down.src = '';
    ctx.drawImage(this.main_omg, this.x, this.y, this.width, this.height);
  }
}

const ground_ = {
  x : 0,
  y : 260,
  width : 700,
  height : 8,
  draw(column, row) {
    ctx.drawImage(ground, column * frameWidth_ground, row * frameWidth_ground, frameHeight_ground, frameHeight_ground, ground_.x, ground_.y, ground_.width, ground_.height);
  },
};

const cloud_ = {
  x : 700,
  y : 50,   
  width : 20,
  height : 10,
  draw(random) {
    ctx.drawImage(cloud, this.x, this.y + random, cloud_.width, cloud_.height);
  },
};

// 장애물 배열
// y좌표, 사이즈, 이미지 주소를 담음

// 선인장 장애물을 담아둔 배열
const cactusGroup = [
  {
    y: 200,
    width: 40,
    height: 60,
    src: './img/t-rex/cactus1.png',
  },
  {
    y: 210,
    width: 40,
    height: 50,
    src: './img/t-rex/cactus2.png',
  },
  {
    y: 190,
    width: 50,
    height: 70,
    src: './img/t-rex/cactus3.png',
  },
  {
    y: 180,
    width: 50,
    height: 80,
    src:'./img/t-rex/cactus4.png',
  },
  {
    y: 190,
    width: 80,
    height: 70,
    src:'./img/t-rex/cactus5.png',
  },
];

// 새 장애물을 담은 배열
const birdsGroup = [
  {
    y: 170,
    width: 50,
    height: 30,
    src:'./img/t-rex/bird1.png',
  },
  {
    y: 160,
    width: 40,
    height: 40,
    src:'./img/t-rex/bird2.png',
  },
   {
    y: 200,
    width: 40,
    height: 40,
    src:'./img/t-rex/bird2.png',
  },
  {
    y: 90,
    width: 50,
    height: 30,
    src:'./img/t-rex/bird1.png',
  },
  {
    y: 130,
    width: 40,
    height: 40,
    src:'./img/t-rex/bird2.png',
  },
];

//장애물 클래스
class Obstacle {
  constructor(groupName, randomNum) {
    this.x = 700;
    this.y = groupName[randomNum].y;
    this.randomNum = randomNum;
  }
  draw(groupName) { 
    let obs = new Image();
    obs.src = groupName[this.randomNum].src;
    obs.width = groupName[this.randomNum].width;
    obs.height = groupName[this.randomNum].height;
    
    ctx.drawImage(obs, this.x, this.y, obs.width, obs.height);
  }
}

let main = new MainCharacter(dinoArr);

characterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if(btn.className == 'trex-btn'){
      main = new MainCharacter(dinoArr); 
    }
    if(btn.className =='bird-btn'){
      main = new MainCharacter(eggBirdArr); 
    }
    if(btn.className =='halloween-btn'){
      main = new MainCharacter(halloweenArr); 
    }
    characterContainer.classList.add('displayNone');
    gameBox.classList.remove('displayNone');
    ground.onload = frame();
  });
});


// 프레임마다 실행할 코드들
function frame() {
  // requestAnimationFrame() : 브라우저가 화면을 업데이트하는 경우에만 콜백 함수를 호출
  // 나중에 cancel 시켜주기 위해서 변수에 담음
  animation = requestAnimationFrame(frame);
  
  timer += 1;
  
  // timer가 흐르면서 생긴 잔상을 없애주기 위해서 사용
  ctx.clearRect(0, 0, playGame.width, playGame.height);

  if(obstacleCounter % 3 == 0 && obstacleCounter != 0) {
    makeObstacle(birdsGroup, birdsArr);
    removeBirds(birdsArr);
  } else {
    makeObstacle(cactusGroup, cactusArr);
    removeCactus(cactusArr);
  }

  if(obstacleCounter > 10) {
    obstacleCounter = 0;
  }

  // 공룡 점프 기능
  // 공룡의 y값 : 200, 공룡의 키: 60
  // 점프했을 때 공룡의 y 범위 : 0 ~ 200
  
  if(jumpBoolean == true) {
    if(main.y >= 80){
      main.y -= 7;
    }
    jumpTimer++;
  }
  if(jumpBoolean == false) {
    if(main.y < 200){
      main.y += 7;
      if(mainDownSwitch == true) {
        main.y += 8;
      }
    }
  } 
  if (jumpTimer > 30 && main.y < 80) {
    jumpBoolean = false;
    jumpTimer = 0;
  }
  if(timer % 4 === 0){
    currentFrame++;
  }

  mainMotionChange(numColumns);
  if(mainDownSwitch === true) {
    mainMotionChange(numColumns_down);
  }

  goundChange(numColumns_ground);
}

// 최대, 최소값 사이의 랜덤 숫자 반환하는 함수
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// 공룡의 모션 바꿔주는 함수
function mainMotionChange(numColumns) {
  let maxFrame = numColumns * numRows - 1;
  if (currentFrame > maxFrame){
    currentFrame = 0;
  }
  let column = currentFrame % numColumns;
  let row = Math.floor(currentFrame / numColumns);
  

  if(mainDownSwitch === true) {
    main.downDraw(column, row);
    return;
  }
  main.draw(column, row);
}

function goundChange(numColumns) {
  let maxFrame = numColumns * numRows - 1;
  if (currentFrame > maxFrame){
    currentFrame = 0;
  }
  let column = currentFrame % numColumns;
  let row = Math.floor(currentFrame / numColumns);

  ground_.draw(column, row);
}

// 장애물 생성하는 함수
function makeObstacle(GroupName, arrName) {
  if(timer %  120 === 0){
    let randomNum = Math.floor(Math.random() * GroupName.length);
    let obstacle = new Obstacle(GroupName,randomNum);
    arrName.push(obstacle);
  }
  arrName.forEach((obs) => {
    obs.x -= speed;
    obs.draw(GroupName);
  });
}

function removeCactus(arrName) {
  arrName.forEach((obs, i, Arr) => {
    if(obs.x < 0) {
      Arr.splice(i, 1);
      setScore();
      obstacleCounter++;
    }
    cactusCollisionCheck(main,obs);
  });
}

function removeBirds(arrName) {
  arrName.forEach((obs, i, Arr) => {
    if(obs.x < 0) {
      Arr.splice(i, 1);
      setScore();
      obstacleCounter++;          
    }
    birdsCollisionCheck(main,obs);
  });
}

// 선인장 충돌 확인 함수
function cactusCollisionCheck(main, cactus) {
  let xCheck = cactus.x + 10 - (main.x + main.width);
  let yCheck = cactus.y + 15 - (main.y + main.height);

  if (xCheck < 0 && yCheck < 0 ) {
    collisionSound.play();
    gameOver();
  }
}

// 새 충돌 확인 함수
function birdsCollisionCheck(main, birds) {
  let xCheck = birds.x + 10 - (main.x + main.width);
  let yCheck = (birds.y + birds.height) - (main.y+10) ;
  let y2Check = birds.y + 20 - (main.y + main.height);
  // let yCheck = birds.y - 10 - (main.y + main.height);

    if(main.y <= birds.y){
      if (xCheck < 0 && yCheck < 0) {
      collisionSound.play();
      gameOver();
    }
    if(xCheck < 0 && y2Check < 0) {
      collisionSound.play();
      gameOver();
    }
  }
  }

// 게임 오버 함수
function gameOver() {
  slowBgm.muted = true; 

  // ctx.clearRect(0, 0, playGame.width, playGame.height);
  cancelAnimationFrame(animation);
  main.omgDraw();
  gameOverContainer.classList.remove('displayNone');

  document.addEventListener(('keydown'), (e) => {
    if(e.code === 'Space') {
      gameOverContainer.classList.add('displayNone');
      document.location.reload();
    }
  });
}

function setScore() {
  score += 1;
  scoreText.innerText = score;
  if((score % 10 == 0 || score % 10 == 10) && speed <= 16 ){
    scoreTenSound.play();
    speed += 3;
    scoreText.classList.add('bounce');
  } else {
    scoreText.classList.remove('bounce');
  }
}

document.addEventListener(('keydown'), (e) => {
  if(e.code === 'ArrowUp' || e.code === 'Space') {
    jumpBoolean = true;
    mainDownSwitch = false;
  }
  if(e.code === 'ArrowDown') {
    mainDownSwitch = true;
  }
});

document.addEventListener(('keyup'), (e) => {
  if(e.code === 'ArrowDown') {
    mainDownSwitch = false;
  }
});

bgmToggle.addEventListener(('click'), () => {
  if(slowBgm.muted == true) {
    slowBgm.play();
    bgmToggle.innerText = 'BGM OFF';
    slowBgm.muted = false;
  } else {
    bgmToggle.innerText = 'BGM ON';
    slowBgm.muted = true;
  }
});
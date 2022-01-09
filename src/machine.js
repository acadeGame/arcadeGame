const gameListBtns = document.querySelectorAll(".game-btn");
const joyBtns = document.querySelectorAll(".joy-btn-inner");
const joyUpBtns = document.querySelectorAll(".joy-btn-inner1");
const joyLeftBtns = document.querySelectorAll(".joy-btn-inner2");
const joyRightBtns = document.querySelectorAll(".joy-btn-inner3");

const playGameScreen = document.querySelector(".play-game");
const playBox = document.querySelector(".box");
const playFrame = document.querySelector("iframe");
const playCanvas = document.querySelector("canvas");

let playGif;

class PlayAllSrc {
  constructor(i) {
    this.gifSrc = playGifSrc[i];
    this.gameSrc = playGameSrc[i];
  }
}
const playGifSrc = [
  // 게임 선택 전 미리 보기 gif 파일, 추후 변경 가능
  "https://i.giphy.com/media/9xyL3Ogw3wlafmKowH/giphy.webp",
  "https://user-images.githubusercontent.com/62978690/83346763-0a579300-a33f-11ea-8ad3-db58cadbca81.gif",
  "https://post-phinf.pstatic.net/MjAxNzA4MjhfMjMz/MDAxNTAzOTI5MDM0OTE4.uoyWe8k_pw8xciI8YNhiRj1acyqMFlOiTJEhvRVZydQg.ppoq4wcL6DvY9WaP_KOXZaDd9im_NLaB2S0B0UYwmPMg.GIF/ImpureGivingIcelandicsheepdog-max-1mb.gif?type=w1200",
  "https://www.riskbasedsecurity.com/wp-content/uploads/2020/03/Mole-GIF.gif",
  "https://media2.giphy.com/media/uPrD0MVGVhu0v0jdwa/giphy.gif?cid=ecf05e475zr5ekh5xosgo5owtmm1v8o4y65g14rdjzvqde7g&rid=giphy.gif&ct=g",
  "https://i.giphy.com/media/13eirb4In7z4is/giphy.webp",
];

const playGameSrc = [
  // 게임 페이지 html 파일 연결
  "shooting.html",
  "t_rex_jump.html",
  "break_out.html",
  "matching.html",
  "#",
  "#",
];

const arrowDirection = ["ArrowUp", "ArrowLeft", "ArrowRight"];

gameListBtns.forEach((gameBtn, i) => {
  const title = gameBtn.nextElementSibling;

  gameBtn.addEventListener("mouseenter", () => {
    title.style.width = "90px";
  });

  gameBtn.addEventListener("mouseleave", () => {
    title.style.width = "0px";
  });

  gameBtn.addEventListener("click", () => {
    if (playGif != null) {
      playGif.remove();
    }
    playGameScreen.style.display = "block";
    // playFrame.style.display = 'none';
    playBox.style.display = "none";
    const playSrc = new PlayAllSrc(i);
    playFrame.src = playSrc.gameSrc;
    playGameScreen.innerHTML += createGameGif(playSrc.gifSrc);
    playGif = document.querySelector(".play-game img");
  });
});

playGameScreen.addEventListener("click", () => {
  if (playGif != null) {
    playGif.remove();
    playGameScreen.style.display = "none";
    // playFrame.style.display = 'block';
    playBox.style.display = "block";
  } else {
    playGameScreen.style.display = "block";
    // playFrame.style.display = 'none';
    playBox.style.display = "none";
  }
});

document.addEventListener("keydown", (e) => {
  keydownEvent(e, 0, joyUpBtns);
  keydownEvent(e, 1, joyLeftBtns);
  keydownEvent(e, 2, joyRightBtns);
});

document.addEventListener("keyup", () => {
  joyBtns.forEach((btn) => {
    if (!btn.classList.contains("active")) {
      return;
    }
    btn.classList.remove("active");
  });
});

function createGameGif(gifSrc) {
  return `
	<img src= "${gifSrc}" alt="img" class="play-gif">
	`;
}

function keydownEvent(e, btnNum, btns) {
  if (e.key === arrowDirection[btnNum]) {
    btns.forEach((btn) => {
      btn.classList.add("active");
    });
  }
}

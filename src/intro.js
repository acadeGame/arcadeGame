let device = document.querySelector("#mainContainer .game-device");
let spotlight = document.querySelector("#mainContainer .spotlight");

device.onmouseenter=function(){
    spotlight.classList.add("spotlight-on");
}

spotlight.onmouseleave=function(){
    spotlight.classList.remove("spotlight-on");
}
// spotlight class on&off

let btn = document.querySelector(".device_screen>button");
console.log(btn);

btn.onclick=function(){
    loadBg.classList.add("load-on");
    setTimeout(function () {
        mainContainer.style["display"]="none";
        gamePage.style["display"]="block";
    }, 900);
    clearTimeout();        
}
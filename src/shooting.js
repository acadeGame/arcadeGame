let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
ctx.canvas.width = 500;
ctx.canvas.height = 500;

let level_num=1;
let score_num=0;
const life_arr=document.querySelectorAll("#life span");

console.log(life_arr);
const boardArr=[];
for (let i = 0; i < 10; i++){
    boardArr[i]=[];
    for (let j = 0; j < 10; j++) {
        boardArr[i][j] =0;
    }
}
console.table(boardArr);

class Airplane{  //비행기 class
    ctx;x;y;img;
    bim_x;bim_y;color;
    constructor(ctx){
        this.ctx=ctx;
        this.img=new Image();
        this.color="yellow";
        this.position();
        this.bimPosition();
    }
    position(x=7,y=8){
        this.x=x;
        this.y=y;
    }
    initMake(){
        this.img.src="./img/airplane.png";
        this.img.onload=()=>{ this.make() }
    }
    make(){
        this.ctx.drawImage(this.img,this.x*50,this.y*50,50,50);   
    }
    move(x,y){
        this.position(x,y);
        this.make();
    }
    // Laserbim
    bimPosition(){
        this.bim_x=bim_x;
        this.bim_y=bim_y;
    }
    bimMake(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect((this.bim_x*50)+8, (this.bim_y*50)+5,3,20);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect((this.bim_x*50)+24, (this.bim_y*50)-5,3,20);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect((this.bim_x*50)+40, (this.bim_y*50)+5,3,20);
    }
    bimMove(bim_x,bim_y){
        this.bimPosition(bim_x,bim_y);
        this.bimMake();
    } 
    clear(){
        this.ctx.clearRect(0, 0, 500, 500); 
    }
}

class Monster{//몬스터 class
    x;y;ctx;img; img_arr;
    constructor(ctx){
        this.ctx=ctx;
        this.img=new Image();
        this.position();
        this.img_arr=[
            "./img/monster0.png",
            "./img/monster1.png",
            "./img/monster2.png",
            "./img/monster3.png",
            "./img/monster4.png"
        ]
    }
    position(x=0,y=-1){
        this.x=x;
        this.y=y;
    }
    initMake(num){
        // this.ctx.drawImage(num,this.x*50,this.y*50);
        this.img.src=this.img_arr[num];
        this.img.onload=()=>{ this.make();}
    }
    make(){
        this.ctx.drawImage(this.img,this.x*50,this.y*50,50,50);
        // this.ctx.fillStyle = "red";
        // this.ctx.fillRect((this.x*50), (this.y*50),50,50);
    }  
    clear(){
        this.ctx.clearRect(0, 0, 500, 500); 
    }  
}

let move_x=7;
let move_y=8;
let bim_x=move_x;
let bim_y=move_y;
let bim_status=false;

let airplane = new Airplane(ctx);
airplane.initMake();//비행기 생성

let bimAni;
function bimMoving(){//빔 쏘기
    clearInterval(bimAni);
    if(bim_status){
        bim_x=move_x;
        bim_y=move_y;
        bimAni=setInterval(() => {
            airplane.clear();
            airplane.move(move_x,move_y);
            airplane.bimMove(bim_x,bim_y);
            monster.make();
            bim_y--;
            if(bim_y<-1){
                clearInterval(bimAni);
                bim_status=false;
            }
        }, 50);

    }
} 

let monster= new Monster(ctx);
let mon_x, mon_y, monAni, monStart;
function monsterShow(){//2000ms 마다 몬스터 등장
    monsterMaking();
    monStart=setInterval(()=>{
        monsterMaking();
    }, 2500);
};

function monsterMaking(){//움직이는 몬스터 생성 함수
    let num = Math.floor(Math.random()*5);
    mon_x= Math.floor(Math.random()*9);
    mon_y=0;
       
    monAni=setInterval(() => {
        monster.position(mon_x,mon_y);
        monster.initMake(num);
        monster.clear();
        monster.make();
        airplane.make();
        mon_y+=0.5;
        if(mon_y>10){clearInterval(monAni); mon_y=0;}
        if(bim_status&&mon_x==bim_x && mon_y<=bim_y){//빔으로 몬스터 맞추기
            clearInterval(monStart);
            clearInterval(monAni);
            mon_y=0;
            monsterShow();
            score_num+=100;
            score.innerText=score_num;
        }
    },100);
}

monsterShow();

window.onkeydown=(e)=>{//비행기 키 이벤트
    if(e.code=="ArrowLeft" && move_x>0){
        move_x--;
        airplane.clear();
        airplane.move(move_x,move_y);
        monster.make();
        keyLeft.classList.add("key-down");
    }
    if(e.code=="ArrowRight" && move_x<9){
        move_x++;
        airplane.clear();
        airplane.move(move_x,move_y);
        monster.make();
        keyRight.classList.add("key-down");
    }
    if(e.code=="ArrowUp" && move_y>0){
        move_y--;
        airplane.clear();
        airplane.move(move_x,move_y);
        monster.make();
        keyUp.classList.add("key-down");
    }
    if(e.code=="ArrowDown" && move_y<9){
        move_y++;
        airplane.clear();
        airplane.move(move_x,move_y);
        monster.make();
        keyDown.classList.add("key-down");
    } 
    if(e.code=="Space"){
        bim_status=true;       
        bimMoving();
        keySpace.classList.add("key-down");
    }//빔 쏘기

    if(bim_y==-30){clearInterval(bimAni)};
}

window.onkeyup=(e)=>{
    if(e.code=="ArrowLeft"){keyLeft.classList.remove("key-down");}
    if(e.code=="ArrowRight"){keyRight.classList.remove("key-down");}
    if(e.code=="ArrowUp"){keyUp.classList.remove("key-down");}
    if(e.code=="ArrowDown"){keyDown.classList.remove("key-down");}
    if(e.code=="Space"){
        keySpace.classList.remove("key-down");
        // bim_status=false;
    }
}





/*


function monsterInit(){
    return new Promise((resolve)=>{
    let monster= new Monster(ctx); 
    let num = Math.floor(Math.random()*5);
    monster.initMake(num);  
    resolve(monster);    
    })
}

function monsterMake(res){
    let mon_x= Math.random()*14;
    let mon_y=-1;
    let monAni;
    
    monAni=setInterval(() => {
        res.position(mon_x,mon_y);
        res.clear();
        res.make();
        airplane.make();
        // monster.initMake();
        mon_y+=0.1
        if(mon_y>10){clearInterval(monAni)}
        ctx.save();
    }, 50);   
}

monsterInit().then((res)=>{monsterMake(res)})




// bim.ctx.clearRect(0, 0, 500, 500); 
// bim.move(bim_x,bim_y)
// airplane.make();

// bimMoving(bim,bim_x,bim_y)


this.ctx.clearRect(0, 0, 500, 500); 
class Laserbim{
    ctx;x;y;color;
    constructor(ctx){
        this.ctx=ctx;
        this.color="yellow"
        this.position();
    }
    position(bim_x,bim_y){
        this.x=bim_x;
        this.y=bim_y;
    }
    make(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x+8, this.y+5,3,10);

        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x+24, this.y-5,3,15);

        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x+40, this.y+5,3,10);
    }
    move(bim_x,bim_y){
        this.position(bim_x,bim_y);
        this.make();
    } 

}

*/

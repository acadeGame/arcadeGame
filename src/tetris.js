let canvas = document.getElementById("tetrisCanvas");
let ctx = canvas.getContext("2d");

let block_cols = 20;
let block_rows = 25;
let box_size = 20;
let block_size=20;

ctx.canvas.width = block_cols * block_size; //가로
ctx.canvas.height = block_rows * block_size; //세로
ctx.scale(block_size,block_size);//사이즈 지정

////////////////////////////////////board class
class BlockBoard{
    boardArr;

    makeNewBoard(){
        this.boardArr = new Array(block_rows);
        for (let i = 0; i < block_rows; i++){
            this.boardArr[i] = new Array(block_cols).fill(0);
        }
    }

    findWall(blockP) {
        console.log(blockP);
        return blockP.every((row, dy) => {
            return row.every((value, dx) => {
              let x = blockP.x + dx;
              let y = blockP.y + dy;
              console.log(value);
              return (
                value === 0 //||(this.insideWalls(x) && this.aboveFloor(y) && this.notOccupied(x, y))
              );
            });
          });

    }

    // notOccupied(x, y) {
    //     return this.boardArr[y] && this.boardArr[y][x] === 0;
    // }
}
let showBox= new BlockBoard();

////////////////////////////////////////블럭 만드는 class

class Block{
    ctx;x;y;color;shap;

    constructor(ctx){
        this.ctx = ctx;
        this.blockShap();
    }

    blockShap(){
        this.x = 9;
        this.y = 0;

        this.color="red";
        this.shap =[ //J
            [0,2,0],
            [0,2,0],
            [2,2,0]
        ];     

        // this.blockMove();
    }
    moving(activeB){
        this.x = activeB.x;
        this.y = activeB.y;
    }
    blockMake(){
        this.ctx.fillStyle = this.color;
        this.shap.forEach((shapRow,y)=>{
            shapRow.forEach((shapCol,x)=>{
                if(shapCol>0){
                    this.ctx.fillRect(this.x +x, this.y +y, 0.9, 0.9);

                }
            });
        });   
    }   
}
////////////////////////////////////게임시작

function gameStart(){
    showBox.makeNewBoard(); //새로운 보드   
    let newBlock = new Block(ctx); //새로운 블럭
    newBlock.blockMake();
    showBox.newBlock=newBlock
}

gameStart();
console.table(showBox);

////////////////////////////////////

const activeB={x:9, y:0 };
let stop_status =false;
let abd;

let nowBlock;

window.onkeydown=(e)=>{

    // e.preventDefault(); //제어>>방향키 버튼일때 

    if(!stop_status){//멈춤 상태 방향키 제어
        if(e.code=="ArrowLeft"){
            activeB.x= activeB.x-1;
            keyLeft.classList.add("key-down");

            // console.log(showBox.newBlock.moving(activeB));
            // console.log(showBox.findWall(showBox.newBlock.shap));
            // if(showBox.findWall(showBox.newBlock.shap)){showBox.newBlock.moving(activeB);}
            
            showBox.newBlock.moving(activeB);

            showBox.boardArr[activeB.y][activeB.x] = showBox.newBlock.shap;
            console.table(showBox.boardArr);


            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
            showBox.newBlock.blockMake();
        }
        if(e.code=="ArrowRight"){
            activeB.x= activeB.x+1;
            showBox.newBlock.moving(activeB);
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
            showBox.newBlock.blockMake();
            keyRight.classList.add("key-down");
        }
        if(e.code=="ArrowDown"){
            activeB.y= activeB.y+1;

            showBox.newBlock.moving(activeB);
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
            showBox.newBlock.blockMake();
            keyDown.classList.add("key-down");
        }
    }

    if(e.code=="Space"){
        keySpace.classList.add("key-down");
    }
    
    if(e.code=="Escape"){//멈춤 키
        keyEscape.classList.add("key-down");
        if(stop_status){
            stopPop.classList.add("pop-close");
            stop_status=false;
        }else{
            stopPop.classList.remove("pop-close");
            stop_status=true;
        }
    }
}






































/////////////////////////////블럭 모양 (임시)
// J L S Z I O
const color_arr = ["red","blue","green","yellow","aqua","magenta"];

const block_shap_arr=[];

block_shap_arr[0] = [ //J
    [0,2,0],
    [0,2,0],
    [2,2,0]
];

block_shap_arr[1] = [ //L
    [0,2,0],
    [0,2,0],
    [0,2,2]
];

block_shap_arr[2] = [ //S
    [0,2,2],
    [2,2,0],
    [0,0,0]
];

block_shap_arr[3] = [ //Z
    [2,2,0],
    [0,2,2],
    [0,0,0]
];

block_shap_arr[4] = [ //I
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [0,1,0]
];

block_shap_arr[5] = [ //O
    [2,2,0],
    [2,2,0],
    [0,0,0]
];


/*


///////////////////////////블럭 아래로 내려감(자동)
let move_x=9;
let move_y=0;
let block_ani;
let block_num=2;

function startBlock(){
    const blockJ = new Block();
    blockJ.blockShap(ctx, move_x, move_y,color_arr[block_num],block_shap_arr[block_num] );
    blockJ.blockMake();
}


function blockMove(){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    startBlock();
    if(move_y>22){
        clearInterval(block_ani);
        console.table(BlockArr);
    }else{move_y++;}
}

function blockMoveSetting(){
    blockMove();
    block_ani = setInterval(blockMove,1000);
}

blockMoveSetting();

////////////////////////////키보드 이벤트
let key_press;
let stop_status;

window.onkeydown=(e)=>{//key down
    stop_status=stopPop.classList.contains("pop-close");

    if(e.code=="ArrowLeft"){
        keyLeft.classList.add("key-down");
        if(move_x>0&&stop_status){
            clearInterval(block_ani);
            --move_x;
            blockMoveSetting();   
        }
    }
    
    if(e.code=="ArrowRight"){
        keyRight.classList.add("key-down");
        if(move_x<18&&stop_status){
            clearInterval(block_ani);
            ++move_x;
            blockMoveSetting();   
        }  
    }

    if(e.code=="ArrowDown"){
        keyDown.classList.add("key-down");
        if(move_y<21&&stop_status){
            clearInterval(block_ani);
            ++move_y;
            blockMoveSetting();   
        }
    }

    if(e.code=="Space"){
        keySpace.classList.add("key-down");
    }

    if(e.code=="Escape"){
        keyEscape.classList.add("key-down");
        if(!stop_status){
            blockMoveSetting();
            stopPop.classList.add("pop-close");
        }else{
            clearInterval(block_ani);
            stopPop.classList.remove("pop-close");
        }
    }

}

window.onkeyup=(e)=>{//key up
    if(e.code=="ArrowLeft"){keyLeft.classList.remove("key-down");}
    if(e.code=="ArrowRight"){keyRight.classList.remove("key-down");}
    if(e.code=="ArrowDown"){keyDown.classList.remove("key-down");}
    if(e.code=="Space"){keySpace.classList.remove("key-down");}
    if(e.code=="Escape"){keyEscape.classList.remove("key-down");}  
}



*/
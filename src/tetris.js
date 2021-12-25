let canvas = document.getElementById("tetrisCanvas");
let ctx = canvas.getContext("2d");

let block_cols = 20;
let block_rows = 25;
let box_size = 20;
let block_size=20;

ctx.canvas.width = block_cols * block_size; //가로
ctx.canvas.height = block_rows * block_size; //세로
ctx.scale(block_size,block_size);//사이즈 지정


const BlockArr = [];

for (let j = 0; j <block_rows; j++){
    BlockArr[j]=[];
    for (let i = 0; i < block_cols; i++){
        // let block_x = (i*block_size);
        // let block_y = (j*block_size);
        // BlockArr[j][i]={x:block_x , y:block_y , state:0};
        BlockArr[j][i]=0;
    }        
}//block arr 

console.table(BlockArr);

class Board{
    grid;
    resetBoard(){
        
    }
    makeBoardArr(){

    }
    
}
////////////////////////////////////////블럭 만드는 class
class BlockMake{
    ctx;x;y;color;shap;

    constructor(ctx,x,y,color,shap){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.color=color;
        this.shap = shap;
    }

    makeTetris=function(){
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
/////////////////////////////블럭 모양 (임시)
// J L S Z I O
const color_arr = ["red","blue","green","yellow","magenta","aqua"];

const shapJ = [
    [0,2,0],
    [0,2,0],
    [2,2,0]
];

const shapL = [
    [0,2,0],
    [0,2,0],
    [0,2,2]
];

///////////////////////////블럭 아래로 내려감(자동)
let move_x=0
let move_y=0
let block_ani;

function blockMove(){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const blockJ = new BlockMake(ctx, move_x, move_y,"red",shapJ);
    blockJ.makeTetris();
    (move_y>21)?clearInterval(block_ani):move_y++;
}


function blockMoveSetting(){
    blockMove();
    block_ani = setInterval(blockMove,1000);

}

blockMoveSetting();

////////////////////////////////////


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
            // blockMoveSetting();
        }
    }

}

window.onkeyup=(e)=>{//key up
    if(e.code=="ArrowLeft"){
        keyLeft.classList.remove("key-down");
    }
    
    if(e.code=="ArrowRight"){
        keyRight.classList.remove("key-down");
    }

    if(e.code=="ArrowDown"){
        keyDown.classList.remove("key-down");
    }

    if(e.code=="Space"){
        keySpace.classList.remove("key-down");
    }

    if(e.code=="Escape"){
        keyEscape.classList.remove("key-down");
    }


    
}

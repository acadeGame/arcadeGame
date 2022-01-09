let canvas = document.getElementById("tetrisCanvas");
let ctx = canvas.getContext("2d");

let block_cols = 20;
let block_rows = 25;
let block_size=20;

ctx.canvas.width = block_cols * block_size; //가로
ctx.canvas.height = block_rows * block_size; //세로
ctx.scale(block_size,block_size);//사이즈 지정

class Board{
    showArr;

    make(){
        this.showArr = new Array(block_rows);
        for (let i = 0; i < block_rows; i++){
            this.showArr[i] = new Array(block_cols).fill(0);
        }           
    }
}

let board = new Board();
board.make();
// console.table(board.showArr);

class Block{
    shap;ctx;row;col;moveX;moveY;

    constructor(ctx){
        this.ctx = ctx;
        this.moveX=9;
        this.moveY=0;
        this.shap=[
            [0,2],[1,2],[1,1],[1,0]
        ]
    }

    make(){
        this.ctx.fillStyle = "red";
        for (let i = 0; i < 4; i++) {
            this.col = this.shap[i][0]+this.moveX;
            this.row = this.shap[i][1]+this.moveY;
    
            board.showArr[this.row][this.col]=2;

            this.ctx.fillRect(this.col, this.row, 0.9, 0.9);
        }
    }
    
    move(moveX,moveY){
        this.moveX=moveX;
        this.moveY=moveY;
        for(let i=0; i>block_rows; i++){
            for(let j; j>block_cols;j++){
                if(board.showArr[i][j]==2){
                    board.showArr[i][j]=0;
                }
                
            }
        }
        this.make();


    }
}

let block = new Block(ctx);
block.make();
console.table(board.showArr);
let moveX=9;
let moveY=0;

document.onkeydown=(e)=>{
    if(e.code=="ArrowLeft"&&moveX>0){
        moveX--;
        console.log(moveX);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
        block.move(moveX,moveY);
        console.table(board.showArr);
    }
}
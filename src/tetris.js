let canvas = document.getElementById("tetrisCanvas");
let ctx = canvas.getContext("2d");

let block_cols = 20;
let block_rows = 25;
let block_size = 20;

ctx.canvas.width = block_cols * block_size; //가로
ctx.canvas.height = block_rows * block_size; //세로
ctx.scale(block_size,block_size);//사이즈 지정

const BlockArr = [];

for (let j = 0; j <block_rows; j++) {
    BlockArr[j]=[];
    for (let i = 0; i < block_cols; i++) {
        BlockArr[j][i]=0;
    }        
}//block arr 

console.table(BlockArr);

function BlockJ(ctx){
    this.ctx = ctx;
    this.x = 10;
    this.y = 0;
    this.color="red";
    this.shap = [
        [0,2,0],
        [0,2,0],
        [2,2,0]
    ];
    this.makeTetris=function(ctx, color, ix, iy){
        this.ctx.fillStyle = this.color;
        
        this.shap.forEach((shapRow,y)=>{
            shapRow.forEach((shapCol,x)=>{
                if(shapCol>0){
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }
}

const blockJ = new BlockJ(ctx);
blockJ.makeTetris();


// class BlockJ{
//     show_x;
//     show_y;
//     ctx;
//     color;
//     constructor(ctx){
//         this.makeBlock();
//         this.ctx=ctx;
//     }
//     makeBlock(){
//         this.show_x = 10;
//         this.show_y = 0;
//         this.color="red";
//         this.shap = [
//             [0,2,0],
//             [0,2,0],
//             [2,2,0]
//         ]
//     }
//     showBlock(){
//         this.ctx.fillStyle = this.color;
//         this.shap.forEach((shapRow,y)=>{
//             shapRow.forEach((shapCol,x)=>{
//                 if(shapCol>0){
//                     this.ctx.fillRect(this.show_x + x, this.show_y + y, 1, 1);
//                 }
//             });
//         });
//     }
// }

// const blockJ = new BlockJ(ctx);
// blockJ.showBlock();
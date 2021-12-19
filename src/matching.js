const color_arr=["color1","color2","color3","color4","color5","color6","color7","color8","color9"];

let show_container = document.querySelector(".game-box .game_container .show_container");
let pop_bg = document.querySelector(".game-box .pop_bg");
let success_pop = document.querySelector(".game-box .success_pop");
let total_score = document.querySelector(".game-box .pop_bg .total_score>span");

let score_txt = document.querySelector(".score_container .score>span");
let score_num = Infinity;

let time_txt = document.querySelector(".score_container .time");
let time_num =Infinity;

const life_arr = document.querySelectorAll(".score_container .life span");
let life_num=Infinity;

const cardSetting = function(){
    show_container.innerHTML=""; 
    for (let i = 0; i < 2; i++) {
        const shuffle_arr = color_arr.sort(()=> Math.random() - 0.5); //shuffle card
        for (let j = 0; j < 9; j++) {
            let wrap_id = document.createElement("div");
            wrap_id.classList.add("card_wrap","active")
            wrap_id.id=shuffle_arr[j];
            
            let front_card = document.createElement("div");
            front_card.classList.add("fornt", "card");
            
            let back_card = document.createElement("div");
            back_card.classList.add("back", "card");
            
            wrap_id.append(front_card);
            wrap_id.append(back_card);
            
            show_container.append(wrap_id);            
        }
    }
} //card setting

let timeMove;
const timeSetting =function(){
    timeMove = setInterval(function(){
        --time_num;
        time_txt.innerText =time_num;
        if(time_num == 0){//Time Out >> Game Over
            clearInterval(timeMove);
            click_state=false;
            pop_bg.classList.remove("pop_close");
            total_score.innerText=score_num;
        }
        // else{
        //     time_txt.innerText =time_num;
        // }
    }, 1000);   
}//Time move setting

const gameSetting= function(score, time, life){
    score_num=score;
    time_num=time;
    life_num=life;

    if(life_num<=0){//game over >> life reset
        for(let item of life_arr){
            item.classList.remove("off");
        }
    }else{//win >> life +1
        life_num=life-1;
        life_arr[life_num].classList.remove("off");
    }

    score_txt.innerText =score_num;
    time_txt.innerText =time_num;
    
    cardSetting();
}//gameSetting

const clickSetting = function(){
    const card_arr = document.querySelectorAll(".card_wrap");
    let click_count =0;
    let click_state=true;
    let sussecc_card=0;
    const click_arr=[];
    console.log(card_arr);
    
    window.setTimeout(()=>{
        for (let i = 0; i < card_arr.length; i++){//show card back
            card_arr[i].classList.remove("active");
        }
    },3000)
    //동기화    
    window.setTimeout(()=>{//delay 2.5s => time sart
        timeSetting();
    }, 3000)

    for(let itme of card_arr){
        itme.onclick = function(){
            if(click_state && !itme.classList.contains("active")){
                this.classList.add("active");
                click_arr.push(this);
                click_count++;
                
                if(click_count==2){//2 card on
                    click_state=false; 
    
                    if(click_arr[0].id ==click_arr[1].id){//same card
                        score_num+=100;
                        score_txt.innerText=score_num;//score +100
                        
                        time_num+=5; //time +5s
                        ++sussecc_card; 
    
                        click_arr.splice(0,2);
                        click_state=true; 
                        click_count=0;

                        if(sussecc_card==9){//이긴경우 게임 계속
                            clearInterval(timeMove);
                            success_pop.classList.remove("pop_close");
                            // gameSetting(score_num,time_txt.innerText,life_num);
                            // clickSetting();  
                        }    
                    }else{//diffrence card
                        life_arr[life_num].classList.add("off"); //life -1
                        life_num++;
    
                        setTimeout(() => {//card off
                            click_state=false; 
                            click_arr[0].classList.remove("active");
                            click_arr[1].classList.remove("active");
    
                            if(life_num==7){//life 0 >> Game Over
                                clearInterval(timeMove);
                                click_state=false; 
                                pop_bg.classList.remove("pop_close");
                                total_score.innerText=score_num;                            
                            }else{
                                click_arr.splice(0,2);
                                click_state=true; 
                                click_count=0;
                            }
                        }, 600);
                        
                    }             
                }
            }
        }
    }
}// card click

retryBtn.onclick=function() {
    pop_bg.classList.add("pop_close");
    gameSetting(0,30,0);
    clickSetting();
}//retry

continueBtn.onclick=function(){
    success_pop.classList.add("pop_close");
    gameSetting(score_num,time_txt.innerText,life_num);
    clickSetting();  
}

gameSetting(0,30,0);
clickSetting();
//first setting
<template>
<div id= "PlayerBoard" >
    <div id='mainBoard' :style="{backgroundColor: player.color}" >
        <div id="itemSection">
            <h2> Items </h2>
            <div id='itemGrid'>
                <!--countItems = [fastaval, movie, technology, figures, music]-->
                <div class="dot fastaval"></div>
                <div class="dot movie"></div>
                <div class="dot technology"></div>
                <div class="dot figures"></div>
                <div class="dot music"></div>
                <p>{{countItems[0]}}</p>
                <p>{{countItems[1]}}</p>
                <p>{{countItems[2]}}</p>
                <p>{{countItems[3]}}</p>
                <p>{{countItems[4]}}</p>
            </div>
        </div>
    
        <div id='actionSection'>
            <h2>Bottles</h2>
            <div id ="actionGrid">
                <div v-on:click = 'actionMade("A")' class="dot bottle" id='A'></div>
                <div v-on:click = 'actionMade("B")' class="dot bottle" id='B'></div>
                <div v-on:click = 'actionMade("C")' class="dot bottle" id='C'></div>
                <div v-on:click = 'actionMade("D")' class="dot bottle" id='D'></div>
                <div v-on:click = 'actionMade("E")' class="dot bottle" id='E'></div>
            </div>
        </div>

        <div id='skillSection'>
            <h2>Skills</h2>
            <div id='skillGrid'>
                <!--countSkills = [bottle, workerIncome, workerCard, auctionIncome, VP-all,
                VP-fastaval, VP-movie, VP-technology, VP-figures, VP-music]-->
                <div class="dot bottleSkill"></div>
                <div class="dot workerIncomeSkill"></div>
                <div class="dot workerCardSkill"> </div>
                <div class="dot auctionIncomeSkill"></div>
                <div class="dot VP-allSkill"></div>
                <p>{{countSkills[0]}}</p>
                <p>{{countSkills[1]}}</p>
                <p>{{countSkills[2]}}</p>
                <p>{{countSkills[3]}}</p>
                <p>{{countSkills[4]}}</p>
                <div class="dot VP-fastavalSkill"></div>
                <div class="dot VP-movieSkill"></div>
                <div class="dot VP-technologySkill"></div>
                <div class="dot VP-figuresSkill"></div>
                <div class="dot VP-musicSkill"></div>
                <p>{{countSkills[5]}}</p>
                <p>{{countSkills[6]}}</p>
                <p>{{countSkills[7]}}</p>
                <p>{{countSkills[8]}}</p>
                <p>{{countSkills[9]}}</p>
            </div>
        </div>

        <div id="infoSection">
            <div id='incomeSection'>
                <h2>Income</h2>
                <div class="income dot">
                    <p>&#36;{{countIncome}}</p>
                </div>
            </div>
            <div id="moneySection">
                <h2>Money</h2>
                <div class="money dot">
                    <p> &#36;{{player.money}}</p>
                </div>
            </div>
            <div id="secretSection">
                <div id="secretCard">
                    <h2>Secret card</h2>
                    <div>{{player.secret}}</div>
                </div>
            </div>
        </div> 
    </div>
</div>
</template>

<script>
export default {
  name: 'PlayerBoard',
  props:{
      player: Object,
    },
    computed: {
        countItems: function(){
            //count = [fastaval, movie, technology, figures, music]
            let count = [0,0,0,0,0];
            for(let i= 0; i < this.player.items.length; i++){
                if(this.player.items[i].item === "fastaval"){
                    count[0] +=1;
                }
                else if(this.player.items[i].item === "movie"){
                    count[1] +=1;
                }
                else if(this.player.items[i].item === "technology"){
                    count[2] +=1;
                }
                else if(this.player.items[i].item === "figures"){
                    count[3] +=1;
                }
                else if(this.player.items[i].item === "music"){
                    count[4] +=1;
                }
            }
            return count;
        },
        countSkills: function(){
            /*count = [bottle, workerIncome, workerCard, auctionIncome, VP-all,
            VP-fastaval, VP-movie, VP-technology, VP-figures, VP-music]*/
            let count = [0,0,0,0,0,0,0,0,0,0];
            for(let i= 0; i < this.player.skills.length; i++){
                if(this.player.skills[i].skill === "bottle"){
                    count[0] +=1;
                }
                else if(this.player.skills[i].skill === "workerIncome"){
                    count[1] +=1;
                }
                else if(this.player.skills[i].skill === "workerCard"){
                    count[2] +=1;
                }
                else if(this.player.skills[i].skill === "auctionIncome"){
                    count[3] +=1;
                }
                else if(this.player.skills[i].skill === "VP-all"){
                    count[4] +=1;
                }
                else if(this.player.skills[i].skill === "VP-fastaval"){
                    count[5] +=1;
                }
                else if(this.player.skills[i].skill === "VP-movie"){
                    count[6] +=1;
                }
                else if(this.player.skills[i].skill === "VP-technology"){
                    count[7] +=1;
                }
                else if(this.player.skills[i].skill === "VP-figures"){
                    count[8] +=1;
                }
                else if(this.player.skills[i].skill === "VP-music"){
                    count[9] +=1;
                }
            }
            return count;
        },
        countIncome: function(){
            return this.player.income.length;
        }
    },
     methods: {
      actionMade: function(id){
          console.log(id)
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#mainBoard {    
    height: fit-content;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 10px;
    text-align: center;
    color: black;
    border: 1px solid black;
    /*margin: 5px;*/
    padding: 5px;
    /*border-radius: 3px;*/
}
#mainBoard h2{
    font-size: 90%;
}
#mainBoard p{
    font-size: 100%;
    font-weight: bold;
}
#itemSection{
    grid-row: 1/3;
    grid-column: 1/4;
}
#actionSection{
    grid-row: 1/3;
    grid-column:4/6;
}
#skillSection{
    grid-row: 3/6;
    grid-column: 1/4;
}
#infoSection{
    grid-row:3/6;
    grid-column: 4/6;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
}
#secretSection{
    grid-column:1/3;
}
#itemGrid{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}
#skillGrid{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}
#actionGrid{
    align-items: center;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 5px;
}
.dot {
    width: 6vw;
    height: 6vw;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right:auto;
} 
.income, .money {
    background-color: #ffe599ff;
    height: 8vw;
    width: 8vw;
}
.bottle {
    height: 8vw;;
    width: 8vw;
    background-color: whitesmoke;
}
.bottle:hover {
    background-color: red;
    transition: 0.3s;
}
.music{
    background: url("/images/ITEM-MUSIC.png");
    background-size: 6vw 6vw;
}
.movie{
    background: url("/images/ITEM-FILM.png");
    background-size: 6vw 6vw;
}
.technology{ 
    background: url("/images/ITEM-IT.png");
    background-size: 6vw 6vw;
}
.figures{
    background: url("/images/ITEM-ROBOT.png");
    background-size: 6vw 6vw;
}
.fastaval{
    background: url("/images/ITEM-PINGVIN.png");
    background-size:  6vw 6vw;
}
.bottleSkill{
    background: url("/images/SKILL-FLASKA.png");
    background-size:  6vw 6vw;
}
.workerIncomeSkill{
    background: url("/images/SKILL-GUBBE2PENG.png");
    background-size:  6vw 6vw;
}
.workerCardSkill{
    background: url("/images/SKILL-GUBBEKORT.png");
    background-size: 6vw 6vw;
}
.auctionIncomeSkill{
    background: url("/images/SKILL-1PENG.png");
    background-size:  6vw 6vw;
}
.VP-allSkill{
    background: url("/images/SKILL-5STARS.png");
    background-size:  6vw 6vw;
}
.VP-fastavalSkill{
    background: url("/images/SKILL-PINGVINEX.png");
    background-size:  6vw 6vw;
}
.VP-figuresSkill{
    background: url("/images/SKILL-ROBOTEX.png");
    background-size:  6vw 6vw;
}
.VP-movieSkill{
    background: url("/images/SKILL-FILMEX.png");
    background-size:  6vw 6vw;
}
.VP-technologySkill{
    background: url("/images/SKILL-ITEX.png");
    background-size:  6vw 6vw;
}
.VP-musicSkill{
    background: url("/images/SKILL-MUSICEX.png");
    background-size:  6vw 6vw;
}
</style>

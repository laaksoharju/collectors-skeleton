<template>
<div id= "PlayerBoard" >
<div class='mainBoard' :style="{backgroundColor: player.color}" >
    <div class='slotSpace'>
        <div class='slotWrapper'>
            <h1 class='title'> Items </h1>
                <!--countItems = [fastaval, movie, technology, figures, music]-->
                <div class="dot item fastaval"> {{countItems[0]}}</div>
                <div class="dot item movie">{{countItems[1]}}</div>
                <div class="dot item technology">{{countItems[2]}}</div>
                <div class="dot item figures"> {{countItems[3]}}</div>
                <div class="dot item music"> {{countItems[4]}}</div>
        </div>
    </div>

    <div class='slotWrapper'>
    <h1 class='title'>Actions</h1>
    <div v-on:click = 'actionMade("A")' class="dot bottle" id='A'></div>
    <div v-on:click = 'actionMade("B")' class="dot bottle" id='B'></div>
    <div v-on:click = 'actionMade("C")' class="dot bottle" id='C'></div>
    <div v-on:click = 'actionMade("D")' class="dot bottle" id='D'></div>
    <div v-on:click = 'actionMade("E")' class="dot bottle" id='E'></div>
    </div>

    <div class='slotWrapper'>
        <h1 class='title'>Skills</h1>
        <div id='skillGrid'>
            <!--countSkills = [bottle, workerIncome, workerCard, auctionIncome, VP-all,
            VP-fastaval, VP-movie, VP-technology, VP-figures, VP-music]-->
            <div class="dot skill bottleSkill">{{countSkills[0]}}</div>
            <div class="dot skill workerIncomeSkill">{{countSkills[1]}}</div>
            <div class="dot skill workerCardSkill">{{countSkills[2]}}</div>
            <div class="dot skill auctionIncomeSkill">{{countSkills[3]}}</div>
            <div class="dot skill VP-allSkill">{{countSkills[4]}}</div>
            <div class="dot skill VP-fastavalSkill">{{countSkills[5]}}</div>
            <div class="dot skill VP-movieSkill">{{countSkills[6]}}</div>
            <div class="dot skill VP-technologySkill">{{countSkills[7]}}</div>
            <div class="dot skill VP-figuresSkill">{{countSkills[8]}}</div>
            <div class="dot skill VP-musicSkill">{{countSkills[9]}}</div>
        </div>
    </div>

    <div class='slotWrapper'>
        <h1 class='title'>Work</h1>
        <div class='dot work'></div>
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
.mainBoard {
    /* background-color: #d9ead3ff; */
    background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(147,230,241,1) 0%, rgba(145,192,241,1) 45.5% );
    height: 250px;
    display: grid;
    grid-template-columns: 70% 30%;
    text-align: center;
    color: black;
    margin: 5px;
    padding: 5px;
    border-radius: 3px;
}

.slotSpace {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% 50%; 
}

.dot {
    height: 50px;
    width: 50px;
    border: 10px;
    border-radius: 50%;
    border-color: black;
    margin-right: 10px;  
} 

.item {
    background-color: #ea9999ff;
}

.skill {
    background-color: #6aa84fff;
}

#skillGrid {
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
    grid-template-rows: 50% 50%;
}

.work {
    background-color: #ffe599ff;
    height: 80px;
    width: 80px;
}

.bottle {
    height: 60px;
    width: 60px;
    background-color: whitesmoke;

}

.bottle:hover {
    background-color: red;
    transition: 0.3s;
}

.title {
    color: black;
    margin-left: 5px;
    margin-right: 10px;
    text-align: center;
    align-items: center;
}

.slotWrapper {
    display: flex;
    align-items: center;
}

.music{
    background: url("/images/ITEM-MUSIC.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;
}

.movie{
    background: url("/images/ITEM-FILM.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;
}

.technology{ 
    background: url("/images/ITEM-IT.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;
}

.figures{
    background: url("/images/ITEM-ROBOT.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;

}

.fastaval{
    background: url("/images/ITEM-PINGVIN.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;
}

.bottleSkill{
    background: url("/images/SKILL-FLASKA.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;
}
.workerIncomeSkill{
    background: url("/images/SKILL-GUBBE2PENG.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;
}
.workerCardSkill{
    background: url("/images/SKILL-GUBBEKORT.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;
}
.auctionIncomeSkill{
    background: url("/images/SKILL-1PENG.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;
}
.VP-allSkill{
    background: url("/images/SKILL-5STARS.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;
}
.VP-fastavalSkill{
    background: url("/images/SKILL-PINGVINEX.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;
}
.VP-figuresSkill{
    background: url("/images/SKILL-ROBOTEX.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;
}
.VP-movieSkill{
    background: url("/images/SKILL-FILMEX.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;
}
.VP-technologySkill{
    background: url("/images/SKILL-ITEX.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;
}
.VP-musicSkill{
    background: url("/images/SKILL-MUSICEX.png");
    background-size: 50px 50px;
    background-repeat: no-repeat;
}

</style>

<template>
<div id= "PlayerBoard" >
<div class='mainBoard' :style="{backgroundColor: player.color}" >
    <div class='slotSpace'>
        <div class='slotWrapper'>
            <h1 class='title'> Items </h1>
            <div v-for="(item, index) in player.items" :key="index"> 
                {{item.item}}
            </div>
                <div class="dot item fastaval"> {{fastavalCount}}</div>
                <div class="dot item movie">{{movieCount}}</div>
                <div class="dot item technology">{{technologyCount}}</div>
                <div class="dot item figures"> {{figuresCount}}</div>
                <div class="dot item music"> {{musicCount}}</div>

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
    <div class="dot skill"></div>
    <div class="dot skill"></div>
    <div class="dot skill"></div>
    <div class="dot skill"></div>
    <div class="dot skill"></div>
    <div class="dot skill"></div>
    <div class="dot skill"></div>
    <div class="dot skill"></div>
    <div class="dot skill"></div>
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
  data: function () {
    return {
        fastavalCount: 0,
        movieCount: 0,
        technologyCount: 0,
        figuresCount: 0,
        musicCount: 0   
    }},
  methods: {
      actionMade: function(id){
          console.log(id)
        },
        /*countItems: function(i){
            this.fastavalCount = 0;
            this.movieCount = 0;
            this.technologyCount = 0;
            this.figuresCount = 0;
            this.musicCount= 0;
              if(i === 'fastaval'){
                  this.fastavalCount += 1;
                }
              else if(i === 'movie'){
                  this.movieCount += 1;
              }
              else if(i === 'technology'){
                  this.technologyCount += 1;
              }
              else if(i === 'figures'){
                  this.figuresCount += 1;
              }
              else if(i === 'music'){
                  this.musicCount += 1;
              }
        }*/
    }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainBoard {
    background-color: #d9ead3ff;
    height: 250px;
    display: grid;
    grid-template-columns: 70% 30%;
    text-align: center;
    color: black;
    border: 1px solid black;
    /*margin: 5px;*/
    padding: 5px;
    /*border-radius: 3px;*/
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

</style>

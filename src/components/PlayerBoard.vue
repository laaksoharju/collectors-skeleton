<template>
<div id= "PlayerBoard">
<div class='mainBoard'>
    <div class='slotSpace'>

    <div class='slotWrapper'>
        <h1 class='title'>Itemz</h1>
        <div v-for="(item, index) in player.items" :key="index"> 
            <p> {{item.item + ", "}} </p>
        </div>
            <div class="dot item fastaval"> {{fastavalCount}}</div>
            <div class="dot item movie">{{movieCount}}</div>
            <div class="dot item technology">{{technologyCount}}</div>
            <div class="dot item figures"> {{figuresCount}}</div>
            <div class="dot item music"> {{musicCount}}</div>
        </div>
    </div>
    <div class='slotWrapper'>
    <h1 class='title'>ActionZ</h1>
    <div v-on:click = 'actionMade("A")' class="dot bottle" id='A'></div>
    <div v-on:click = 'actionMade("B")' class="dot bottle" id='B'></div>
    <div v-on:click = 'actionMade("C")' class="dot bottle" id='C'></div>
    <div v-on:click = 'actionMade("D")' class="dot bottle" id='D'></div>
    <div v-on:click = 'actionMade("E")' class="dot bottle" id='E'></div>
    </div>

    <div class='slotWrapper'>
    <h1 class='title'>Skillz</h1>
    <div> {{player.skills[1]}}</div>
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
      countItems: function(){
          let items = this.player.items;
          let i;
          for (i = 0; i < items.length; i++){
              if(items[i].item === 'fastaval'){
                  this.fastavalCount += 1;
                }
              else if(items[i].item === 'movie'){
                  this.movieCount += 1;
              }
              else if(items[i].item === 'technology'){
                  this.technologyCount += 1;
              }
              else if(items[i].item === 'figures'){
                  this.figuresCount += 1;
              }
              else if(items[i].item === 'music'){
                  this.musicCount += 1;
              }
            }
        }
        

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

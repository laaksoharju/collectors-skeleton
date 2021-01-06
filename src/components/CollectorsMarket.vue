<template>
  <div class = "marketPool">

    <div class= "titleMarketPool" >Market Pool</div>
  <!--  {{market}} {{marketValues}} --> <!-- marketValues visar hur de olika kategoriernas valuen är -->


    <div class="chategoryValues" v-for="(value,chategory) in marketValues" :key = "chategory">
      <div>
        {{chategory}}: <br>
        {{value}}
      </div>
    </div>

    <div class = "iconBird"></div>
    <div class = "iconRobot"></div>
    <div class = "iconMusic"></div>
    <div class = "iconFilm"></div>
    <div class = "iconTech"></div>

<!--    <div class = "bottleTwoFlags"></div>
    <div class = "bottleOneFlag"> </div>
    <div class = "bottleCoins"> </div>-->

<div class="buttons" v-for="(p, placementId) in placement" :key="placementId">
    <button id="twoFlags"
      v-if="p.playerId===null && p.placementId ===0"
      :disabled="cannotAfford(p.cost)"
      @click="placeBottle(p)">
      <div class = "bottleTwoFlags">
      </div>
     </button>

     <button id="oneFlag"
       v-if="p.playerId===null && p.placementId ===1"
       :disabled="cannotAfford(p.cost)"
       @click="placeBottle(p)">
       <div class = "bottleOneFlag">
       </div>
    </button>

    <button id="coinsButton"
      v-if="p.playerId===null && p.placementId===2"
      :disabled="cannotAfford(p.cost)"
      @click="placeBottle(p)">
      <div class = "bottleCoins">
      </div>
   </button>

   <!-- <div v-if="p.playerId !== null">
     {{p.playerId}}
   </div> -->

  </div>
</div>
</template>

<script>
export default {
  name: 'CollectorsMarket',
  /*components: {
    CollectorsCard
  },*/
  props: {
    labels: Object,
    player: Object,
    market: Array,
    skillsOnSale: Array,
    marketValues: Object,
    placement: Array
  },
  methods: {
    placeBottle: function (p) {
      if(this.player.playerBottles>0){
      this.$emit('placeBottle', p);
      this.highlightAvailableCards(p.cost);
    }
    },
    cannotAfford: function (cost) {
      let minCost = 100;
      for(let key in this.marketValues) {
        if (cost + this.marketValues[key] < minCost)
          minCost = cost + this.marketValues[key]
      }
      return (this.player.money < minCost);
    },
  highlightAvailableCards: function () {           //LÖST!! :D : problemet är  if vilkoret! highlitar sista kortet bara första gången!
      //for (let i = 0; i < this.skillsOnSale.length; i += 1) { gamla villkoret
      for (let i = this.skillsOnSale.length -1 ; i >= 0 ; i -= 1) {     //kollar baklänges!
        if (this.skillsOnSale[i].x > 0) {                  // if-sats som undersöker om platsen i array är tom = kort taget
          this.$set(this.skillsOnSale[i], "available", true);
          break;
        }
      /*  else {
          this.$set(this.skillsOnSale[i], "available", false);
        } behöver vi ej ha denna else nu med ändrat villkor*/
      }
    }
  }
}
</script>


<style scoped>
.titleMarketPool {
  font-style: italic;
  font-size: 50px;
  text-shadow: 2px 2px 4px #4678CC;
  font-size: 20px;
}
.marketPool{
  grid-column: 3/span 5;
  grid-row: 11/span 4;
  width: auto;
  height: auto;
  background-color: #cfdcf2;
  color: black;
  display: grid;
  grid-template-columns: repeat(5, 90px);
  grid-template-rows: repeat(5, 27.5px);
  border-bottom: 2px solid #4C7B80;
  border-top: 2px solid #4C7B80;
  }
.chategoryValues {
  grid-column: auto;
  grid-row: 5;
  font-size: 90%;
}
  .iconBird {
    width: 30px;
    height: 40px;
    background-position:center;
    background-image: url('/images/iconBird.PNG');
    background-size: cover;
    place-self: center;
    grid-column: 1;
    grid-row: 10;
  }
  .iconRobot {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconRobot.PNG');
    background-size: cover;
    place-self: center;
    grid-column: 4;
    grid-row: 10;
  }
  .iconMusic {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconMusic.PNG');
    background-size: cover;
    place-self: center;
    grid-column: 5;
    grid-row: 10;
  }
  .iconFilm {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconFilm.PNG');
    background-size: cover;
    place-self: center;
    grid-column: 2;
    grid-row: 10;
  }
  .iconTech {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconTech.PNG');
    background-size: cover;
    place-self: center;
    grid-column: 3;
    grid-row: 10;
  }
  .buttons{
  /*  place-self: stretch;*/
  }
  .buttons div:hover {
    transform: scale(1.5)translate(0,0);
    z-index: 1;
  }
  .bottleCoins {
    width:50px;
    height:50px;
    background-image: url('/images/marketbottletwocoins.PNG');
    background-size: cover;
    grid-column: 2;
    grid-row: 2;
  }
  #coinsButton {
    background-color: #cfdcf2;
    border-radius: 5px;
    border: 2px solid #6894DF;
  }
  .bottleOneFlag {
    width:50px;
    height:50px;
    background-image: url('/images/marketbottleoneflagg.PNG') ;
    background-size: cover;
    grid-column: 3;
    grid-row: 2;
  }
  #oneFlag {
    background-color: #cfdcf2;
    border-radius: 5px;
    border: 2px solid #6894DF;
  }
.bottleTwoFlags {
  width:50px;
  height:50px;
  background-image: url('/images/marketbottletwoflaggs.PNG') ;
  background-size: cover;
  grid-column: 4;
  grid-row: 2;
}
#twoFlags {
  background-color: #cfdcf2;
  border-radius: 5px;
  border: 2px solid #6894DF;
}


@media screen and (max-width: 800px) {
  .titleMarketPool {
    font-style: italic;
    font-size: 50px;
    text-shadow: 2px 2px 4px #4678CC;
    font-size: 20px;
  }
  .marketPool{
    grid-column: 3/span 5;
    grid-row: 14/span 4;
    width: auto;
    height: auto;
    background-color: #cfdcf2;
    color: black;
    display: grid;
    /*grid-template-columns: repeat(5, 90px);*/
    grid-template-rows: repeat(5, 27.5px);
    border-right: 2px solid #4C7B80;
    border-top: 2px solid #4C7B80;

    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));

    }
  .chategoryValues {
    grid-column: auto;
    grid-row: 5;
    font-size: 90%;
  }
    .iconBird {
      width: 30px;
      height: 40px;
      background-position:center;
      background-image: url('/images/iconBird.PNG');
      background-size: cover;
      place-self: center;
      grid-column: 1;
      grid-row: 10;
    }
    .iconRobot {
      width: 30px;
      height: 40px;
      background-image: url('/images/iconRobot.PNG');
      background-size: cover;
      place-self: center;
      grid-column: 4;
      grid-row: 10;
    }
    .iconMusic {
      width: 30px;
      height: 40px;
      background-image: url('/images/iconMusic.PNG');
      background-size: cover;
      place-self: center;
      grid-column: 5;
      grid-row: 10;
    }
    .iconFilm {
      width: 30px;
      height: 40px;
      background-image: url('/images/iconFilm.PNG');
      background-size: cover;
      place-self: center;
      grid-column: 2;
      grid-row: 10;
    }
    .iconTech {
      width: 30px;
      height: 40px;
      background-image: url('/images/iconTech.PNG');
      background-size: cover;
      place-self: center;
      grid-column: 3;
      grid-row: 10;
    }
    .buttons{
    /*  place-self: stretch;*/
    }
    .buttons div:hover {
      transform: scale(1.5)translate(0,0);
      z-index: 1;
    }
    .bottleCoins {
      width:50px;
      height:50px;
      background-image: url('/images/marketbottletwocoins.PNG');
      background-size: cover;
      grid-column: 2;
      grid-row: 2;
    }
    #coinsButton {
      background-color: #cfdcf2;
      border-radius: 5px;
      border: 2px solid #6894DF;
    }
    .bottleOneFlag {
      width:50px;
      height:50px;
      background-image: url('/images/marketbottleoneflagg.PNG') ;
      background-size: cover;
      grid-column: 3;
      grid-row: 2;
    }
    #oneFlag {
      background-color: #cfdcf2;
      border-radius: 5px;
      border: 2px solid #6894DF;
    }
  .bottleTwoFlags {
    width:50px;
    height:50px;
    background-image: url('/images/marketbottletwoflaggs.PNG') ;
    background-size: cover;
    grid-column: 4;
    grid-row: 2;
  }
  #twoFlags {
    background-color: #cfdcf2;
    border-radius: 5px;
    border: 2px solid #6894DF;
  }
}
  </style>

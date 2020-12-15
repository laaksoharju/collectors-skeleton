<template>
  <div class = "marketPool">
    <div class= "titleMarketPool" >Market Pool</div>
    {{market}} {{marketValues}} <!-- marketValues visar hur de olika kategoriernas valuen är -->
    <div class = "iconBird"></div>
    <div class = "iconRobot"></div>
    <div class = "iconMusic"></div>
    <div class = "iconFilm"></div>
    <div class = "iconTech"></div>

<!--    <div class = "bottleTwoFlags"></div>
    <div class = "bottleOneFlag"> </div>
    <div class = "bottleCoins"> </div>-->

<div class="buttons" v-for="(p, index) in placement" :key="index">
    <button
      v-if="p.playerId===null && index ===0 "
      :disabled="cannotAfford(p.cost)"
      @click="placeBottle(p)">
      <div class = "bottleTwoFlags">
      </div>
     </button>

     <button
       v-if="p.playerId===null && index===1"
       :disabled="cannotAfford(p.cost)"
       @click="placeBottle(p)">
       <div class = "bottleOneFlag">
       </div>
    </button>

    <button
      v-if="p.playerId===null && index===2"
      :disabled="cannotAfford(p.cost)"
      @click="placeBottle(p)">
      <div class = "bottleCoins">
      </div>
   </button>

   <div v-if="p.playerId !== null">
     {{p.playerId}}
   </div>

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
      this.$emit('placeBottle', p.cost);
      this.highlightAvailableCards();
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
  text-shadow: 2px 2px 4px blue;
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
    grid-column: 2;
    grid-row: 10;
  }

  .iconMusic {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconMusic.PNG');
    background-size: cover;
    place-self: center;
    grid-column: 3;
    grid-row: 10;
  }
  .iconFilm {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconFilm.PNG');
    background-size: cover;
    place-self: center;
    grid-column: 4;
    grid-row: 10;
  }
  .iconTech {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconTech.PNG');
    background-size: cover;
    place-self: center;
    grid-column: 5;
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
  .bottleOneFlag {
    width:50px;
    height:50px;
    background-image: url('/images/marketbottleoneflagg.PNG') ;
    background-size: cover;
    grid-column: 3;
    grid-row: 2;
  }
.bottleTwoFlags {
  width:50px;
  height:50px;
  background-image: url('/images/marketbottletwoflaggs.PNG') ;
  background-size: cover;
  grid-column: 4;
  grid-row: 2;
}
  </style>

<template>
  <div class = "marketPool">
    Market Pool
    <div class = "iconBird"></div>
    <div class = "iconRobot"></div>
    <div class = "iconMusic"></div>
    <div class = "iconFilm"></div>
    <div class = "iconTech"></div>

<!--    <div class = "bottleTwoFlags"></div>
    <div class = "bottleOneFlag"> </div>
    <div class = "bottleCoins"> </div>-->
  <div> </div>
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

  <div class = "start-market" >
    <div v-for="(card, index) in skillsOnSale" :key="index">
      <CollectorsCard
        :card="card"
        :availableAction="card.available"
        @doAction="startMarket(card)"/>
      </div>
  </div>

<!--  <div class = "cardUpForMarket">
    <CollectorsCard :card="card"/>
  </div> -->

</div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsMarket',
  components: {
  CollectorsCard
},
  props: {
    labels: Object,
    player: Object,
    skillsOnSale: Array,
    marketValues: Object,
    placement: Array,
  },
  methods: {
    startMarket: function (card) {
      if (card.available){
        console.log("TEST");
        this.$emit('startMarket', card);
        this.highlightAvailableCards();
      }
    },
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
<<<<<<< HEAD
  highlightAvailableCards: function () {
      for (let i = 0; i < this.skillsOnSale.length; i += 1) {
        if (i=== this.skillsOnSale.length-1) {
=======
    highlightAvailableCards: function () {

      for (let i = 0; i < this.skillsOnSale.length; i += 1) { //här, leta reda på korten längst bak, skills, auction
        if (this.marketValues[this.skillsOnSale[-1].item]) {
>>>>>>> 2793aa0831b4bb3a8e75ee768f7daff74fb69ccf
          this.$set(this.skillsOnSale[i], "available", true);
        }
        else {
          this.$set(this.skillsOnSale[i], "available", false);
        }
      }
    },



  }
}

</script>




<style scoped>


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
    grid-row: 3;
  /*  place-self: stretch;*/
  }

  .buttons div:hover {
    transform: scale(1.5)translate(0,0);
    z-index: 1;
  }
  .cardUpForMarket {
  transform: scale(0.45);
  grid-column: 1;
  grid-row: 4;
  height: 70px;
  width: 50px;
  }

  .start-market{
    transform: scale(0.25);
  }
  .start-market div:hover{
    transform: scale(1.25)translate(15%,0);
    z-index: 1;
  }

  .bottleCoins {
    width:50px;
    height:50px;
    background-image: url('/images/marketbottletwocoins.PNG');
    background-size: cover;
    grid-column: 3;

  }
  .bottleOneFlag {
    width:50px;
    height:50px;
    background-image: url('/images/marketbottleoneflagg.PNG') ;
    background-size: cover;
    grid-column: 4;

  }
.bottleTwoFlags {
  width:50px;
  height:50px;
  background-image: url('/images/marketbottletwoflaggs.PNG') ;
  background-size: cover;
  grid-column: 5;

}
  </style>

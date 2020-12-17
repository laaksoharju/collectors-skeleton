<template>
  <div class = "workPool">
    <div class= "titleWorkPool" >Work Pool</div>

    <div class = "quarterImage">
      <div class= "quarter1" v-if="currentRound === 1" >
      </div>
      <div class= "quarter2" v-if="currentRound === 2" >
      </div>
      <div class= "quarter3" v-if="currentRound === 3" >
      </div>
      <div class= "quarter4" v-if="currentRound === 4" >
      </div>
    </div>

    <div class="buttons" v-for="(p, index) in placement" :key="index">

      <button id="alt1" v-if="p.playerId===null && p.cost===-1"
      :disabled="cannotAfford(p.cost)"
      @click = "placeBottle(p)" >
        <div class = "Alt1">
        </div>
      </button>

      <button id="alt2" v-if="p.playerId===null && p.cost===1 "
      :disabled="cannotAfford(p.cost)"
      @click="placeBottle(p)">
        <div class = "Alt2">
        </div>
      </button>

        <button id="alt3" v-if="p.playerId===null && p.cost===0 && index === 2"
        :disabled="cannotAfford(p.cost)"
        @click="placeBottle(p)">
          <div class = "Alt3">
          </div>
        </button>
        <button id="alt4" v-if="p.playerId===null && p.cost===0 && index === 3"
        :disabled="cannotAfford(p.cost)"
        @click="placeBottle(p)">
          <div class = "Alt4">
          </div>
        </button>
    </div>
<!--
    <div class = "Alt1"></div>
    <div class = "Alt2"></div>
    <div class = "Alt3"></div>
    <div class = "Alt4"></div> -->
  </div>

</template>

<script>
// import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsWork',
  components: {
  //  CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    currentRound: Number,
    placement: Array,
    skillsOnSale: Array,
    marketValues: Object,

  },
  methods: {
    cannotAfford: function (cost) {
      let minCost = 100;
      for(let key in this.marketValues) {
        if (cost + this.marketValues[key] < minCost)
          minCost = cost + this.marketValues[key]
      }
      return (this.player.money < minCost);
    },
    cardCost: function (card) {
      return this.marketValues[card.market];
    },
    placeBottle: function (p) {
      this.$emit('placeBottle', p.cost);
      this.highlightAvailableCards(p.cost);
    },
    highlightAvailableCards: function (cost=100) {
      for (let i = 0; i < this.skillsOnSale.length; i += 1) {
        if (this.marketValues[this.skillsOnSale[i].item] <= this.player.money - cost) {
          this.$set(this.skillsOnSale[i], "available", true);
        }
        else {
          this.$set(this.skillsOnSale[i], "available", false);
        }
        this.chosenPlacementCost = cost;
      }
    },
    }
  }
</script>

<style scoped>



.workPool{
  grid-column: 3/span 5;
  grid-row: 6/span 5;
  width: auto;
  height: auto;
  display:grid;
  grid-template-columns: repeat(2, 224px);
  grid-template-rows: repeat(4,55px);
  grid-auto-flow: column;
  background-color: #f5f2cc;
  color: black;
  /*border: 3px solid #4C7B80;*/
  border-top: 2px solid #4C7B80;
}

.titleWorkPool {
  font-style: italic;
  font-size: 50px;
  text-shadow: 2px 2px 4px yellow;
  font-size: 20px;
  grid-column: 2;
}
.buttons{
}

.quarterImage {
  grid-column: 2;
  grid-row: 3;
}
.quarter1 {
  grid-column: 2 ;
  grid-row: 1;
  width: 140px;
  height: 62px;
  background-image: url('/images/quarterTile1.png');
  background-size: cover;
}
.quarter2 {
  grid-column: 2 ;
  grid-row: 1;
  width: 140px;
  height: 62px;
  background-image: url('/images/quarterTile2.png');
  background-size: cover;
}
.quarter3 {
  grid-column: 2 ;
  grid-row: 1;
  width: 140px;
  height: 62px;
  background-image: url('/images/quarterTile3.png');
  background-size: cover;
}
.quarter4 {
  grid-column: 2 ;
  grid-row: 1;
  width: 140px;
  height: 62px;
  background-image: url('/images/quarterTile4.png');
  background-size: cover;
}

.Alt1 {
  width: 120px;
  height: 45px;
  background-image: url('/images/WorkPoolAlt1.jpg');
  background-size: cover;
}
#alt1 {
  background-color: #f5f2cc;
  border-radius: 5px;
  border: 2px solid #DDD359;
}
.Alt2 {
  width: 120px;
  height: 45px;
  background-image: url('/images/WorkPoolAlt2.jpg');
  background-size: cover;
}
#alt2 {
  background-color: #f5f2cc;
  border-radius: 5px;
  border: 2px solid #DDD359;
}
.Alt3 {
  width: 120px;
  height: 45px;
  background-image: url('/images/WorkPoolAlt3.jpg');
  background-size: cover;
}
#alt3 {
  background-color: #f5f2cc;
  border-radius: 5px;
  border: 2px solid #DDD359;
}
.Alt4 {
  width: 120px;
  height: 45px;
  background-image: url('/images/WorkPoolAlt4.jpg');
  background-size: cover;
}
#alt4 {
  background-color: #f5f2cc;
  border-radius: 5px;
  border: 2px solid #DDD359;
}

</style>

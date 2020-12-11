<template>
  <div class = "skillPool">
    Skill Pool


<div class="buttons" v-for="(p, index) in placement" :key="index">
  <button v-if="p.playerId===null & p.cost===0"
  :disabled="cannotAfford(p.cost)"
  @click="placeBottle(p)">
    <div class = "EnergyBottles">
    </div>
  </button>

  <button v-if="p.playerId===null & p.cost===1"
  :disabled="cannotAfford(p.cost)"
  @click="placeBottle(p)">
    <div class = "EnergyBottlesCoin">
    </div>
  </button>


<div v-if="p.playerId !== null">
  {{p.playerId}}
</div>

</div>





      <div class = "get-skill" >
        <div v-for="(card, index) in skillsOnSale" :key="index">
          <CollectorsCard
            :card="card"
            :availableAction="card.available"
            @doAction="getSkill(card)"
           />
        </div>
      </div>
  </div>

</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsGetSkills',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    skillsOnSale: Array,
    marketValues: Object,
    placement: Array
  },
  methods: {
    getSkill: function (card) {

      if (card.available){
        this.$emit('getSkill', card);
        this.highlightAvailableCards();
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

.skillPool{
  grid-column: 1 / span 2;
  grid-row: 2/span 13 ;
  width: auto;
  height: auto;
  background-color: #dce5cc;
  color: black;
  padding-left: 10px;
  display: grid;
  grid-template-columns: repeat(3, 50px);
  grid-template-rows: repeat(6,50px);
  grid-row-gap: 25px;
  grid-column-gap: 10px;
  grid-auto-flow: column;
  }

.EnergyBottles{
  width:50px;
  height:50px;
  background-image:  url('/images/Gain-skill-bottle.png');
  background-size: cover;
}

.EnergyBottlesCoin{
  width:50px;
  height:50px;
  background-image:  url('/images/Gain-skill-bottle-coin.png');
  background-size: cover;
}
.get-skill{
  transform: scale(0.25);
}
.get-skill div:hover{
  transform: scale(1.25)translate(15%,0);
  z-index: 1;
}

.buttons{
  background-color: #dce5cc;
  border-color: #dce5cc;
}

.buttons div:hover {
  transform: scale(1.5)translate(0,0);
  z-index: 1;
}
</style>

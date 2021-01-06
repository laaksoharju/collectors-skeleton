<template>
  <div class = "skillPool">
  <div class= "titleSkillPool" >Skill Pool</div>


<div class="buttons" v-for="(p, placementId) in placement" :key="placementId">

  <button id="noCoinButton" v-if="p.playerId===null && p.cost===0 && p.placementId === 0"
  :disabled="cannotAfford(p.cost)"
  @click="placeBottle(p)">
    <div class = "EnergyBottles">
    </div>
  </button>


  <button id="noCoinButton" v-if="p.playerId===null && p.cost===0 && p.placementId === 1"
  :disabled="cannotAfford(p.cost)"
  @click="placeBottle(p)">
    <div class = "EnergyBottles">
    </div>
  </button>

  <button id="noCoinButton" v-if="p.playerId===null && p.cost===0 && p.placementId === 2"
  :disabled="cannotAfford(p.cost)"
  @click="placeBottle(p)">
    <div class = "EnergyBottles">
    </div>
  </button>

  <button id="coinButton" v-if="p.playerId===null && p.cost===1 && p.placementId === 3 "
  :disabled="cannotAfford(p.cost)"
  @click="placeBottle(p)">
    <div class = "EnergyBottlesCoin">
    </div>
  </button>

  <button id="coinButton" v-if="p.playerId===null && p.cost===1 && p.placementId === 4 "
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
      if(this.player.playerBottles>0){
      this.$emit('placeBottle', p);
      this.highlightAvailableCards(p.cost);
    }
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
.titleSkillPool {
  grid-column: 1 / span 2;
  font-style: italic;
  font-size: 50px;
  text-shadow: 2px 2px 4px green;
  font-size: 20px;
}
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
  border: 2px solid #4C7B80;
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
  grid-row: 2;
}
.get-skill div:hover{
  transform: scale(1.25)translate(15%,0);
  z-index: 1;
}
.buttons{
}
#noCoinButton {
  background-color: #dfeccc;
  border-radius: 5px;
  border: 2px solid #A3B77F;
}
#coinButton {
  background-color: #dfeccc;
  border-radius: 5px;
  border: 2px solid #A3B77F;
}
.buttons div:hover {
  transform: scale(1.5)translate(0,0);
  z-index: 1;
}

@media screen and (max-width: 800px) {
  .titleSkillPool {
    grid-column: 1 / span 2;
    font-style: italic;
    font-size: 50px;
    text-shadow: 2px 2px 4px green;
    font-size: 20px;
  }
  .skillPool{
    grid-column: 1 / span 2;
    grid-row: 5/span 13 ;
    width: auto;
    height: auto;
    background-color: #dce5cc;
    color: black;
    padding-left: 10px;
    display: grid;
    /*grid-template-columns: repeat(3, 50px);*/
    grid-template-rows: repeat(6,50px);
    grid-row-gap: 25px;
    grid-column-gap: 10px;
    grid-auto-flow: column;
    border: 2px solid #4C7B80;

    grid-template-columns: repeat(auto-fit, minmax(-10px, 1fr));

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
    grid-row: 2;
  }
  .get-skill div:hover{
    transform: scale(1.25)translate(15%,0);
    z-index: 1;
  }
  .buttons{
  }
  #noCoinButton {
    background-color: #dfeccc;
    border-radius: 5px;
    border: 2px solid #A3B77F;
  }
  #coinButton {
    background-color: #dfeccc;
    border-radius: 5px;
    border: 2px solid #A3B77F;
  }
  .buttons div:hover {
    transform: scale(1.5)translate(0,0);
    z-index: 1;
  }
}
</style>

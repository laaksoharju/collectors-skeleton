<template>

  <div class = "itemPool">
   Item Pool

<!--Ser till att alt hamnar i en rad, med en tom column innan -->
<div></div>

   <div class="buttons" v-for="(p, index) in placement" :key="index">
     <button
       v-if="p.playerId===null & p.cost===1"
       :disabled="cannotAfford(p.cost)"
       @click="placeBottle(p)">
       <div class = "ItemBottleCoinOne">
       </div>

      </button>

      <button
        v-if="p.playerId===null & p.cost===2"
        :disabled="cannotAfford(p.cost)"
        @click="placeBottle(p)">
        <div class = "ItemBottleCoinTwo">
        </div>
     </button>

     <button
       v-if="p.playerId===null & p.cost===3"
       :disabled="cannotAfford(p.cost)"
       @click="placeBottle(p)">
       <div class = "ItemBottleCoinThree">
       </div>
    </button>

     <div v-if="p.playerId !== null">
       {{p.playerId}}
     </div>
   </div>

<!--Ser till att alt hamnar i en rad, med en tom column innan -->
<div></div>

     <div class="itemCard" v-for="(card, index) in itemsOnSale" :key="index">
       <CollectorsCard
         :card="card"
         :availableAction="card.available"
         @doAction="buyCard(card)"/>
   <!--    {{ cardCost(card) }} -->
     </div>


  </div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsBuyItem',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    itemsOnSale: Array,
    marketValues: Object,
    placement: Array
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
      for (let i = 0; i < this.itemsOnSale.length; i += 1) {
        if (this.marketValues[this.itemsOnSale[i].item] <= this.player.money - cost) {
          this.$set(this.itemsOnSale[i], "available", true);
        }
        else {
          this.$set(this.itemsOnSale[i], "available", false);
        }
        this.chosenPlacementCost = cost;
      }
    },
    buyCard: function (card) {
      if (card.available) {
        this.$emit('buyCard', card)
        this.highlightAvailableCards()
      }
    },
    }
  }
</script>

<style scoped>


.itemPool{
  grid-column: 3/span 5 ;
  grid-row: 2/span 4;
  width: auto;
  height: auto;
/*  grid-template-columns: repeat(100, 12px);
  grid-template-rows: repeat(100,150px);*/
  background-color: #f0d9cc ;
  color: black;

  display: grid;
  grid-template-columns: repeat(6, 50px);
  grid-template-rows: repeat(3,50px);
  grid-column-gap: 25px;
  grid-auto-flow: row;
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.buttons{
  grid-row: 1;
  place-self: stretch;
  background-color: #f0d9cc;
}

.buttons div:hover {
  transform: scale(1.5)translate(0,0);
  z-index: 1;
}

.itemCard {
  grid-row: 3;
  transform: scale(0.25);
  place-self:center;
}

.itemCard div:hover{
  transform: scale(2)translate(-25%,0);
  z-index: 1;
}

.ItemBottleCoinOne{
  width:50px;
  height:50px;
  background-image:  url('/images/item-bottle-coin-one.png');
  background-size: cover;
}

.ItemBottleCoinTwo{
  width:50px;
  height:50px;
  background-image:  url('/images/item-bottle-coin-two.png');
  background-size: cover;
}

.ItemBottleCoinThree{
  width:50px;
  height:50px;
  background-image:  url('/images/item-bottle-coin-three.png');
  background-size: cover;
}
</style>

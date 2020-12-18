<template>
  <div id="BuyActionDiv">
    <h1 style="text-align: center"><img class="title_img" src="images/buy.png">{{ labels.buyCard }}</h1>
    <div class="buy-cards">
      <div v-for="(card, index) in itemsOnSale" :key="index" style="color:black">
        {{labels.valueRaised}}: +{{ cardCost(card) }}
        <CollectorsCard
        :card="card"
        :availableAction="card.available"
        @doAction="buyItem(card)"/>
      </div>
    </div>
    <div class="buttons" v-for="(p, index) in placement" :key="index">
      <button
      v-if="p.playerId===null"
      :disabled="cannotAfford(p.cost) || player.bottles < 1"
      @click="placeBottle(p)" >
      <!-- ${{p.cost}} -->
      <img :src='p.img' style="width:55%">
    </button>
    <div v-if="p.playerId !== null" style="color:black">
      {{p.playerId}}
    </div>
  </div>
</div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsBuyActions',
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
      return this.marketValues[card.item];
    },

    placeBottle: function (p) {
      console.log(this.player.bottles);
      this.$emit('placeBottle', p.cost);
      this.highlightAvailableCards(p.cost)
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
      for (let i = 0; i < this.player.hand.length; i += 1) {
        if (this.marketValues[this.player.hand[i].item] <= this.player.money - cost) {
          this.$set(this.player.hand[i], "available", true);
          this.chosenPlacementCost = cost;
        }
        else {
          this.$set(this.player.hand[i], "available", false);
          this.chosenPlacementCost = cost;
        }
      }
    },
    buyItem: function (card) {
      if (card.available) {
        this.$emit('buyItem', card)
        this.highlightAvailableCards()
      }
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.title_img {
  height: 65px;
  width: 70px;
  vertical-align: middle;
  padding-right: 10px;
}

.buy-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
  grid-template-rows: repeat(auto-fill, 260px);
}
.buy-cards div {
  transform: scale(0.8)translate(-10%,-10%);
  transition:0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}
.buy-cards div:hover {
  transform: scale(0.9)translate(-10%,-10%);
  z-index: 1;
}

.buttons {
  display: grid;
  float: left;
  grid-template-columns: repeat(auto-fill, 130px);
  transform: scale(0.8)translate(10%,-10%);
}

.buttons button {
  border-radius: 10px;
  transition:0.15s;
  transition-timing-function: ease-in-out;
}

.buttons button:hover {
  transform: scale(1.05);
  transition:0.2s;
  transition-timing-function: ease-in-out;

}

#BuyActionDiv h1, h2, h3, p  {
  color: black;
}

</style>

<template>
  <div class="buttons">
    <div v-for="(p, index) in placement" :key="index">
      <button
        class="btn-style"
        v-if="p.playerId === null"
        :disabled="cannotAfford(p.cost)"
        @click="placeBottle(p)"
      >
        ${{ p.cost }}
      </button>
      <div v-if="p.playerId !== null">
        {{ p.playerId }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Bottles",

  props: {
    labels: Object,
    player: Object,
    itemsOnSale: Array,

    marketValues: Object,
    placement: Array,
  },
  methods: {
    cannotAfford: function (cost) {
      let minCost = 100;
      for (let key in this.marketValues) {
        console.log(this.marketValues)
        if (cost + this.marketValues[key] < minCost)
          minCost = cost + this.marketValues[key];
      }
      return this.player.money < minCost;
    },
    cardCost: function (card) {
      return this.marketValues[card.market];
    },
    placeBottle: function (p) {
      this.$emit("placeBottle", p.cost);
      this.highlightAvailableCards(p.cost);
    },
    isAvailableCards: function (card, cost) {
      if (this.marketValues[card.item] <= this.player.money - cost) {
        this.$set(card, "available", true);
      } else {
        this.$set(card, "available", false);
      }
    },
    highlightAvailableCards: function (cost = 100) {
      for (let i = 0; i < this.itemsOnSale.length; i += 1) {
        this.isAvailableCards(this.itemsOnSale[i], cost);
        // if (
        //   this.marketValues[this.itemsOnSale[i].item] <=
        //   this.player.money - cost
        // ) {
        //   this.$set(this.itemsOnSale[i], "available", true);
        // } else {
        //   this.$set(this.itemsOnSale[i], "available", false);
        // }
        // this.chosenPlacementCost = cost;
      }
      for (let i = 0; i < this.player.hand.length; i += 1) {
        this.isAvailableCards(this.player.hand[i], cost);
      }
    },
    buyCard: function (card) {
      if (card.available) {
        this.$emit("buyCard", card);
        this.highlightAvailableCards();
      }
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.buy-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
}
.buttons {
  position: relative;
  z-index: 3;
}

.cardslots div {
  transform: scale(0.5) translate(-50%, -50%);
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}
.btn-style {
  width: 5em;
  height: 5em;
  background-image: url("/images/bottle.jpg");
  background-size: 100% 100%;

  border-radius: 10px;
  color: white;
  text-align: center;
  padding: 0.5rem;

  font-size: 0.5rem;
}
</style>
<template>
  <div class="buy-cards">
    <div v-for="(card, index) in itemsOnSale" :key="index" class="cardslots">
      <CollectorsCard
        :card="card"
        :availableAction="card.available=deckCardAvailable"
        :buttonClicked="buttonClicked"
        @doAction="buyCard(card)"
      />
    </div>
  </div>
</template>

<script>
import CollectorsCard from "@/components/CollectorsCard.vue";

export default {
  name: "CollectorsBuyActions",
  components: {
    CollectorsCard,
  },
  props: {
    labels: Object,
    player: Object,
    itemsOnSale: Array,
    deckCardAvailable:Boolean,
    marketValues: Object,
    placement: Array,
    buttonClicked: Object,
  },
  methods: {
    cannotAfford: function (cost) {
      let minCost = 100;
      for (let key in this.marketValues) {
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

        console.log('this.buttonClicked CollectorsBuyAction: ' + this.buttonClicked);
        this.$emit("buyCard", {card: card, p: this.buttonClicked});
        this.highlightAvailableCards();
      }
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.buy-cards {
  display: grid;
  grid-template-columns:repeat(5,1fr);
  grid-gap: 1rem;
}


.cardslots div {
  transform: scale(0.5) translate(-50%, -50%);
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}
</style>

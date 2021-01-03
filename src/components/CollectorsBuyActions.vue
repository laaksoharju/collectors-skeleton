<template>
  <div class="buy-cards">
    <div
      v-for="(card, index) in itemsOnSale"
      :key="index"
      :class="[`cardslots ${index}`]"
      :id="!deckCardAvailable === true ? `cardid` : ''"
    >
      <!-- {{ deckCardAvailable }} -->
      <CollectorsCard
        :card="card"
        :availableAction="(card.available = deckCardAvailable)"
        :buttonClicked="buttonClicked"
        :index="index"
        :deckCardAvailable="deckCardAvailable"
        v-if="deckCard === true"
        @doAction="buyCard(card)"
      />
      <CollectorsCard
        :card="card"
        :index="index"
        v-else-if="handCardAvailable"
        :availableAction="(card.available = handCardAvailable)"
        :buttonClicked="buttonClicked"
        @doAction="buyCard(card)"
      />

      <CollectorsCard
        :card="card"
        :index="index"
        :deckCardAvailable="deckCardAvailable"
        v-else
        :availableAction="card.available"
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
    deckCardAvailable: Boolean,
    handCardAvailable: Boolean,
    marketValues: Object,
    placement: Array,
    buttonClicked: Object,
  },
  data: function () {
    return {
      deckCard: this.deckCardAvailable,
    };
  },

  methods: {
    // cannotAfford: function (cost) {
    //   let minCost = 100;
    //   for (let key in this.marketValues) {
    //     if (cost + this.marketValues[key] < minCost)
    //       minCost = cost + this.marketValues[key];
    //   }
    //   return this.player.money < minCost;
    // },
    // cardCost: function (card) {
    //   return this.marketValues[card.market];
    // },
    // placeBottle: function (p) {
    //   console.log("Shittt");
    //   this.$emit("placeBottle", p.cost);
    //   this.highlightAvailableCards(p.cost);
    // },
    // isAvailableCards: function (card, cost) {
    //   if (this.marketValues[card.item] <= this.player.money - cost) {
    //     this.$set(card, "available", true);
    //   } else {
    //     this.$set(card, "available", false);
    //   }
    // },
    // highlightAvailableCards: function (cost = 100) {
    //   for (let i = 0; i < this.itemsOnSale.length; i += 1) {
    //     this.isAvailableCards(this.itemsOnSale[i], cost);
    //     // if (
    //     //   this.marketValues[this.itemsOnSale[i].item] <=
    //     //   this.player.money - cost
    //     // ) {
    //     //   this.$set(this.itemsOnSale[i], "available", true);
    //     // } else {
    //     //   this.$set(this.itemsOnSale[i], "available", false);
    //     // }
    //     // this.chosenPlacementCost = cost;
    //   }
    //   for (let i = 0; i < this.player.hand.length; i += 1) {
    //     this.isAvailableCards(this.player.hand[i], cost);
    //   }
    // },
    buyCard: function (card) {
      if (card.available || this.deckCardAvailable === true) {
        this.$emit("buyCard", { card: card, p: "buttonClicked" });
        // this.highlightAvailableCards();
      }
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.buy-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 1rem;
}

.cardslots div {
  transform: scale(0.5) translate(-50%, -50%);
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}
/* .\30 {
  position: relative;
  background-color: black;
  background-position: 20px 20px;
} */
</style>

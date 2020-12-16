<template>
  <div id="upForAuction-section" class="board-section">
    <div id='buy-cards'>
      Up for auction
        <div class="cardslots" v-for="(card, index) in upForAuction" :key="index">
            <CollectorsCard
              :card="card"
              :availableAction="card.available"
              @doAction="buyCard(card)"
            /> 
        </div>
      </div>
  </div>
</template>

<script>
import CollectorsCard from "@/components/CollectorsCard.vue";

export default {
  name: "UpForAuction",
  components: {
    CollectorsCard,
  },
  props: {
    labels: Object,
    player: Object,
    upForAuction: Array,
    marketValues: Object,
    placement: Array,
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
    highlightAvailableCards: function (cost = 100) {
      for (let i = 0; i < this.upForAuction.length; i += 1) {
        if (
          this.marketValues[this.upForAuction[i].item] <=
          this.player.money - cost
        ) {
          this.$set(this.upForAuction[i], "available", true);
        } else {
          this.$set(this.upForAuction[i], "available", false);
        }
        this.chosenPlacementCost = cost;
      }
      for (let i = 0; i < this.player.hand.length; i += 1) {
        if (
          this.marketValues[this.player.hand[i].item] <=
          this.player.money - cost
        ) {
          this.$set(this.player.hand[i], "available", true);
          this.chosenPlacementCost = cost;
        } else {
          this.$set(this.player.hand[i], "available", false);
          this.chosenPlacementCost = cost;
        }
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
<style scoped>
.buy-cards {
  width: 80%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
  grid-template-rows: repeat(auto-fill, 180px);
}
.button-section {
  width: 20%;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
}

.board-section {
  width: 50%;
  padding: 10px;
  align-items: center;
  display: flex;
  flex-direction: row-reverse;
  border: 1px solid #19181850;
}

#upForAuction-section {
background: gray;
}

.cardslots div:hover {
  transform: scale(1) translate(-25%, 0);
  z-index: 1;
}
</style>

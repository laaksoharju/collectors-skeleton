<template>
  <div>
    <!-- <h1>{{ labels.buySkillCard }}</h1> -->
    <div id="skill-section" class="board-section">
      <div class="buy-cards">
        <div class='cardslots' v-for="(card, index) in skillsOnSale" :key="index">
          <CollectorsCard
            :card="card"
            :availableAction="card.available"
            @doAction="buySkillCard(card)"
          />
          {{ cardCost(card) }}
        </div>
      </div>
      <div class='button-section'>
        <div class="buttons" v-for="(p, index) in placement" :key="index">
          <button
            v-if="p.playerId === null"
            :disabled="buttonDisabled(p.cost)"
            @click="placeBottle(p)"
          >
            ${{ p.cost }}
          </button>
          <div v-if="p.playerId !== null">
            {{ p.playerId }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CollectorsCard from "@/components/CollectorsCard.vue";

export default {
  name: "CollectorsBuySkill",
  components: {
    CollectorsCard,
  },
  props: {
    labels: Object,
    player: Object,
    skillsOnSale: Array,
    marketValues: Object,
    placement: Array,
  },
  methods: {
    buttonDisabled:function (cost){
      if(this.cannotAfford(cost) || !this.player.active){
        return true;
      }
      else return false;
    },
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
      for (let i = 0; i < this.skillsOnSale.length; i += 1) {
        if (
          this.marketValues[this.skillsOnSale[i].item] <=
          this.player.money - cost
        ) {
          this.$set(this.skillsOnSale[i], "available", true);
        } else {
          this.$set(this.skillsOnSale[i], "available", false);
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
    buySkillCard: function (card) {
      if (card.available) {
        this.$emit("buySkillCard", card);
        this.highlightAvailableCards();
      }
    }
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

#skill-section {
  background-color: #93c47dff;
}

.cardslots {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
  grid-template-rows: repeat(auto-fill, 180px);
}
.cardslots div {
  transform: scale(0.5) translate(-50%, -50%);
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}
.cardslots div:hover {
  transform: scale(1) translate(-25%, 0);
  z-index: 1;
}
</style>

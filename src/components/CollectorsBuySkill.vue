<template>
  <div>
    <h1>{{ labels.buySkillCard }}</h1>
    <div id="skill-section" class="board-section">
      <div>
        <h2 class="category-title">SkillZ</h2>
        <div class="bottleCircles">
          <div class="bottleCircle">$1</div>
          <div class="bottleCircle">$1</div>
          <div class="bottleCircle">$1</div>
          <div class="bottleCircle">$1</div>
        </div>
      </div>
      <div class="buy-cards">
        <div v-for="(card, index) in skillsOnSale" :key="index">
          <CollectorsCard
            :card="card"
            :availableAction="card.available"
            @doAction="buySkillCard(card)"
          />
          {{ cardCost(card) }}
        </div>
      </div>
      <div>
        <div class="buttons" v-for="(p, index) in placement" :key="index">
          <button
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
  display: grid;
  display: flex;
  transform: scale(0.7);
  grid-template-columns: repeat(auto-fill, 130px);
}

.buttons {
  display: grid;
  display: flex;
  width: 30px;
  height: 30px;
  color: pink;
  border-radius: 50%;
}
.board-section {
  padding: 10px;
  display: flex;
  align-items: center;
  border: 1px solid #19181850;
}
#skill-section {
  background-color: #93c47dff;
  display: grid;
  grid-template-columns: 20% 80%;
}
.bottleCircle {
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  color: black;
  background-color: white;
  border-radius: 50%;
}
.bottleCircles {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
}

.category-title {
  color: black;
  text-align: center;
}

.bottleCircles p {
  grid-column: 1/3;
}
</style>

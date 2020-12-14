<template>
  <div class="buttons">
    <div v-for="(p, index) in placement" :key="index">

        <div v-if="p.bottleType == 'normal'">


          <button
            class="btn-normal"
            v-if="p.playerId === null"
            :disabled="cannotAfford(p.cost)"
            @click="placeBottle(p)"
          >

            <div class = "recieveMoney" v-if="p.cost < 0 ">

              ${{ p.cost*-1 }}
            </div>

            <div class = "costMoney" v-if="p.cost >= 0 ">

              ${{ p.cost }}
            </div>

          </button>

        </div>

        <div v-if="p.bottleType == 'marketTwoBlue'">
            <button
              class="btn-marketTwoBlue"
              v-if="p.playerId === null"
              :disabled="cannotAfford(p.cost)"
              @click="placeBottle(p)"
            >
            <div class = "recieveMoney" v-if="p.cost < 0 ">
              ${{ p.cost*-1 }}
            </div>

            <div class = "costMoney" v-if="p.cost >= 0 ">
              ${{ p.cost }}
            </div>
            </button>
        </div>

        <div v-if="p.bottleType == 'marketOneBlue'">
            <button
              class="btn-marketOneBlue"
              v-if="p.playerId === null"
              :disabled="cannotAfford(p.cost)"
              @click="placeBottle(p)"
            >
            <div class = "recieveMoney" v-if="p.cost < 0 ">
              ${{ p.cost*-1 }}
            </div>

            <div class = "costMoney" v-if="p.cost >= 0 ">
              ${{ p.cost }}
            </div>
            </button>
        </div>

        <div v-if="p.bottleType == 'marketDollar'">
            <button
              class="btn-marketDollar"
              v-if="p.playerId === null"
              :disabled="cannotAfford(p.cost)"
              @click="placeBottle(p)"
            >
            <div class = "recieveMoney" v-if="p.cost < 0 ">
              ${{ p.cost*-1 }}
            </div>

            <div class = "costMoney" v-if="p.cost >= 0 ">
              ${{ p.cost }}
            </div>
            </button>
        </div>

        <div v-if="p.bottleType == 'auctionMedal'">
            <button
              class="btn-auctionMedal"
              v-if="p.playerId === null"
              :disabled="cannotAfford(p.cost)"
              @click="placeBottle(p)"
            >
            <div class = "recieveMoney" v-if="p.cost < 0 ">
              ${{ p.cost*-1 }}
            </div>

            <div class = "costMoney" v-if="p.cost >= 0 ">
              ${{ p.cost }}
            </div>
            </button>
        </div>

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
.btn-normal {
  width: 5em;
  height: 5em;
  background-size: 100% 100%;
  border-radius: 5px;

  padding: 0.5rem;
  font-size: 0.5rem;
  background-image: url("/images/bottle.jpg");
}

.btn-marketTwoBlue {
  width: 5em;
  height: 5em;
  background-size: 100% 100%;
  border-radius: 5px;

  padding: 0.5rem;
  font-size: 0.5rem;
  background-image: url("/images/marketBottle2Blue.jpg");
}

.btn-marketOneBlue {
  width: 5em;
  height: 5em;
  background-size: 100% 100%;
  border-radius: 5px;

  padding: 0.5rem;
  font-size: 0.5rem;
  background-image: url("/images/marketBottle1Blue.jpg");
}

.btn-marketDollar {
  width: 5em;
  height: 5em;
  background-size: 100% 100%;
  border-radius: 5px;

  padding: 0.5rem;
  font-size: 0.5rem;
  background-image: url("/images/marketBottleDollar.jpg");
}

.btn-auctionMedal {
  width: 5em;
  height: 5em;
  background-size: 100% 100%;
  border-radius: 5px;

  padding: 0.5rem;
  font-size: 0.5rem;
  background-image: url("/images/auctionBottleMedal.jpg");
}
.recieveMoney {
  color: LimeGreen;
  text-indent: -2.8em;
  font-weight: 900;



}
.costMoney {
  color: black;
  text-indent: -2.8em;
  font-weight: 900;

}


</style>

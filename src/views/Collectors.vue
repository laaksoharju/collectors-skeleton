<template>
  <div>
    <main>
         
 <GameBoard 
  :itemsOnSale="itemsOnSale"
 :skillsOnSale="skillsOnSale"
 :auctionCards="auctionCards"
  />

      {{ buyPlacement }} {{ chosenPlacementCost }}
      <CollectorsBuyActions
        v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :itemsOnSale="itemsOnSale"
        :marketValues="marketValues"
        :placement="buyPlacement"
        @buyCard="buyCard($event)"
        @placeBottle="placeBottle('buy', $event)"
      />
      <div class="buttons">
        <button @click="drawCard">
          {{ labels.draw }}
        </button>
      </div>
      <div class="my-cards">
        <CollectorsCard
          v-for="(card, index) in myCards"
          :card="card"
          :key="index"
        />
      </div>

      <div class="playerboard">
        Items
        <div class="cardslots" v-if="players[playerId]">
          <CollectorsCard
            v-for="(card, index) in players[playerId].items"
            :card="card"
            :key="index"
          />
        </div>
        Hand
        <div class="cardslots" v-if="players[playerId]">
          <CollectorsCard
            v-for="(card, index) in players[playerId].hand"
            :card="card"
            :availableAction="card.available"
            @doAction="buyCard(card)"
            :key="index"
          />
        </div>
      </div>
    </main>
    {{ players }}
    {{ marketValues }}
    <button v-if="players[playerId]" @click="players[playerId].money += 1">
      fake more money
    </button>
    <footer>
      <p>
        {{ labels.invite }}
        <input
          type="text"
          :value="publicPath + $route.path"
          @click="selectAll"
          readonly="readonly"
        />
      </p>
    </footer>
  </div>
</template>

<script>
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import CollectorsCard from "@/components/CollectorsCard.vue";
import CollectorsBuyActions from "@/components/CollectorsBuyActions.vue";
import GameBoard from "@/components/GameBoard.vue";


export default {
  name: "Collectors",
  components: {
    CollectorsCard,
    CollectorsBuyActions,
    GameBoard,
  },
  data: function () {
    return {
      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      myCards: [],
      maxSizes: { x: 0, y: 0 },
      labels: {},
      points: {},
      // };
      //   maxSizes: { x: 0,
      //               y: 0 },
      //   labels: {},
      players: {},
      // playerId: {
      //   hand: [],
      //   money: 1,
      //   points: 0,
      //   skills: [],
      //   items: [],
      //   income: [],
      //   secret: []
      // }
      buyPlacement: [],
      skillPlacement: [],
      auctionPlacement: [],
      marketPlacement: [],
      chosenPlacementCost: null,
      marketValues: {
        fastaval: 0,
        movie: 0,
        technology: 0,
        figures: 0,
        music: 0,
      },
      itemsOnSale: [],
      skillsOnSale: [],
      auctionCards: [],
      playerid: 0,
    };
  },
  computed: {
    playerId: function () {
      return this.$store.state.playerId;
    },
  },
  watch: {
    players: function (newP, oldP) {
      console.log(newP, oldP);
      for (let p in this.players) {
        for (let c = 0; c < this.players[p].hand.length; c += 1) {
          if (typeof this.players[p].hand[c].item !== "undefined")
            this.$set(this.players[p].hand[c], "available", false);
        }
      }
    },
  },
  created: function () {
    this.$store.commit("SET_PLAYER_ID", this.$route.query.id);
    //TODO! Fix this ugly hack
    //background: https://github.com/quasarframework/quasar/issues/5672
    const newRoute = this.$route.params.id + "?id=" + this.playerId;
    if (this.$route.params.id + "?id=" + this.$route.query.id !== newRoute)
      this.$router.push(newRoute);

    this.$store.state.socket.emit("collectorsLoaded", {
      roomId: this.$route.params.id,
      playerId: this.playerId,
    });

    this.$store.state.socket.on(
      "collectorsInitialize",
      function (d) {
        this.labels = d.labels;
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
        this.marketValues = d.marketValues;
        this.skillsOnSale = d.skillsOnSale;
        this.auctionCards = d.auctionCards;
        this.buyPlacement = d.placements.buyPlacement;
        this.skillPlacement = d.placements.skillPlacement;
        this.marketPlacement = d.placements.marketPlacement;
        this.auctionPlacement = d.placements.auctionPlacement;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "collectorsBottlePlaced",
      function (d) {
        this.buyPlacement = d.buyPlacement;
        this.skillPlacement = d.skillPlacement;
        this.marketPlacement = d.marketPlacement;
        this.auctionPlacement = d.auctionPlacement;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "collectorsPointsUpdated",
      (d) => (this.points = d)
    );

    this.$store.state.socket.on(
      "collectorsCardDrawn",
      function (d) {
        //this has been refactored to not single out one player's cards
        //better to update the state of all cards
        this.players = d;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "collectorsCardBought",
      function (d) {
        console.log(d.playerId, "bought a card");
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
      }.bind(this)
    );
  },
  methods: {
    selectAll: function (n) {
      n.target.select();
    },
    placeBottle: function (action, cost) {
      this.chosenPlacementCost = cost;
      this.$store.state.socket.emit("collectorsPlaceBottle", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        action: action,
        cost: cost,
      });
    },
    drawCard: function () {
      this.$store.state.socket.emit("collectorsDrawCard", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
      });
    },
    buyCard: function (card) {
      console.log("buyCard", card);
      this.$store.state.socket.emit("collectorsBuyCard", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.marketValues[card.market] + this.chosenPlacementCost,
      });
    },
  },
};
</script>

<style scoped>
header {
  user-select: none;
  position: fixed;
  width: 100%;
  pointer-events: none;
}
main {
  user-select: none;
}

#game-board {
  width: 60%;
  background-color: #eeeeeeff;
  border: 1px solid #19181850;
  color: black;
}

.board-section {
  padding: 10px;
  display: flex;
  align-items: center;
  border: 1px solid #19181850;
}

#item-section {
  background-color: #ea9999ff;
}

#skill-section {
  background-color: #93c47dff;
}

.raise-value-slot-container {
  width: 80%;
  display: flex;
  justify-content: space-around;
}
.raise-value-slot {
  background-color: #6d9eebff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #19181850;
}

#auction-section {
  background-color: #b4a7d6ff;
}

.section-slots {
  width: 20%;
  display: flex;
  flex-direction: column;
}
.section-card {
  width: 80%;
}

/* #C1E1C1 for skills (Green) */

.box {
  border-radius: 5px;
  border-color: tan;
  padding: 1px;
}

.section {
  display: flex;
}

.bottleCircles {
  width: 80%;
  display: grid;
  align-self: center;
  grid-gap: 5px;
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

footer {
  margin-top: 5em auto;
}
footer a {
  text-decoration: none;
  border-bottom: 2px dotted ivory;
}
footer a:visited {
  color: ivory;
}
.my-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
  grid-template-rows: repeat(auto-fill, 180px);
}
.my-cards div {
  transform: scale(0.5) translate(-50%, -50%);
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}
.my-cards div:hover {
  transform: scale(1) translate(-25%, 0);
  z-index: 1;
}
main {
  user-select: none;
}
footer {
  margin-top: 5em auto;
}
footer a {
  text-decoration: none;
  border-bottom: 2px dotted ivory;
}
footer a:visited {
  color: ivory;
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

@media screen and (max-width: 800px) {
  main {
    width: 90vw;
  }
}
</style>

<template>
  <div>
    <main>
      <section class="mainboard">
        <section class="buy_item">
          <CollectorsBuyActions
            v-if="players[playerId]"
            :labels="labels"
            :player="players[playerId]"
            :itemsOnSale="itemsOnSale"
            :marketValues="marketValues"
            :placement="buyPlacement"
            @buyCard="buyCard('buy', $event)"
          />
        </section>
        <section class="buy_skill">
          <CollectorsBuyActions
            v-if="players[playerId]"
            :labels="labels"
            :player="players[playerId]"
            :itemsOnSale="skillsOnSale"
            :marketValues="marketValues"
            :placement="skillPlacement"
            @buyCard="buyCard('skill', $event)"
          />
        </section>

        <section class="do_auction">
          <CollectorsBuyActions
            v-if="players[playerId]"
            :labels="labels"
            :player="players[playerId]"
            :itemsOnSale="auctionCards"
            :marketValues="marketValues"
            :placement="auctionPlacement"
            @buyCard="buyCard('auction', $event)"
          />
        </section>

        <section class="gameboard">
          <section class="item_bottle">
            <Bottles
              v-if="players[playerId]"
              :labels="labels"
              :player="players[playerId]"
              :itemsOnSale="itemsOnSale"
              :marketValues="marketValues"
              :placement="buyPlacement"
              @placeBottle="placeBottle('buy', $event)"
            />
          </section>
          <section class="skill_bottle">
            <Bottles
              v-if="players[playerId]"
              :labels="labels"
              :player="players[playerId]"
              :itemsOnSale="skillsOnSale"
              :marketValues="marketValues"
              :placement="skillPlacement"
              @placeBottle="placeBottle('skill', $event)"
            />
          </section>
          <section class="box market">market</section>
          <section class="box worker">worker</section>
          <section class="box auction">auction</section>
        </section>

        <section class="playerboard">
          <!-- {{ buyPlacement }} {{ chosenPlacementCost }}this{{ players }} -->

          <!-- <div class="buttons">
                  <button @click="drawCard">
                    {{ labels.draw }}
                  </button>
                </div> -->

          <!-- Auction
                <div class="cardslots">
                  <CollectorsCard
                    v-for="(card, index) in auctionCards"
                    :card="card"
                    :key="index"
                  />
                </div> -->
          <!-- Hand
                <div class="cardslots" v-if="players[playerId]">
                  <CollectorsCard
                    v-for="(card, index) in players[playerId].hand"
                    :card="card"
                    :availableAction="card.available"
                    @doAction="buyCard(card)"
                    :key="index"
                  />
                </div> -->
          Items

          <CollectorsCard
            v-for="(card, index) in players[playerId].items"
            :card="card"
            :key="index"
          />
          skills

          <CollectorsCard
            v-for="(card, index) in players[playerId].skills"
            :card="card"
            :key="index"
          />
        </section>
      </section>
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
import Bottles from "@/components/Bottles.vue";

export default {
  name: "Collectors",
  components: {
    CollectorsCard,
    CollectorsBuyActions,
    Bottles,
  },
  data: function () {
    return {
      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      maxSizes: { x: 0, y: 0 },
      labels: {},
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
        this.skillsOnSale = d.skillsOnSale;
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
    buyCard: function (action, card) {
      console.log("rish collector function buyCard", card, action);
      this.$store.state.socket.emit("collectorsBuyCard", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        action: action,
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
.mainboard {
  position: relative;
  display: grid;
  grid-template-columns: 70% 30%;
  grid-gap: 0.5em;
  background-color: rgb(117, 59, 31);
  height: 100vh;
  width: 100vw;
  z-index: 0;
}
.gameboard {
  background-color: rgb(242, 244, 247);
  border: 1px solid rgb(37, 37, 44);
  border-radius: 10px;
  margin: 1em;
  padding: 1em;
  position: absolute;
  grid-column: 1/2;
  top: 15vh;
  left: 10vw;
  height: 70vh;
  width: 30vw;
  display: grid;
  grid-template-columns: 0.8fr 1.2fr 2.5fr;
  grid-gap: 0.5em;
  grid-template-rows: 1fr 4fr 1.1fr;
}
.playerboard {
  position: absolute;
  top: 40px;
  height: 100%;
  width: 100%;
  grid-column: 2/3;
}
.buy_item >>> .buy-cards {
  position: relative;
  left: 62vw;
  top: 20.2vh;
  grid-template-columns: repeat(5, 8rem);

  grid-gap: 1rem;
  transform: scale(1.2) translate(-50%, -50%);
}

.buy_skill >>> .buy-cards {
  position: relative;
  left: -40.2vw;
  top: 57vh;
  grid-template-rows: repeat(5, 11rem);
  grid-template-columns: 12rem;
  transform: scale(1.2) translate(-50%, -50%);
  transition-timing-function: ease-out;
}
.do_auction {
  position: relative;
  z-index: 5;
  left: 24.5vw;
  height: 30vh;
}

.item_bottle {
  background-color: rgb(219, 197, 195);
  grid-column: 2/4;
  grid-row: 1/2;
  background-image: url("/images/items.jpg");
  background-size: 100% 100%;
}
.item_bottle >>> .buttons {
  top: 5vh;
  left: 1vw;
  display: grid;
  grid-template-columns: repeat(5, 6rem);
  grid-gap: 1em;
}
.item_bottle >>> .button {
  width: 5em;
  height: 5em;
}

.skill_bottle {
  background-color: rgb(208, 226, 205);
  grid-row: 1/4;
  grid-column: 1/2;
  background-image: url("/images/skill.jpg");
  background-size: 100% 100%;
}
.skill_bottle >>> .buttons {
  top: 32vh;
  left: 1.5vw;
  display: grid;
  grid-template-rows: repeat(5, 6rem);
  grid-gap: 1em;
}
.market {
  grid-row: 3/4;
  grid-column: 2/4;
  background-color: rgb(171, 203, 245);
  background-image: url("/images/market.jpg");
  background-size: 100% 100%;
}
.worker {
  grid-column: 2/3;
  grid-row: 2/3;
  background-color: rgb(240, 228, 195);
  background-image: url("/images/work.jpg");
  background-size: 100% 100%;
}
.auction {
  grid-column: 3/4;
  grid-row: 2/3;
  background-color: rgb(238, 245, 245);
  background-image: url("/images/auction.jpg");
  background-size: 100% 100%;
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

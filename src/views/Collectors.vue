<template>
  <div>
    <main>
      <div class="collectors-game">
        <div class="game main-board">A</div>
        <div class="game player-board">
          <!-- <h2 v-if="players.hasOwnProperty(playerId)">
            Player Id {{ playerId }} has been assigned
            {{ players[playerId].color }} color
          </h2> -->
            <div
              v-if="players.hasOwnProperty(playerId)"
              class="current-player"
              v-bind:style="{ 'background-color': players[playerId].color }"
            >
            <div class="player-details">
              <div class="player-name">
              Player: {{playerId}}
              </div>
              <div class="player-coins">
                <p><img src="/images/player-coins.png" alt="Player Coins" >x5</p>

              </div>
              <div class="player-cards-for-coins">
                <img src="/images/player-cards-for-coins.png" alt="Player Cards for Coins" >x4
              </div>
            </div>
            <div class="player-hand">

            </div>
            <div class="player-bottles" v-if="players.hasOwnProperty(playerId)">
              <img v-bind:src="playerBoards[players[playerId].color]" alt="Player Boards" >
            </div>
            <div class="player-items-skills">
              <div class="player-items">
                <div class="player-items-1">
                  <img src="/images/item-movie-icon.png" alt="Player Items 1">
                </div>
              </div>
              <div class="player-skills">
                <div class="player-skills-1">
                  <img src="/images/skill-bottle-icon.png">
                </div>
              </div>
            </div>

              <!-- {{ players[playerId] }} -->
            </div>
            <div
              class="other-players"
              v-for="otherPlayerId in getOtherPlayerIds()"
              v-bind:key="otherPlayerId"
              v-bind:style="{
                'background-color': players[otherPlayerId].color,
              }"
            >
            <div class="player-details">
              <div class="player-name">
              Player: {{otherPlayerId}}
              </div>
              <div class="player-coins">
                <img src="/images/player-coins.png" alt="Player Coins" >x5
              </div>
              <div class="player-cards-for-coins">
                <img src="/images/player-cards-for-coins.png" alt="Player Cards for Coins" >x4
              </div>
            </div>
            <div class="player-bottles" v-if="players.hasOwnProperty(playerId)">
              <img v-bind:src="playerBoards[players[otherPlayerId].color]" alt="Player Boards" >
            </div>
            <div class="player-items-skills">
              <div class="player-items">
                <div class="player-items-1">
                  <img src="/images/item-movie-icon.png" alt="Player Items 1">
                </div>
              </div>
              <div class="player-skills">
                <div class="player-skills-1">
                  <img src="/images/skill-bottle-icon.png">
                </div>
              </div>
            </div>
              <br />
            </div>

        </div>
      </div>
    </main>
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
/eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]/;

// import CollectorsCard from '@/components/CollectorsCard.vue'
// import CollectorsBuyActions from '@/components/CollectorsBuyActions.vue'

export default {
  name: "Collectors",
  // components: {
  //   CollectorsCard
  // },
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
      otherPlayers: [],
      playerBoards: {
         'violet': 'images/player-board-4.png',
         'blue': 'images/player-board-3.png',
         'brown': 'images/player-board-2.png',
         'grey': 'images/player-board-1.png',
      }
    };
  },
  computed: {
    playerId: function () {
      return this.$store.state.playerId;
    },
  },
  watch: {
    players: function (newP, oldP) {
      // console.log(Object.keys(newP).length);
      // console.log(Object.keys(oldP).length);
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

    this.$store.state.socket.emit("notifyPlayers", {
      roomId: this.$route.params.id,
      // playerId: this.playerId,
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
      "notifyPlayers",
      function (d) {
        this.players = d;
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
    getOtherPlayerIds: function () {
      var otherPlayers = [];
      for (var id of Object.keys(this.players)) {
        if (id != this.$store.state.playerId) {
          otherPlayers.push(id);
        }
      }
      return otherPlayers;
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

.collectors-game {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: 60% 40%;
  background-color: #fff;
  color: #444;
}

.game {
  background-color: #444;
  color: #fff;
  border-radius: 5px;
  padding: 20px;
  font-size: 150%;
  height: 90vh;
}

.main-board {
  grid-column: 1;
  grid-row: 1;
}

.player-board {
  grid-column: 2;
  grid-row: 1;
}

.current-player {
  display: grid;
  grid-template-rows:10% 50% 20% 20%;
  background-color: #fff;
  height: 40vh;
  border-style: dashed;
  color: black;
}

.player-details {
  grid-column: 1;
  grid-row: 1;
  display: grid;
  grid-template-columns:40% 30% 30%;
}

.player-name {
  grid-column: 1;
  grid-row: 1;
}

.player-coins {
  grid-column: 2;
  grid-row: 1;

}
.player-coins img {
  height: 4vh;
  /* padding-top: 5px; */
}

.player-cards-for-coins {
  grid-column: 3;
  grid-row: 1;
}

.player-cards-for-coins img {
  height: 4vh;
  /* padding-top: 5px; */
}

.player-hand {
  grid-column: 1;
  grid-row: 2;
  border-style: dashed;
  color: red;
}

.player-bottles {
  grid-column: 1;
  grid-row: 3;
}

.other-players .player-bottles {
  grid-column: 1;
  grid-row: 2;
}

.player-bottles img {
  height: 100%;
  width: 100%;
}

.player-items-skills {
  grid-column: 1;
  grid-row: 4;
  display: grid;
  grid-template-columns:50% 50% ;

}

.other-players .player-items-skills {
  grid-column: 1;
  grid-row: 3;
  display: grid;
  grid-template-columns:50% 50% ;
}

.player-items {
  grid-column: 1;
  grid-row: 1;
  display: grid;
  grid-template-columns:20% ;

}

.player-items-1 {
    grid-column: 1;
    grid-row: 1;
}

.player-items-1 img {
  height:80%;
  width: 100%;
  padding-top: 1px;
  padding-bottom: 3px;
}

.other-players .player-items-1 img {
  height:45%;
  width: 100%;
  padding-top: 1px;
  padding-bottom: 1px;
}
.player-skills {
  grid-column: 2;
  grid-row: 1;
  display: grid;
  grid-template-columns:20% ;
  
}

.player-skills-1 {
    grid-column: 1;
    grid-row: 1;
}

.player-skills-1 img {
  height:75%;
  width: 100%;
  padding-top: 1px;
  padding-bottom: 3px;
}

.other-players .player-skills-1 img {
  height:45%;
  width: 100%;
  padding-top: 1px;
  padding-bottom: 1px;
}

.other-players {
  display: grid;
  grid-gap: 3px;
  grid-template-rows:20% 40% 40%;
  background-color: #fff;
  height: 16vh;
  color: black;
}

p {
  margin-top: 0em;

}

@media screen and (max-width: 800px) {
  main {
    width: 90vw;
  }
}
</style>

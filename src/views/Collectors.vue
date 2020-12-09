<template>
  <div>
    <main>
      <div class="collectors-game">
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

        <div class="game main-board">
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
        </div>

        <div class="game player-board">
          <div
            v-if="players.hasOwnProperty(playerId)"
            class="current-player"
            v-bind:style="{ 'background-color': players[playerId].color }"
          >
            <div class="player-details">
              <div class="player-name">
                <label for="playerNameInputField" id="playerNameLabel">{{
                  players[playerId].playerName
                }}</label>
                <input
                  id="playerNameInputField"
                  type="text"
                  v-bind:value="players[playerId].playerName"
                  v-on:keyup="changeName($event)"
                  autofocus="true"
                  hidden
                /><img
                  id="nameChangeImg"
                  src="../../public/images/pencil.png"
                  v-on:click="setupNameChange()"
                />
                <br />
              </div>
              <div class="player-coins">
                <p>
                  <img src="/images/player-coins.png" alt="Player Coins" />x5
                </p>
              </div>
              <div class="player-cards-for-coins">
                <img
                  src="/images/player-cards-for-coins.png"
                  alt="Player Cards for Coins"
                />x4
              </div>
            </div>
            <div class="player-hand"></div>
            <div class="player-bottles" v-if="players.hasOwnProperty(playerId)">
              <img
                v-bind:src="playerBoards[players[playerId].color]"
                alt="Player Boards"
              />
            </div>
            <div class="player-items-skills">
              <div class="player-items">
                <div class="player-items-1">
                  <img src="/images/item-movie-icon.png" alt="Player Items 1" />
                </div>
              </div>
              <div class="player-skills">
                <div class="player-skills-1">
                  <img src="/images/skill-bottle-icon.png" />
                </div>
              </div>
            </div>
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
                Player: {{ players[otherPlayerId].playerName }}
              </div>
              <div class="player-coins">
                <img src="/images/player-coins.png" alt="Player Coins" />x5
              </div>
              <div class="player-cards-for-coins">
                <img
                  src="/images/player-cards-for-coins.png"
                  alt="Player Cards for Coins"
                />x4
              </div>
            </div>
            <div class="player-bottles" v-if="players.hasOwnProperty(playerId)">
              <img
                v-bind:src="playerBoards[players[otherPlayerId].color]"
                alt="Player Boards"
              />
            </div>
            <div class="player-items-skills">
              <div class="player-items">
                <div class="player-items-1">
                  <img src="/images/item-movie-icon.png" alt="Player Items 1" />
                </div>
              </div>
              <div class="player-skills">
                <div class="player-skills-1">
                  <img src="/images/skill-bottle-icon.png" />
                </div>
              </div>
            </div>
            <br />
          </div>
        </div>
      </div>
    </main>


    <footer>
      {{ players }}
    {{ marketValues }}
    {{'this is place'+ placement }}
      <p>
        {{ labels.invite }}
        <input
          type="text"
          :value="publicPath + $route.path"
          @click="selectAll"
          readonly="readonly"
        />
      </p>

      <button v-if="players[playerId]" @click="players[playerId].money += 1">
        fake more money
      </button>
    </footer>
  </div>
</template>


<script>
// /eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]/;

// import CollectorsCard from "@/components/CollectorsCard.vue";
import CollectorsBuyActions from "@/components/CollectorsBuyActions.vue";
import Bottles from "@/components/Bottles.vue";

export default {
  name: "Collectors",
  components: {
    // CollectorsCard,
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
      playerName: "",
      otherPlayers: [],
      playerBoards: {
        violet: "images/player-board-4.png",
        blue: "images/player-board-3.png",
        brown: "images/player-board-2.png",
        grey: "images/player-board-1.png",
      },
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

    this.$store.state.socket.emit("notifyPlayers", {
      roomId: this.$route.params.id,
      playerId: this.playerId,
    });

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
      "updatePlayerName",
      function (d) {
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
    setupNameChange: function () {
      if (!document.getElementById("playerNameLabel").hidden) {
        document.getElementById("playerNameLabel").hidden = true;
        document.getElementById("playerNameInputField").hidden = false;
      }
    },
    changeName: function (e) {
      if (e.keyCode === 13) {
        if (e.target.value !== "") {
          this.playerName = e.target.value;
          // alert("New name: " + this.playerName);
          this.$store.state.socket.emit("updatePlayerName", {
            roomId: this.$route.params.id,
            playerId: this.$store.state.playerId,
            playerName: this.playerName,
          });
        }
        document.getElementById("playerNameLabel").hidden = false;
        document.getElementById("playerNameInputField").hidden = true;
      }
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
    buyCard: function (action, card) {
      console.log("buyCard", card);
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
  position: relative;
  top: 95vh;
  margin-top: 5em auto;
}
footer a {
  text-decoration: none;
  border-bottom: 2px dotted ivory;
}
footer a:visited {
  color: ivory;
}

.main-board {
  border: 1px solid rgb(37, 37, 44);

  border-radius: 20px;
  background-color: #fff;
  /* margin: 1em;
  padding: 1em; */
  position: absolute;
  grid-column: 1/2;
  top: 10vh;
  left: 9vw;

  width: 40vw;
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
.buy_item{


}
.buy_item >>> .buy-cards {
  position: relative;
  left: 16.5vw;
  top: 10.2vh;
  grid-template-columns: repeat(5, 8rem);
  grid-gap: 1rem;
  transform: scale(0.6) translate(-50%, -50%);
}

.buy_skill >>> .buy-cards {
  position: relative;
  left: 13vw;
  top: -62vh;
  grid-template-rows: repeat(5, 10.5rem);
  grid-template-columns: 11rem;
  transform: scale(0.6) translate(-50%, -50%);
  transition-timing-function: ease-out;
}

.do_auction >>> .buy-cards {
  position: relative;
  left: -31.5vw;
  top: -25vh;
  grid-template-columns: repeat(5, 7.5rem);
  grid-template-rows: 12rem;
  transform: scale(0.5) translate(-50%, -50%);
  z-index: 6;
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
  left: 3vw;
  display: grid;
  grid-template-columns: repeat(5, 2rem);
  grid-gap: 0.5em;
}
.item_bottle >>> .button {
  width: 2rem;
  height: 2rem;
}

.skill_bottle {
  background-color: rgb(208, 226, 205);
  grid-row: 1/4;
  grid-column: 1/2;
  background-image: url("/images/skill.jpg");
  background-size: 100% 100%;
}
.skill_bottle >>> .buttons {
  top: 40vh;
  left: 2.25vw;
  display: grid;
  grid-template-rows: repeat(5, 2rem);
  grid-gap: 0.5em;
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
  position: absolute;
  display: grid;
  grid-gap: 5px;
  grid-template-columns: 60% 40%;
  background: rgb(92, 160, 170);
  background: linear-gradient(
    0deg,
    rgba(92, 160, 170, 1) 0%,
    rgba(189, 149, 93, 0.9920343137254902) 100%
  );

  color: #444;
  width: 100%;
  height: 100%;

  z-index: 0;
}

.game {
  font-size: 150%;
  height: 88vh;
}


.player-board {
  border-radius: 5px;
  background-color: #444;
  color: #fff;
  position: relative;
  top: 10vh;
  right: 1vw;
  grid-column: 2;
  grid-row: 1;
}

.current-player {
  display: grid;
  grid-template-rows: 10% 50% 20% 20%;
  background-color: #fff;
  height: 40vh;
  border-style: dashed;
  color: black;
}

.player-details {
  grid-column: 1;
  grid-row: 1;
  display: grid;
  grid-template-columns: 40% 30% 30%;
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
  grid-template-columns: 50% 50%;
}

.other-players .player-items-skills {
  grid-column: 1;
  grid-row: 3;
  display: grid;
  grid-template-columns: 50% 50%;
}

.player-items {
  grid-column: 1;
  grid-row: 1;
  display: grid;
  grid-template-columns: 20%;
}

.player-items-1 {
  grid-column: 1;
  grid-row: 1;
}

.player-items-1 img {
  height: 80%;
  width: 100%;
  padding-top: 1px;
  padding-bottom: 3px;
}

.other-players .player-items-1 img {
  height: 45%;
  width: 100%;
  padding-top: 1px;
  padding-bottom: 1px;
}
.player-skills {
  grid-column: 2;
  grid-row: 1;
  display: grid;
  grid-template-columns: 20%;
}

.player-skills-1 {
  grid-column: 1;
  grid-row: 1;
}

.player-skills-1 img {
  height: 75%;
  width: 100%;
  padding-top: 1px;
  padding-bottom: 3px;
}

.other-players .player-skills-1 img {
  height: 45%;
  width: 100%;
  padding-top: 1px;
  padding-bottom: 1px;
}

.other-players {
  display: grid;
  grid-gap: 3px;
  grid-template-rows: 20% 40% 40%;
  background-color: #fff;
  height: 16vh;
  color: black;
}

p {
  margin-top: 0em;
}

#nameChangeImg:hover {
  outline: 2px solid white;
}

@media screen and (max-width: 800px) {
  main {
    width: 70vw;
  }
}
</style>
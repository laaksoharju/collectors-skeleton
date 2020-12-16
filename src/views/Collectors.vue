<template>
  <div class="collectorsWrapper">
    <main>
      <h1>I am player {{ playerId }}</h1>
      <h1 v-if="players[playerId].active">my turn!</h1>
      <PlayerBoard v-if="players[playerId]" :player="players[playerId]" />
      <OtherPlayerboards :Players="players" :playerId="playerId" />
      <div id="game-board">
    

      <div class="layout_wrapper">
        
          <ItemSection
            v-if="players[playerId]"
            :labels="labels"
            :player="players[playerId]"
            :currentAction="currentAction"
            :itemsOnSale="itemsOnSale"
            :marketValues="marketValues"
            :placement="buyPlacement"
            :players="players"
            @selectAction="selectAction($event)"
            @placeBottle="placeBottle('itemType','buy', $event)"
          />
      

        <!-- {{ skillPlacement }} {{ chosenPlacementCost }} -->

          <CollectorsBuySkill
            v-if="players[playerId]"
            :labels="labels"
            :player="players[playerId]"
            :skillsOnSale="skillsOnSale"
            :marketValues="marketValues"
            :placement="skillPlacement"
            @selectAction="selectAction($event)"
            @placeBottle="placeBottle('skillType','skill', $event)"
          />

          <RaiseValueSection
            v-if="players[playerId]"
            :labels="labels"
            :player="players[playerId]"
            :skillsOnSale="skillsOnSale"
            :marketValues="marketValues"
            :auctionCards="auctionCards"
            :placement="marketPlacement"
            @selectAction="selectAction($event)"
            @placeBottle="placeBottle('marketType','buy', $event)"
          />

          <AuctionSection
            v-if="players[playerId]"
            :labels="labels"
            :player="players[playerId]"
            :auctionCards="auctionCards"
            :marketValues="marketValues"
            :placement="auctionPlacement"
            @selectAction="selectAction($event)"
            @placeBottle="placeBottle('auctionType','buy', $event)"
          />
        </div>
        
        <WorkArea v-if="players[playerId]"
        :color ="players[playerId].color" 
        :labels="labels"
        :player="players[playerId]"
        :placement="buyPlacement"
        @circleClicked="circleClicked($event)" 
        class="gridWork"/>
      </div>

  
      <PlayerBoard v-if="players[playerId]" :player="players[playerId]" />
      <OtherPlayerboards :Players="players" :playerId="playerId" />

      <!--  {{ buyPlacement }} {{ chosenPlacementCost }}-->

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

      Skills
      <div class="cardslots">
        <CollectorsCard
          v-for="(card, index) in skillsOnSale"
          :card="card"
          :key="index"
        />
      </div>
      Auction
      <div class="cardslots">
        <CollectorsCard
          v-for="(card, index) in auctionCards"
          :card="card"
          :key="index"
        />
      </div>

      <div class="playerboard">
        Items-on-hand
        <div class="cardslots" v-if="players[playerId]">
          <CollectorsCard
            v-for="(card, index) in players[playerId].items"
            :card="card"
            :key="index"
          />
        </div>
        <div>
          Skills-on-hand
          <div class="cardslots" v-if="players[playerId]">
            <CollectorsCard
              v-for="(card, index) in players[playerId].skills"
              :card="card"
              :key="index"
            />
          </div>
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
    <!-- <h1>MARKET VALUES: </h1>{{ marketValues }} -->
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
import OtherPlayerboards from "@/components/OtherPlayerboards.vue";
import CollectorsBuySkill from "@/components/CollectorsBuySkill.vue";
import WorkArea from "@/components/WorkArea.vue";
import ItemSection from "@/components/ItemSection.vue";
import PlayerBoard from "@/components/PlayerBoard.vue";
import RaiseValueSection from "../components/RaiseValueSection.vue";
import AuctionSection from "../components/AuctionSection.vue";

export default {
  name: "Collectors",
  components: {
    CollectorsCard,
    CollectorsBuySkill,
    WorkArea,
    ItemSection,
    PlayerBoard,
    OtherPlayerboards,
    RaiseValueSection,
    AuctionSection,
  },
  data: function () {
    return {
      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      nextRound:Boolean,
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
      currentAction: String,
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

      for (let c = 0; c < this.skillsOnSale.length; c += 1) {
        if (typeof this.skillsOnSale[c].item !== "undefined")
          this.$set(this.skillsOnSale[c], "available", false);
      }
      for (let c = 0; c < this.auctionCards.length; c += 1) {
        if (typeof this.auctionCards[c].item !== "undefined")
          this.$set(this.auctionCards[c], "available", false);
      }
      }
    },
    nextRound: function(){
      if(this.nextRound){
        this.startNextRound();
      }
    }
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
      "nextRoundStarted",
      function (d) {
        this.itemsOnSale = d.rotatedCards.itemsOnSale;
        this.skillsOnSale = d.rotatedCards.skillsOnSale;
        this.auctionCards = d.rotatedCards.auctionCards;
        this.marketValues = d.marketValues;
        this.nextRound = d.nextRound;
        this.players = d.players;
        this.buyPlacement = d.placement.buyPlacement;
        this.skillPlacement = d.placement.skillPlacement;
        this.marketPlacement = d.placement.marketPlacement;
        this.auctionPlacement = d.placement.auctionPlacement;
      }.bind(this)
    );


    this.$store.state.socket.on(
      "collectorsCardBought",
      function (d) {
        console.log(d.playerId, "bought a card");
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
        this.nextRound = d.nextRound;
      }.bind(this)
    );
   this.$store.state.socket.on(
      "raiseValueBought",
      function (d) {
        console.log(d.playerId, "bought a Raise Value");
        this.players = d.players;
        this.skillsOnSale = d.skillsOnSale;
        this.auctionCards = d.auctionCards;
        this.marketValues = d.marketValues;
      }.bind(this)
    );
    

    this.$store.state.socket.on(
      "collectorsSkillCardBought",
      function (d) {
        console.log(d.playerId, "bought a skill card");
        this.players = d.players;
        this.skillsOnSale = d.skillsOnSale;
        this.nextRound = d.nextRound;
      }.bind(this)
    );
  },
  methods: {
    selectAll: function (n) {
      n.target.select();
    },
    selectAction: function(card){
      this.currentAction == 'itemType' ? this.buyCard(card) : null
      this.currentAction == 'skillType' ? this.buySkillCard(card) : null
      this.currentAction == 'marketType' ? this.buyRaiseValue(card) : null
      this.currentAction == 'auctionType' ? this.startAuction(card) : null //Funktionen existerar inte än
    },
    placeBottle: function (type, action, cost) {
      this.currentAction = type;
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

    buyRaiseValue: function (card) {
      this.$store.state.socket.emit("buyRaiseValue", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.chosenPlacementCost,
      });
    },

    buyCard: function (card) {
      this.$store.state.socket.emit("collectorsBuyCard", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.marketValues[card.market] + this.chosenPlacementCost,
      });
    },
    buySkillCard: function (card) {
      this.$store.state.socket.emit("collectorsBuySkillCard", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.marketValues[card.market] + this.chosenPlacementCost,
      });
    },
    startNextRound: function () {
      this.$store.state.socket.emit("startNextRound", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
      });
    },
  },
};
</script>

<style scoped>

.collectorsWrapper {
background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);}

.board-section {
  width: 100%;
  padding: 10px;
  align-items: center;
  display: flex;
  flex-direction: row-reverse;
  border: 1px solid #19181850;
}

header {
  user-select: none;
  position: fixed;
  width: 100%;
  pointer-events: none;
}
main {
  user-select: none;
}

.layout_wrapper {
  display: grid;
  grid-template-columns: 70% 30%;
  /*grid-template-columns: 40% 10%;*/
}

.gridItem {
  grid-column: 1;
  grid-row: 1;
}

/*.gridGame {
  grid-column: 1;
  grid-row: 1;
}*/

.gridWork {
  grid-column: 2;
  /*grid-column: 1;*/
}

.gridOtherBoard {
  grid-column: 3;
  /*grid-column: 2;*/
  /*grid-row: 1;*/
}

.gridPlayerboard {
  grid-column: 1 / span 2;
  grid-row: 2;
}

/*TRANSITION*/
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
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

.collectorsContainer {
  margin: 5px;
  padding: 4px;
}

.collectorsContainer div {
  margin: 5px;
}



@media screen and (max-width: 800px) {
  main {
    width: 90vw;
  }
}
</style>

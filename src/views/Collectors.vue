<template>
  <main>
    <div id='container'>

      <div id="BuyCardDiv">
        {{buyPlacement}} {{chosenPlacementCost}}
        <CollectorsBuyActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :itemsOnSale="itemsOnSale"
        :marketValues="marketValues"
        :placement="buyPlacement"
        @buyCard="buyCard($event)"
        @placeBottle="placeBottle('buy', $event)"/>

      </div>

      <div id ='BuySkillDiv' >
        <CollectorsSkillActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :skillsOnSale="skillsOnSale"
        :placement="skillPlacement"
        @getSkill="getSkill($event)"
        @placeBottle="placeBottle('buySkill', $event)"/>

      </div>


      <div id ='WorkDiv' class="cardslots">
        <h2>Work</h2>
        <!-- <CollectorsCard v-for="(card, index) in auctionCards" :card="card" :key="index"/> -->
      </div>

      <div id ='AuctionDiv' class="cardslots">
        <h2>Auction</h2>
        <CollectorsCard v-for="(card, index) in auctionCards" :card="card" :key="index"/>
      </div>

      <div id = 'HandDiv' class="cardslots" v-if="players[playerId]">
        <h2>Hand</h2>
        <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="handleAction(card)" :key="index"/>
      </div>

      <div id = 'PlayerItemsDiv' class="cardslots" v-if="players[playerId]">
        <h2>Items</h2>
        <CollectorsCard v-for="(card, index) in players[playerId].items" :card="card" :key="index"/>
      </div>

      <div id = 'PlayerSkillsDiv' class="cardslots" v-if="players[playerId]">
        <h2>Skills</h2>
        <CollectorsCard v-for="(card, index) in players[playerId].skills" :card="card" :key="index"/>
      </div>

      <div id="PlayerBoardDiv">
        <h2>PlayerBoard</h2>
        {{players}}
        {{marketValues}}
        <button v-if="players[playerId]" @click="players[playerId].money += 1">
          fake more money
        </button>
        <div class="buttons">
          <button @click="drawCard">
            {{ labels.draw }}
          </button>
        </div>
        <footer>
          <p>
            {{ labels.invite }}
            <input type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
          </p>
        </footer>
      </div>
    </div>
  </main>
</template>

<script>
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/
import CollectorsCard from '@/components/CollectorsCard.vue'
import CollectorsBuyActions from '@/components/CollectorsBuyActions.vue'
import CollectorsSkillActions from '@/components/CollectorsSkillActions.vue'

export default {
  name: 'Collectors',
  components: {
    CollectorsCard,
    CollectorsBuyActions,
    CollectorsSkillActions
  },
  data: function () {
    return {
      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      maxSizes: { x: 0,
        y: 0 },
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
        chosenAction: "",
        marketValues: { fastaval: 0,
          movie: 0,
          technology: 0,
          figures: 0,
          music: 0 },
          itemsOnSale: [],
          skillsOnSale: [],
          auctionCards: [],
          playerid: 0
        }
      },
      computed: {
        playerId: function() { return this.$store.state.playerId}
      },
      watch: {
        players: function(newP, oldP) {
          console.log(newP, oldP)
          for (let p in this.players) {
            for(let c = 0; c < this.players[p].hand.length; c += 1) {
              if (typeof this.players[p].hand[c].item !== "undefined")
              this.$set(this.players[p].hand[c], "available", false);
            }
          }
        }
      },
      created: function () {
        this.$store.commit('SET_PLAYER_ID', this.$route.query.id)
        //TODO! Fix this ugly hack
        //background: https://github.com/quasarframework/quasar/issues/5672
        const newRoute = this.$route.params.id + "?id=" + this.playerId;
        if (this.$route.params.id + "?id=" + this.$route.query.id !== newRoute)
        this.$router.push(newRoute);
        this.$store.state.socket.emit('collectorsLoaded',
        { roomId: this.$route.params.id,
          playerId: this.playerId } );
          this.$store.state.socket.on('collectorsInitialize',
          function(d) {
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
          }.bind(this));
          this.$store.state.socket.on('collectorsBottlePlaced',
          function(d) {
            this.buyPlacement = d.buyPlacement;
            this.skillPlacement = d.skillPlacement;
            this.marketPlacement = d.marketPlacement;
            this.auctionPlacement = d.auctionPlacement;
          }.bind(this));
          this.$store.state.socket.on('collectorsPointsUpdated', (d) => this.points = d );
          this.$store.state.socket.on('collectorsCardDrawn',
          function(d) {
            //this has been refactored to not single out one player's cards
            //better to update the state of all cards
            this.players = d;
          }.bind(this)
        );
        this.$store.state.socket.on('collectorsCardBought',
        function(d) {
          console.log(d.playerId, "bought a card");
          this.players = d.players;
          this.itemsOnSale = d.itemsOnSale;
        }.bind(this)
      );
      this.$store.state.socket.on('collectorsSkillAcquired',
      function(d) {
        console.log(d.playerId, "acquired a skill");
        this.players = d.players;
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
      this.chosenAction = action;
      this.$store.state.socket.emit('collectorsPlaceBottle', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        action: action,
        cost: cost,
      }
    );
  },
  drawCard: function () {
    this.$store.state.socket.emit('collectorsDrawCard', {
      roomId: this.$route.params.id,
      playerId: this.playerId
    }
  );
},
buyCard: function (card) {
  console.log("buyCard", card);
  this.$store.state.socket.emit('collectorsBuyCard', {
    roomId: this.$route.params.id,
    playerId: this.playerId,
    card: card,
    cost: this.marketValues[card.market] + this.chosenPlacementCost
  }
);
},
getSkill: function (card) {
  console.log("getSkill", card);
  this.$store.state.socket.emit('collectorsGetSkill', {
    roomId: this.$route.params.id,
    playerId: this.playerId,
    card: card,
    cost: this.chosenPlacementCost
  }
);
},
handleAction: function (card) {
  console.log("handleAction", card);
  if (this.chosenAction === "buyItem") {
    this.buyCard(card);
  }
  if (this.chosenAction === "buySkill") {
    this.getSkill(card);
  }
}
},
}
</script>

<style scoped>
header {
  user-select: none;
  position: fixed;
  width:100%;
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
  color:ivory;
}


#BuyCardDiv {
  grid-area: BuyCardDiv;
  align-self: center;
}

#BuySkillDiv {
  grid-area: BuySkillDiv;
  align-self: center;
}

#AuctionDiv {
  grid-area: AuctionDiv;
  align-self: center;
}

#HandDiv {
  grid-area: HandDiv;
  align-self: center;
}

#PlayerItemsDiv {
  grid-area: PlayerItemsDiv;
  align-self: center;
}

#PlayerSkillsDiv {
  grid-area: PlayerSkillsDiv;
  align-self: center;
}

#WorkDiv {
  grid-area: WorkDiv;
  align-self: center;
}

#PlayerBoardDiv {
  grid-area: PlayerBoardDiv;
  align-self: center;
}

#container {
  height: 100%;
  display: grid;
  grid-template-columns: 50% 50% ;
  grid-template-rows: 33% 33% 33%;
  column-gap: 40px;
  row-gap: 40px;
  grid-template-areas:
  "BuyCardDiv PlayerItemsDiv"
  "BuySkillDiv PlayerSkillsDiv"
  "WorkDiv HandDiv"
  "AuctionDiv PlayerBoardDiv"

}

.cardslots {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
  grid-template-rows: repeat(auto-fill, 180px);
}
.cardslots div {
  transform: scale(0.5)translate(-50%,-50%);
  transition:0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}
.cardslots div:hover {
  transform: scale(1)translate(-25%,0);
  z-index: 1;
}

@media screen and (max-width: 800px) {
  main {
    width:90vw;
  }
}
</style>

<template>
  <div>
    <main>
      Round: {{ round }} Play order: {{ playOrder }} Current player is {{ playOrder[actingPlayer]}} Chosen action {{chosenAction}}
      <CollectorsBuyItemActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :itemsOnSale="itemsOnSale" 
        :marketValues="marketValues" 
        :placement="buyPlacement"
        @buyItem="buyItem($event)"
        @placeBottle="placeBottle('buy', $event)"/>
      <div class="buttons">
        <button :disabled="playOrder[actingPlayer] !== playerId" @click="drawCard">
          {{ labels.draw }} 
        </button>
      </div>
      Skills
      <div class="cardslots">
        <CollectorsCard v-for="(card, index) in skillsOnSale" :card="card" :key="index"/>
      </div>
      Auction
      <div class="cardslots">
        <CollectorsCard v-for="(card, index) in auctionCards" :card="card" :key="index"/>
      </div>
      Hand
      <div class="cardslots" v-if="players[playerId]">
        <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="handleAction(card)" :key="index"/>
      </div>
      Items
      <div class="cardslots" v-if="players[playerId]">
        <CollectorsCard v-for="(card, index) in players[playerId].items" :card="card" :key="index"/>
      </div>
      <CollectorsWorkActions :round="round" :placement="workPlacement" :player="players[playerId]" @placeBottle="placeBottle('work',$event)"/>
    </main>
    {{players}}
    {{marketValues}}
    <button v-if="players[playerId]" @click="addMoney">
      cheat to get more money
    </button>
    <footer>
        <p>
          {{ labels.invite }}
          <input type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
        </p>
    </footer>
  </div>
</template>

<script>
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import CollectorsCard from '@/components/CollectorsCard.vue'
import CollectorsBuyItemActions from '@/components/CollectorsBuyItemActions.vue'
import CollectorsWorkActions from '@/components/CollectorsWorkActions.vue'

export default {
  name: 'Collectors',
  components: {
    CollectorsCard,
    CollectorsBuyItemActions,
    CollectorsWorkActions
  },
  data: function () {
    return {
      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      maxSizes: { x: 0, 
                  y: 0 },
      labels: {},
      players: {},
      playOrder: [],
      round: 0,
      actingPlayer: null,
      buyPlacement: [],
      skillPlacement: [],
      auctionPlacement: [],
      marketPlacement: [],
      workPlacement: [],
      chosenAction: "",
      marketValues: { fastaval: 0, 
                     movie: 0, 
                     technology: 0, 
                     figures: 0, 
                     music: 0 },
      itemsOnSale: [],
      skillsOnSale: [],
      auctionCards: [],
      numberOfActions: 0
    }
  },
  computed: {
    playerId: function() { 
      return this.$store.state.playerId
    }
  },
  watch: {
    players: function() {
      for (let card of this.players[this.playerId].hand) {
        if (this.numberOfActions > 0) {
          this.$set(card, "available", true);
        }
        else {
          this.$set(card, "available", false);
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

    //this is run also on reload so should update everything about the state of the game
    this.$store.state.socket.on('collectorsInitialize', 
      function(d) {
        this.labels = d.labels;
        this.players = d.players;
        this.round = d.round;
        this.playOrder = d.playOrder;
        this.actingPlayer = d.actingPlayer;
        this.itemsOnSale = d.itemsOnSale;
        this.marketValues = d.marketValues;
        this.skillsOnSale = d.skillsOnSale;
        this.auctionCards = d.auctionCards;
        this.buyPlacement = d.placements.buyPlacement;
        this.skillPlacement = d.placements.skillPlacement;
        this.marketPlacement = d.placements.marketPlacement;
        this.auctionPlacement = d.placements.auctionPlacement;
        this.workPlacement = d.placements.workPlacement;
      }.bind(this));

    this.$store.state.socket.on('collectorsUpdatePlayers', 
      function(players) {
        this.players = players;
        this.$nextTick(function() { 
          if (this.numberOfActions === 0) {
            this.$store.state.socket.emit('collectorsNextPlayer', {roomId: this.$route.params.id});
          }
        })
      }.bind(this));

    this.$store.state.socket.on('collectorsBottlePlaced', 
      function(d) {
        console.log("chosenAction", this.chosenAction, "numberOfActions", this.numberOfActions)
        if (this.chosenAction !== "buy") {
          this.players = d.players;
        }
        this.buyPlacement = d.placements.buyPlacement;
        this.skillPlacement = d.placements.skillPlacement;
        this.marketPlacement = d.placements.marketPlacement;
        this.auctionPlacement = d.placements.auctionPlacement;
        this.workPlacement = d.placements.workPlacement;
        this.playOrder = d.playOrder;
        this.actingPlayer = d.actingPlayer;
        if (this.numberOfActions > 0) {
          for (let i = 0; i < this.players[this.playerId].hand.length; i += 1) {
            console.log("highlighting")
            setTimeout(() =>
            this.$set(this.players[this.playerId].hand[i], "available", true), 500);
          }
        }
        else {
          console.log("next player")
          this.$store.state.socket.emit('collectorsNextPlayer', {roomId: this.$route.params.id});
        }
      }.bind(this));

    this.$store.state.socket.on('collectorsActingPlayer', 
      function(d) {
          this.players = d.players;
          this.actingPlayer = d.actingPlayer;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsItemBought', 
      function(d) {
        console.log(d.playerId, "bought a card");
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
        this.actingPlayer = d.actingPlayer;
      }.bind(this)
    );
  },
  methods: {
    selectAll: function (n) {
      n.target.select();
    },
    placeBottle: function (action, id) {
      if (action === "work" && id <= 3 || action === "market" && id <= 2) {
        this.numberOfActions = 2;
      }
      else if (action === "work" && id <=6) {
        this.numberOfActions = 0; 
      }
      else {
        this.numberOfActions = 1; 
      }
      this.chosenAction = action;
      this.$store.state.socket.emit('collectorsPlaceBottle', { 
          roomId: this.$route.params.id, 
          playerId: this.playerId,
          action: action, 
          id: id, 
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
    cardForIncome: function (card) {
      this.$store.state.socket.emit('collectorsCardForIncome', { 
          roomId: this.$route.params.id, 
          playerId: this.playerId,
          card: card
        }
      );
    },
    buyItem: function (card) {
      this.$store.state.socket.emit('collectorsBuyItem', { 
          roomId: this.$route.params.id, 
          playerId: this.playerId,
          card: card,
          cost: this.marketValues[card.market] 
        }
      );
    },
    handleAction: function (card) {
      if (this.numberOfActions > 0) {
        this.numberOfActions -= 1;
        if (this.chosenAction === "buy") {
          this.buyItem(card);
        }
        else if (this.chosenAction === "skill") {
          this.getSkill(card);
        }
        else if (this.chosenAction === "auction") {
          this.makeAuction(card);
        }
        else if (this.chosenAction === "market") {
          this.raiseMarketValue(card);
        }
        else if (this.chosenAction === "work") {
          this.cardForIncome(card);
        }
      }
    },
    addMoney: function () {
      this.$store.state.socket.emit('collectorsAddMoney', { 
          roomId: this.$route.params.id, 
          playerId: this.playerId
      });
    }
  },
}
</script>
<style> /* letting CSS from here leak into components by removing 'scoped'*/
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

  .cardslots {
    display: grid;
    grid-template-columns: repeat(auto-fill, 10vw);
    height:14vw; /* height needs to be proportional to width */
  }

  .cardslots div {
    transform: scale(1);
    transition:0.2s;
    transition-timing-function: ease-out;
    z-index: 0;
    width: 100%;
  }

  .cardslots div:hover {
    transform: scale(1.5);
    transform-origin: center top;
    z-index: 1;
  }

  @media screen and (max-width: 800px) {
    main {
      width:95vw;
      margin: auto;
    }

    .cardslots {
      display: grid;
      grid-template-columns: repeat(auto-fill, 19vw);
      height: 26.6vw; /* height needs to be proportional to width */
    }
  }
</style>

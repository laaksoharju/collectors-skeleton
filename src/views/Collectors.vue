<template>
  <div>
    <main>
      {{buyPlacement}} {{chosenPlacementCost}}
      <CollectorsBuyActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :itemsOnSale="itemsOnSale"
        :marketValues="marketValues"
        :placement="buyPlacement"
        @buyCard="buyCard($event)"
        @placeBottle="placeBottle('buy', $event)"/>

      <CollectorsStartAuction v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :auctionCards="auctionCards"
        :marketValues="marketValues"
        :placement="auctionPlacement"
        @startAuction="startAuction($event)"
        @placeBottle="placeBottle('auction', $event)"/>

      <CollectorsBuySkill v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :skillsOnSale="skillsOnSale"
        :placement="skillPlacement"
        @buySkill="buySkill($event)"
        @placeBottle="placeBottle('skill',$event)"/>

        <CollectorsMarket v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :placement="marketPlacement"
        @placeBottle="placeBottle('market',$event)"
        @changeTwoMarket="changeTwoMarket()"/>



      <div class="buttons">
        <button @click="drawCard">
          {{ labels.draw }}
        </button>
      </div>
      Hand
      <div class="cardslots" v-if="players[playerId]">
        <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="doAction(card)" :key="index"/>
      </div>
      Items
      <div class="cardslots" v-if="players[playerId]">
        <CollectorsCard v-for="(card, index) in players[playerId].items" :card="card" :key="index"/>
      </div>
      Skills
      <div class="cardslots" v-if="players[playerId]">
        <CollectorsCard v-for="(card, index) in players[playerId].skills" :card="card" :key="index"/>
      </div>
      Current auction
      <div class="cardslots">
        <CollectorsCard v-for="(card, index) in currentAuction" :card="card" :key="index"/>
      </div>
    </main>
    PLAYERS
    {{players}}
    MARKET
    {{marketValues}}

    <button v-if="players[playerId]" @click="players[playerId].money += 1">
      fake more money
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
import CollectorsBuyActions from '@/components/CollectorsBuyActions.vue'
import CollectorsStartAuction from '@/components/CollectorsStartAuction.vue'
import CollectorsBuySkill from '@/components/CollectorsBuySkill.vue'
import CollectorsMarket from '@/components/CollectorsMarket.vue'

export default {
  name: 'Collectors',
  components: {
    CollectorsCard,
    CollectorsBuyActions,
    CollectorsStartAuction,
    CollectorsBuySkill,
    CollectorsMarket
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
      isPlacedList: {item: false,
                     skill: false,
                     auction: false,
                     market: false
                    },
      buyPlacement: [],
      skillPlacement: [],
      auctionPlacement: [],
      marketPlacement: [],
      chosenPlacementCost: null,
      marketValues: { fastaval: 0,
                     movie: 0,
                     technology: 0,
                     figures: 0,
                     music: 0 },
      itemsOnSale: [],
      skillsOnSale: [],
      auctionCards: [],
      playerid: 0,
      currentAuction: [],
      twoMarket: false,
      twoMarketCounter:0
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

    this.$store.state.socket.on('collectorsSkillBought',
      function(d){
        console.log(d.playerId, "bought a Skill");
        this.players=d.players;
        this.skillsOnSale=d.skillsOnSale;
      }.bind(this)
    );

    this.$store.state.socket.on('auctionStarted',
      function(d) {
        console.log(d.playerId, "started an auction");
        this.players = d.players;
        this.auctionCards = d.auctionCards;
        this.currentAuction = d.currentAuction;
        console.log("currentAuction = " + this.currentAuction)
      }.bind(this)
    );

    this.$store.state.socket.on('ValueRaised', function(d){
      console.log(d.playerId, "raised the market");
      this.players=d.players;
      this.marketValues=d.marketValues;
      this.skillsOnSale=d.skillsOnSale;
      this.auctionCards=d.auctionCards;
      if (this.twoMarket===true){
        if(this.twoMarketCounter===0){
          console.log("kör market en gång till")
          this.twoMarketCounter +=1;
          this.placeBottle('market',0);
        }
        else{
          this.twoMarketCounter=0;
          this.twoMarket=false;
        }
      }
    }.bind(this))

  },
  methods: {
    selectAll: function (n) {
      n.target.select();
    },

/* Vad har vi gjort här med placeBottle och doAction? Jo, problemet var att när man klickade på en auctionknapp
och ville aktionera ut ngt man hade på handen så lades det i item och inte i currentAuction. Det löstes genom att
skicka @doAction till vår egen doAction, och denna skickar vidare till rätt funktion beroende på vad som placeBottle
har gjort true eller false. Om man börjar auction så ska auction vara true och allt annat false tex. */
    placeBottle: function (action, cost=0) {
      console.log("placeBottle")
      if(action === "buy"){
        this.isPlacedList.item = true
      }
      else if(action === "skill"){
        this.isPlacedList.skill = true
      }
      else if(action === "auction"){
        this.isPlacedList.auction = true
      }
      else if(action ==="market"){
        console.log("market i placeBottle");
        this.isPlacedList.market = true;
        this.chosenPlacementCost = cost;
        this.marketBottle(action, cost, this.twoMarket);
        return
      }
      this.chosenPlacementCost =cost ;
      this.$store.state.socket.emit('collectorsPlaceBottle', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          action: action,
          cost: cost,
        }
      );
    },

    doAction: function(card){
      if(this.isPlacedList.item===true){
        this.buyCard(card);
        this.isPlacedListt.item=false;
      }
      else if(this.isPlacedList.skill===true){
        this.buySkill(card);
        this.isPlacedList.skill=false;
      }
      else if(this.isPlacedList.auction===true){
        this.startAuction(card);
        this.isPlacedList.auction=false;
      }
      else if(this.isPlacedList.market===true){
        this.raiseMarket(card,'hand');
        this.isPlacedList.market=false;
      }
    },

    drawCard: function () {
      this.$store.state.socket.emit('collectorsDrawCard', {
          roomId: this.$route.params.id,
          playerId: this.playerId
        }
      );
    },

    marketBottle: function(action, cost=0, twoMarket){
      console.log("marketBottle")
      for (let i = 0; i < this.players[this.playerId].hand.length; i += 1){
        this.$set(this.players[this.playerId].hand[i], 'available', true);
        //console.log(this.players[this.playerId].hand[i],"handen i marketbottle")
      }
      for (let i = 0; i < this.skillsOnSale.length; i += 1){
        if(this.skillsOnSale[i].item !== undefined){
          this.$set(this.skillsOnSale[i], 'available', true);
          break
        }
      }
      for (let i = 0; i < this.auctionCards.length; i += 1){
        if(this.auctionCards[i].item !== undefined){
          this.$set(this.auctionCards[i], 'available', true);
          break
      }
    }
    if(this.twoMarketCounter===0){
    this.$store.state.socket.emit('collectorsPlaceBottle', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        action: action,
        cost: cost,
        twoMarket: twoMarket
      }
      );
    }


  },

    marketBottleDone: function (){
      for (let i = 0; i < this.players[this.playerId].hand.length; i += 1){
        this.$set(this.players[this.playerId].hand[i], 'available', false);
      }
      for (let i = 0; i < this.skillsOnSale.length; i += 1){
        if(this.skillsOnSale[i] !== 'undefined'){
          //this.$set(this.skillsOnSale[i], 'available', false);
          //this.skillsOnSale[i].availableAction=true;
          break
        }
      }
      for (let i = 0; i < this.auctionCards.length; i += 1){
        if(this.auctionCards[i] !== 'undefined'){
          this.$set(this.auctionCards[i], 'available', false);
          break
      }
    }
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
    buySkill: function (card){
        if(this.isPlacedList.market===true){
          this.raiseMarket(card,'skill');
          this.isPlacedList.market=false;
        }
        else {
          this.$store.state.socket.emit('collectorsBuySkill', {
            roomId: this.$route.params.id,
            playerId: this.playerId,
            card: card,
            cost: this.chosenPlacementCost
        }
          );
        }

    },
    startAuction: function (card){
      if(this.isPlacedList.market===true){
        this.raiseMarket(card,'auction');
        this.isPlacedList.market=false;
      }
        else{

      this.$store.state.socket.emit('collectorsStartAuction', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          card: card,
          cost: this.chosenPlacementCost
        }
      );
    }
  },
  raiseMarket: function(card,action){
    console.log('raiseMarket i Collectors')
    this.$store.state.socket.emit('collectorsRaiseValue', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.chosenPlacementCost,
        action: action
  });
  this.marketBottleDone();
},
  changeTwoMarket: function(){
    this.twoMarket=true;
    this.twoMarketCounter=0;
  }
}
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

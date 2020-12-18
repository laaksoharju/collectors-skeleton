<template>
  <main>
    <div id='container'>

      <div id="BuyItemDiv">
        <!-- {{buyPlacement}} {{chosenPlacementCost}} Detta borde vi kunna skita i nu-->
        <CollectorsBuyActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :itemsOnSale="itemsOnSale"
        :marketValues="marketValues"
        :placement="buyPlacement"
        @buyItem="buyItem($event)"
        @placeBottle="placeBottle('buyItem', $event)"/>
      </div>

      <div id="BuySkillDiv">
        <div id="skillinfodiv">

        <h2>Skill descriptions</h2>

        <img class="skillsinfo" src="images/gain2.png" title="Gain 2$ whenever you place a worker in the Work area."/>
        <img class="skillsinfo" src="images/gaincard.png" title="Draw a card whenever you place a worker in the Work area."/>
        <img class="skillsinfo" src="images/gain5vp.png" title="Get 5VP if you won at least one item from each category at the end of the game."/>
        <img class="skillsinfo" src="images/gainbottle.png" title="Immediately gain a new bottle. You may use it this quarter."/>
        <img class="skillsinfo" src="images/gainauction.png" title="Gain $1 whenever an auction is started by any player."/>
        </div>
             


        
        <CollectorsSkillActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :skillsOnSale="skillsOnSale"
        :placement="skillPlacement"
        @getSkill="handleAction($event)"
        @placeBottle="placeBottle('buySkill', $event)"/>
      </div>

      <div id="RaiseValueDiv">
        <CollectorsRaiseValueActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :marketValues="marketValues"
        :skillsOnSale="skillsOnSale"
        :auctionCards="auctionCards"
        :market="market"
        :currentAuctionCard="currentAuctionCard"
        :placement="marketPlacement"
        @placeBottleRaiseValue="placeBottleRaiseValue('market', $event)"/>
      </div>

      <div id="AuctionDiv">
        <CollectorsAuctionActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :auctionCards="auctionCards"
        :currentAuctionCard="currentAuctionCard"
        :placement="auctionPlacement"
        @handleAction="handleAction($event)"
        @placeBottle="placeBottle('startAuction', $event)"/>

        <div v-if="currentAuctionCard.length === 1">
          <p>{{labels.player}} {{ bidArray[bidArray.length - 1]}} {{labels.isNowLeading}} {{ bidArray.length}}${{labels.bid}}.</p>
          <button v-if="players[playerId]" :disabled="cannotRaiseBid()" @click="raiseCurrentBid()">{{labels.raiseCurrentBid}}</button>
          <button v-if="bidArray[bidArray.length - 1] === this.playerId" :disabled="noMoreBidsBoolean" @click="noMoreBids()">{{labels.my}} {{bidArray.length}}{{labels.dollarBidWon}}</button>
          <button v-if="this.noMoreBidsBoolean" @click="endAuction('buyItem')" style="background-color: #f9dcce">Use as an item <br><img class="use_as" src="images/use_as_item.png" width="33%"></button>
          <button v-if="this.noMoreBidsBoolean" @click="endAuction('getSkill')" style="background-color: #dfeccc">Use as a skill <br><img class="use_as" src="images/use_as_skill.png" width="33%"></button>
          <button v-if="this.noMoreBidsBoolean" @click="endAuction('market')" style="background-color: #cfdcf2">Place in the market <br><img class="use_as" src="images/use_as_market.png" width="30%"></button>
        </div>
      </div>

      <div id="GameOperationsDiv">
        <h2>{{labels.gameOperations}}</h2>
        <div id='readyGameButton' v-if="!playerBoardShown">
          <button class="ready" v-on:click="readyGame()" @click="playerReady = true" :disabled="playerReady">
            {{labels.ready}}
            </button>
        </div>
        <div id="startGameButton" v-if="!playerBoardShown">
          <button class="ready" v-on:click="startGame()">
            {{labels.start}}
          </button>
        </div>
        <div id="NextRoundButton" v-if="playerBoardShown">
          The current round is round {{ activeRound }}.
          When the last player is finished, he or she can switch to the next round.
          <button id="nextRound" v-on:click="changeRound()" :disabled="notLastPlayer()">Next round</button>
        </div>
        <div>
          <button id="money" v-if="players[playerId]" @click="fakeMoreMoney()">{{labels.fake}}</button>
        </div>
        <div class="buttons">
          <button class="function_buttons" @click="drawCard">
            {{ labels.draw }}
            <img id="drawCard_button_img" src="images/drawCards.png">
          </button>
        </div>

        <div class="buttons">
          <button class="function_buttons" v-if="players[playerId]" @click="retrieveBottles()">
            {{labels.retrieve}}
            <img class="function_button_img" src="images/retrieveBottles.png">
          </button>
        </div>

        <div>
          {{ labels.invite }}
          <input type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
        </div>
      </div>

      <div id="WorkDiv">
        <CollectorsWorkActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :placement="workPlacement"
        :activeRound="activeRound"
        @placeBottleWork="placeBottleWork('doWork', $event)"/>
      </div>

      <div id="PlayerBoardDiv">
        <h2>{{labels.playerBoard}}</h2>
        <div id="bottleSlotsDiv">
            <input type="hidden" name="bottleSlot" value="bottleSlot_1">
            <input class="bottleSlots" type="image" src="images/bottleSlot_1.png">

            <input type="hidden" name="bottleSlot" value="bottleSlot_2">
            <input class="bottleSlots" type="image" src="images/bottleSlot_2.png">

            <input type="hidden" name="bottleSlot" value="bottleSlot_3">
            <input class="bottleSlots" type="image" src="images/bottleSlot_3.png">

            <input type="hidden" name="bottleSlot" value="bottleSlot_4">
            <input class="bottleSlots" type="image" src="images/bottleSlot_4.png">

            <input type="hidden" name="bottleSlot" value="bottleSlot_5">
            <input class="bottleSlots" type="image" src="images/bottleSlot_5.png">

        </div>

        <div id="AllPlayerCardsDiv" v-if="playerBoardShown">
          <div id="AllPlayerIdDiv">
            <h3>{{labels.names}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="key">
              <p>{{ player }}</p>
            </div>
          </div>

          <div id="AllPlayerHandsDiv">
            <h3>{{labels.hands}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="key">
              <CollectorsCard v-for="(card, index) in players[player].hand" :card="card" :availableAction="card.available" @doAction="handleAction(card)" :key="index"/>
            </div>
          </div>

          <div id="AllPlayerItemsDiv">
            <h3>{{labels.items}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="key">
              <CollectorsCard v-for="(card, index) in players[player].items" :card="card" :key="index"/>
            </div>
          </div>

          <div id="AllPlayerSkillsDiv">
            <h3>{{labels.skills}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="key">
              <CollectorsCard v-for="(card, index) in players[player].skills" :card="card" :key="index"/>
            </div>
          </div>

          <div id="AllPlayerIncomeDiv">
            <h3>{{labels.income}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="key">
              <CollectorsCard v-for="(card, index) in players[player].income" :card="card" :key="index"/>
            </div>
          </div>

          <div id="AllPlayerMoneyDiv">
            <h3>{{labels.money}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="key">
              <p>{{ players[player].money }}</p>
            </div>
          </div>

          <div id="AllPlayerBottlesDiv">
            <h3>{{labels.bottles}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="key">
              <p>{{ players[player].bottles }}</p>
            </div>
          </div>
        </div>
        <footer>
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
import CollectorsRaiseValueActions from '@/components/CollectorsRaiseValueActions.vue'
import CollectorsAuctionActions from '@/components/CollectorsAuctionActions.vue'
import CollectorsWorkActions from '@/components/CollectorsWorkActions.vue'

export default {
  name: 'Collectors',
  components: {
    CollectorsCard,
    CollectorsBuyActions,
    CollectorsSkillActions,
    CollectorsRaiseValueActions,
    CollectorsAuctionActions,
    CollectorsWorkActions
  },
  data: function () {
    return {
      playerReady: false,
      playerBoardShown: false,
      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      maxSizes: { x: 0,
        y: 0 },
        labels: {},
        players: {},
        room: {},
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
        workPlacement: [],
        chosenPlacementCost: null,
        chosenAction: "",
        raiseValueIndex: null,
        raiseValueSecondCard: null,
        bidArray: [],
        marketValues: { fastaval: 0,
          movie: 0,
          technology: 0,
          figures: 0,
          music: 0 },
        itemsOnSale: [],
        skillsOnSale: [],
        auctionCards: [],
        currentAuctionCard: [],
        noMoreBidsBoolean: false,
        playerid: 0,
        playerCount: 0,
        playerIdArray: [],
        activeRound: 0
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
            this.room = d.room;
            this.itemsOnSale = d.itemsOnSale;
            this.marketValues = d.marketValues;
            this.skillsOnSale = d.skillsOnSale;
            this.auctionCards = d.auctionCards;
            this.currentAuctionCard = d.currentAuctionCard;
            this.market = d.market;
            this.buyPlacement = d.placements.buyPlacement;
            this.skillPlacement = d.placements.skillPlacement;
            this.marketPlacement = d.placements.marketPlacement;
            this.auctionPlacement = d.placements.auctionPlacement;
            this.workPlacement = d.placements.workPlacement;
            this.playerCount = d.playerCount;
          }.bind(this));

          this.$store.state.socket.on('collectorsGameStarted',
          function(d) {
            this.playerBoardShown = d.playerBoardShown;
            this.playerIdArray = d.playerIdArray;
            this.players = d.players;
          }.bind(this));

          this.$store.state.socket.on('collectorsBottlePlaced',
          function(d) {
            this.buyPlacement = d.placements.buyPlacement;
            this.skillPlacement = d.placements.skillPlacement;
            this.marketPlacement = d.placements.marketPlacement;
            this.auctionPlacement = d.placements.auctionPlacement;
            this.workPlacement = d.placements.workPlacement;
            this.players[this.playerId].bottles = d.players[this.playerId].bottles;
            this.players[this.playerId].income = d.players[this.playerId].income;
            this.players[this.playerId].money = d.players[this.playerId].money;
            this.playerIdArray = d.playerIdArray;
          }.bind(this));

          this.$store.state.socket.on('collectorsPlayerArrayFinished',function(d) {
            this.playerIdArray = d.playerIdArray;
          }.bind(this));

          this.$store.state.socket.on('collectorsPointsUpdated', (d) => this.points = d );

          this.$store.state.socket.on('collectorsMoneyUpdated',
          function(d) {
            this.players = d;
          }.bind(this));

          this.$store.state.socket.on('collectorsCardDrawn',
          function(d) {
            //this has been refactored to not single out one player's cards
            //better to update the state of all cards
            this.players = d;
          }.bind(this));

          this.$store.state.socket.on('collectorsItemBought',
          function(d) {
            console.log(d.playerId, "bought an item");
            this.players = d.players;
            this.itemsOnSale = d.itemsOnSale;
            this.currentAuctionCard = d.currentAuctionCard;
          }.bind(this));

          this.$store.state.socket.on('collectorsSkillAcquired',
          function(d) {
            console.log(d.playerId, "acquired a skill");
            this.players = d.players;
            this.skillsOnSale = d.skillsOnSale;
            this.currentAuctionCard = d.currentAuctionCard;
          }.bind(this));

          this.$store.state.socket.on('collectorsValueRaised',
          function(d) {
            console.log(d.playerId, "raised a value");
            this.players = d.players;
            this.marketValues = d.marketValues;
            this.market = d.market;
            this.skillsOnSale = d.skillsOnSale;
            this.auctionCards = d.auctionCards;
            this.currentAuctionCard = d.currentAuctionCard;
          }.bind(this));

          this.$store.state.socket.on('collectorsAuctionStarted',
          function(d) {
            this.players = d.players;
            this.auctionCards = d.auctionCards;
            this.currentAuctionCard = d.currentAuctionCard;
          }.bind(this));

          this.$store.state.socket.on('collectorsMoneyFaked',
          function(d) {
            console.log(d.playerId, "faked money");
            this.players = d;
          }.bind(this));

          this.$store.state.socket.on('collectorsBottlesRetrieved',
          function(d) {
            console.log(d.playerId, "retrieved bottles");
            this.players = d;
          }.bind(this));

          this.$store.state.socket.on('collectorsBidRaised',
          function(d) {
            console.log(d.playerId, "bid is raised");
            this.bidArray = d;
          }.bind(this));

          this.$store.state.socket.on('collectorsAuctionEnded',
          function(d) {
            console.log(d.playerId, "auction is raised");
            this.bidArray = d;
          }.bind(this));

          this.$store.state.socket.on('collectorsRoundUpdated',
          function(d) {
            this.activeRound = d.activeRound;
          }.bind(this));
        },

methods: {
  readyGame: function() {
    this.$store.state.socket.emit('collectorsPlayerReady', {
      playerId: this.playerId,
      roomId: this.$route.params.id
    });
  },

  startGame: function() {
    let allPlayersReady = this.checkAllPlayersReady();
    if (allPlayersReady) {
      this.$store.state.socket.emit('collectorsStartGame', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        playerIdArray: this.playerIdArray,
        activeRound: 1,
        players: this.players
      });
    }
    else {
      alert("All players are not ready yet. Ready up everyone!")
    }
  },

  checkAllPlayersReady: function() {
    if (this.playerCount === this.playerIdArray.length) {
      return true;
    }
    else {
      return false;
    }
  },

  notLastPlayer: function() {
    if (this.playerId === this.playerIdArray[this.playerIdArray.length-1]) {
      return false;
    }
    else {
      return true;
    }
  },

  changeRound: function() {
    console.log(this.activeRound+1);
    this.$store.state.socket.emit('collectorsChangeRound', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      activeRound: this.activeRound+1,
      players: this.players
    });
  },

  selectAll: function (n) {
    n.target.select();
  },

  placeBottle: function (action, cost) {
    this.chosenPlacementCost = cost;
    this.chosenAction = action;
    console.log(action);
    this.$store.state.socket.emit('collectorsPlaceBottle', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      action: action,
      cost: cost,
    });
  },

  placeBottleRaiseValue: function (action, p) {
    this.chosenPlacementCost = p.cost;
    this.chosenAction = action;
    this.raiseValueIndex = p.index;
    this.$store.state.socket.emit('collectorsPlaceBottleRaiseValue', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      action: action,
      cost: p.cost,
      index: p.index,
    });
  },

  placeBottleWork: function (action, p) {
    this.chosenPlacementCost = p.cost;
    this.chosenAction = action;
    this.raiseValueIndex = p.index;
    this.$store.state.socket.emit('collectorsPlaceBottleWork', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      action: action,
      cost: p.cost,
      index: p.index,
    });
  },

  drawCard: function () {
    this.$store.state.socket.emit('collectorsDrawCard', {
      roomId: this.$route.params.id,
      playerId: this.playerId
    });
    // console.log(this.players.[this.playerId].hand);
    console.log(this.activeRound);
  },

  buyItem: function (card) {
    this.$store.state.socket.emit('collectorsBuyItem', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      card: card,
      cost: this.marketValues[card.item] + this.chosenPlacementCost
    });
  },

  getSkill: function (card) {
    this.$store.state.socket.emit('collectorsGetSkill', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      card: card,
      cost: this.chosenPlacementCost
    });
  },

  handleAction: function (card) {
    if (card.available) {
      if (this.chosenAction === "buyItem") {
        this.buyItem(card);
      }
      if (this.chosenAction === "buySkill") {
        this.getSkill(card);
      }
      if (this.chosenAction === "market") {
        this.raiseValueHandler(card);
      }
      if (this.chosenAction === "startAuction") {
        this.startAuction(card);
      }
    }
  },

  fakeMoreMoney: function () {
    console.log(this.players[this.playerId].hand[0].available);
    this.$store.state.socket.emit('collectorsFakeMoreMoney', {
      roomId: this.$route.params.id,
      playerId: this.playerId
    });
  },

  retrieveBottles: function () {
    this.$store.state.socket.emit('collectorsRetrieveBottles', {
      roomId: this.$route.params.id,
      playerId: this.playerId
    });
  },

  startAuction: function (card) {
    if (this.currentAuctionCard.length === 0) {
      this.$store.state.socket.emit('collectorsStartAuction', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.chosenPlacementCost
      });
    }
  },

  cannotRaiseBid: function () {
    console.log(this.players[this.playerId].money);
    console.log(this.bidArray.length);
    return (this.players[this.playerId].money <= this.bidArray.length);
  },

  raiseCurrentBid: function () {
    this.$store.state.socket.emit('collectorsRaiseCurrentBid', {
      roomId: this.$route.params.id,
      playerId: this.playerId
    });
  },

  noMoreBids: function() {
    this.noMoreBidsBoolean = true;
  },

  endAuction: function (action) {
    if (action === "buyItem") {
      this.$store.state.socket.emit('collectorsBuyItem', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: this.currentAuctionCard[0],
        cost: this.bidArray.length
      });
    }
    if (action === "getSkill") {
      this.$store.state.socket.emit('collectorsGetSkill', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: this.currentAuctionCard[0],
        cost: this.bidArray.length
      });
    }
    if (action === "market") {
      this.$store.state.socket.emit('collectorsRaiseValue', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card1: this.currentAuctionCard[0],
        card2: null,
        cost: this.bidArray.length
      });
    }
    this.noMoreBidsBoolean = false;
    this.$store.state.socket.emit('collectorsEndAuction', {
      roomId: this.$route.params.id,
      playerId: this.playerId
    });
  },

  raiseValueHandler: function (card) {
    var card2 = null;
    if (this.raiseValueIndex === 2) {
      this.raiseValue(card, card2);
    }
    else if (this.raiseValueSecondCard == null) {
      this.raiseValueSecondCard = card;
    }
    else {
      this.raiseValue(card, this.raiseValueSecondCard);
      this.raiseValueSecondCard = null;
    }
  },

  raiseValue: function (card1, card2) {
    this.$store.state.socket.emit('collectorsRaiseValue', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      card1: card1,
      card2: card2,
      cost: this.chosenPlacementCost
    });
  },
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

#BuyItemDiv {
  grid-area: BuyItemDiv;
  align-self: center;
  background: #f9dcce;
  margin: 5px;

}

#BuySkillDiv {
  grid-area: BuySkillDiv;
  align-self: center;
  background: #dfeccc;
  margin: 5px;
}

#BuySkillDiv h2 {


align-self:center;
margin: 5px;
margin-left: 1em;
margin-top: 1em;
}




#AuctionDiv {
  grid-area: AuctionDiv;
  align-self: center;
  background: #f5f1e1;
  margin: 5px;
}

#RaiseValueDiv {
  grid-area: RaiseValueDiv;
  align-self: center;
  background: #cfdcf2;
  margin: 5px;
}

#GameOperationsDiv {
  grid-area: GameOperationsDiv;
  align-self: center;
  text-align: center;
  color: black;
  background: #ceedeb;
  margin: 5px;
  height: 100%
}

#WorkDiv {
  height: 70%;
  grid-area: WorkDiv;
  align-self: center;
  background: #f5f2cc;
  margin: 5px;
}

#HandDiv {
  grid-area: HandDiv;
  align-self: center;
  background: #e4e4e3;
  margin: 5px;
}

#PlayerItemsDiv {
  grid-area: PlayerItemsDiv;
  align-self: center;
  background: #e4e4e3;
  margin: 5px;
}

#TestDiv {
  grid-area: TestDiv;
  align-self: center;
  background: #e4e4e3;
  margin: 5px;
}

#PlayerSkillsDiv {
  grid-area: PlayerSkillsDiv;
  align-self: center;
  background: #e4e4e3;
  margin: 5px;
}

#PlayerBoardDiv {
  grid-area: PlayerBoardDiv;
  align-self: center;
  /* background: url("https://previews.123rf.com/images/prapann/prapann1606/prapann160600110/58202559-old-wood-vintage-wood-wall-texture-wood-background-old-panels.jpg"); */
  background: pink;
  margin: 5px;
}

#bottleSlotsDiv {
  grid-area: bottleSlotsDiv;
  align-self: center;
  margin: 5px;
  text-align: center;
}

#AllPlayerCardsDiv {
  grid-area: AllPlayerCardsDiv;
  align-self: center;
  display: grid;
  grid-template-columns: 15% 15% 15% 15% 15% 12,5% 12,5%;
  grid-template-areas:
  "AllPlayerIdDiv AllPlayerHandsDiv AllPlayerItemsDiv AllPlayerSkillsDiv AllPlayerIncomeDiv AllPlayerMoneyDiv AllPlayerBottlesDiv"
}

#container {
  height: 100%;
  width: 100%;
  display: grid;
  background: #D7D7D7;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-rows: 16,67% 16,67% 16,67% 16,67% 16,67% 16,67%;
  grid-template-areas:
  "BuyItemDiv BuyItemDiv RaiseValueDiv RaiseValueDiv"
  "BuyItemDiv BuyItemDiv RaiseValueDiv RaiseValueDiv"
  "BuySkillDiv BuySkillDiv AuctionDiv AuctionDiv"
  "BuySkillDiv BuySkillDiv AuctionDiv AuctionDiv"
  "GameOperationsDiv WorkDiv WorkDiv ."
  "bottleSlotsDiv bottleSlotsDiv bottleSlotsDiv bottleSlotsDiv"
  "PlayerBoardDiv PlayerBoardDiv PlayerBoardDiv PlayerBoardDiv"
}

#container h1, h2, h3, p, label, span  {
  color: black;
}

#container div {
  border-radius: 10px;
}

#container button {
  border-radius: 5px;
}


#GameOperationsDiv button {
  font-size: 15px;
}

#bottleSlotsDiv input:hover {
  transform: scale(1.1);
  transition: all 0.3s ease-in-out 0s;
}

#bottleSlotsDiv input {
  transition: all 0.2s ease-in-out 0s;
}

#drawCard_button_img {
  width: 3.5em;
  vertical-align: middle;
}

#nextRound {
  width: 7em;
  margin-bottom: 0.5em;
  padding: 10px 0px 10px 0px;
}

#money {
  width: 9em;
  margin-bottom: 0.5em;
  padding: 10px 0px 10px 0px;
}

.bottleSlots {
  width: 10%;
  margin: 0em 1.5em 0em 1.5em;
  display: inline-block;
  position: relative;
}

.function_buttons {
  width: 12em;
  margin-bottom: 0.5em;
  padding: 10px 0px 10px 0px;
  transition: 0.15s;
  transition-timing-function: ease-in-out;
}

.function_buttons:hover{
  transform: scale(1.05);
  transition: 0.15s;
  transition-timing-function: ease-in-out;
}

.function_button_img {
  width: 2em;
  vertical-align: middle;
}

.ready {
  width: 7em;
  margin-bottom: 0.5em;
  padding: 5px 0px 5px 0px;
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
  transform: scale(0.8)translate(-25%,-25%);
  z-index: 1;
}

.playercards {
  display: grid;
  grid-template-columns: repeat(auto-fill, 30px);
  grid-template-rows: repeat(auto-fill, 80px);
}

.playercards div {
  transform: scale(0.2)translate(-200%,-200%);
  transition:0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}

.playercards div:hover {
  transform: scale(0.8)translate(-20%,-20%);
  z-index: 1;
}

#skillinfodiv {
border: solid 10px #adc496
}


.skillsinfo {
width: 3.5em;
margin-right: 1em;
margin-left: 1em;
}







@media screen and (max-width: 1400px) {
  main {
    zoom: 0.7;
    -moz-transform: scale(0.7);
  }
}

@media screen and (max-width: 980px) {
  main {
    zoom: 0.6;
    -moz-transform: scale(0.6);
  }
}

@media screen and (max-width: 850px) {
  main {
    zoom: 0.5;
    -moz-transform: scale(0.5);
  }
}
@media screen and (max-width: 700px) {
  main {
    zoom: 0.4;
    -moz-transform: scale(0.4);
  }
}
</style>

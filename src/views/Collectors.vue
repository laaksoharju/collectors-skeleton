<template>
  <div>
    <main>
      <div class="table">
          <h1>COLLECTORS</h1>
          <div v-if="winner !== ''">
            <h5 class = "endedGame">
              {{ labels.winner }}  {{winner}}
          </h5>
            <div v-for="(value, key) in players" :key = "key">
              <div v-for="(valuevalue,keykey) in value" :key ="keykey">
                <div v-if="keykey == 'points'">
                  <h6 class = "playerpoint">
                   {{key}} {{labels.endPoints}} {{valuevalue}}
                 </h6>
                </div>
              </div>
            </div>
          </div>

    <!--      <label for="Name">Username</label><br>
          <input type="text" id="userName" placeholder="Username">
          <button id="userNameButton" type='submit' @click="changeUserName()" >
            Change Name
          </button>-->

          <div class="board">
            <!-- Låta spelare välja färg på flaska  -->
          <div class="playerBottleButton" v-if="players[playerId].color === ''">
           {{labels.bottleColor}}

          <!-- choosecolor - välja flaskfärg, startmoney - sätter pengarna för spelare vid start  -->
          <button id = "black"
            @click="chooseColor('black', 2);startMoney()"
            >
            <div class = "blackBottle" > </div>
          </button>

          <button id = "blue"
          @click="chooseColor('blue', 2);startMoney()">
            <div class = "blueBottle" > </div>
          </button>

          <button id = "brown"
          @click="chooseColor('brown', 2);startMoney()">
            <div class = "brownBottle" > </div>
          </button>

          <button id = "purple"
          @click="chooseColor('purple', 2);startMoney()">
            <div class = "purpleBottle" > </div>
          </button>
        </div>

        <div class="labelLink" >
          {{ labels.invite }}
        </div>
          <input id="linkSquare" type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">



        <CollectorsGetSkills v-if="players[playerId]"
             :labels="labels"
             :player="players[playerId]"
             :skillsOnSale="skillsOnSale"
             :marketValues="marketValues"
             :placement="skillPlacement"
             @getSkill="whichAction($event)"
             @placeBottle="placeBottle('skill', $event )"
        />

        <CollectorsBuyItem v-if="players[playerId]"
          :labels="labels"
          :player="players[playerId]"
          :itemsOnSale="itemsOnSale"
          :marketValues="marketValues"
          :placement="buyPlacement"
          @buyCard="buyCard($event)"
          @drawCard="drawCard($event)"
          @placeBottle="placeBottle('buy', $event)"
          />

          <CollectorsMarket v-if="players[playerId]"
          :placement="marketPlacement"
          :labels="labels"
          :player="players[playerId]"
          :skillsOnSale="skillsOnSale"
          :marketValues="marketValues"
          :market="market"
          @placeBottle="placeBottle('market', $event)"
          @startMarket="startMarket($event)"
          />

<!-- HAR INTE VÅGAT RADERA WORK ÄN HELT MEN FINNS SOM COMPONENT NU
       <div class = "workPool">
         <div class= "titleWorkPool" >Work Pool</div>
         <div class = "quarterImage">
           <div class= "quarter1" v-if="currentRound === 1" >
          </div>
           <div class= "quarter2" v-if="currentRound === 2" >
           </div>
           <div class= "quarter3" v-if="currentRound === 3" >
           </div>
           <div class= "quarter4" v-if="currentRound === 4" >
           </div>
         </div>
         <div class = "Alt1"></div>
         <div class = "Alt2"></div>
         <div class = "Alt3"></div>
         <div class = "Alt4"></div>
       </div>
-->
       <CollectorsWork v-if="players[playerId]"
          :labels="labels"
          :player="players[playerId]"
          :currentRound="currentRound"
          :placement="workPlacement"
          :quarterPlacement="quarterPlacement"

          :marketValues="marketValues"
          @drawCard="drawCard($event)"
          @placeBottleWork="placeBottleWork($event)"
          @placeQuarterBottle="placeQuarterBottle($event)"
          />

       <CollectorsStartAuction v-if="players[playerId]"
            :labels="labels"
            :player="players[playerId]"
            :auctionCards="auctionCards"
            :cardUpForAuction="cardUpForAuction"
            :marketValues="marketValues"
            :placement="auctionPlacement"
            :auctionWinner="auctionWinner"
            :highestBid="highestBid"
            @startAuction="whichAction($event)"
            @startBidding="startBidding($event)"
            @stopAuction="stopAuction()"
            @startWinnerCard="startWinnerCard($event)"
            @placeBottle="placeBottle('auction', $event)"
            />

       <div v-if="players[playerId]" class="playerBoard">
         <div class="playerTitle"> {{labels.player}} {{playerId}} {{labels.playersBoard}} </div>
            <div class="skillTitle">
              {{labels.skillcard}}
            </div>
             <div class="chosenSkillCard" v-for="(card, index) in players[playerId].skills" :card="card" :key="'Skill card chosen'+index">
                  <CollectorsCard
                  :card="card"
                  />
                  </div>
            <div class="itemTitle">
                  {{labels.itemcard}}
            </div>
            <div class="chosenItemCard" v-for="(card, index) in players[playerId].items" :card="card" :key="'Item'+index">
                  <CollectorsCard
                  :card="card"
                  />
           </div>
           <div class="secretTitle">
                   {{labels.secretcard}}
           </div>
           <div class="chosenSecret" v-for="(card, index) in players[playerId].secret" :card="card" :key="'Secret'+index">
                 <CollectorsCard
                 :card="card"
                 />
          </div>

          <div class="incomeCard">
                  {{labels.incomecard}}
          </div>
          <div class= "income" >
          <div class="chosenIncome" v-for="(card, index) in players[playerId].income" :card="card" :key="'Income'+index">
                <CollectorsCard
                :card="card"
                />
         </div>
       </div>

          <div class="myMoney" v-for="(value, key) in players" :key = "key">
                <div v-for="(valuevalue,keykey) in value" :key ="keykey">
                  <div v-if="keykey == 'money' && key == playerId ">
                    {{labels.coins}} {{valuevalue}}
                  </div>
                </div>
          </div>
             <!-- Visa spelarens färg och iterera fram rätt antal energybottles på playerboard -->
           <div >
                <div v-if="('black' === players[playerId].color)">
                    <div class="playerBottles" v-for="index in players[playerId].playerBottles" :key="index">
                        <div class="blackBottle"> </div>
                   </div>

               </div>

               <div v-if="('blue' === players[playerId].color)">
                    <div v-for="index in players[playerId].playerBottles" :key="index">
                          <div class="blueBottle"> </div>
                    </div>
              </div>

              <div v-if="('brown' === players[playerId].color)">
                  <div v-for="index in players[playerId].playerBottles" :key="index">
                      <div class="brownBottle"> </div>
                  </div>
             </div>

             <div v-if="('purple' === players[playerId].color)">
                  <div v-for="index in players[playerId].playerBottles" :key="index">
                    <div class="purpleBottle"> </div>
                  </div>
            </div>
        </div>

        </div>

      <div class="playerHand">
        <div class="playerHandTitle"> {{playerId}} {{labels.playerHand}} </div>
        <!-- visa spelarens kort i handen, förstår inte varför korten blir pyttesmå -->
        <div class="cardslots" v-if="players[playerId]">
          <div v-for="(card, index) in players[playerId].hand" :key="index">
            <CollectorsCard  :card="card" :availableAction="card.available" @doAction="buyCard(card)" />
          </div>
        </div>

        <!-- visa hur mycket pengar man har -->

          <div class = "otherCoins">
            {{labels.otherPlayerInfo}}
            <div v-for="(value, key) in players" :key = "key">
              <div v-for="(valuevalue,keykey) in value" :key ="keykey">
                <li v-if="keykey == 'money' && key != playerId ">
                   {{key}} {{labels.otherCoins}} {{valuevalue}}
                </li>
              </div>
            </div>
          </div>
      </div>
      <!-- Vems tur? Start på ruta för att visa vems tur -->
      <div class="turnCounter">
        <h3> {{labels.turn}} </h3>
        <button class="turnButton"  @click= "changeTurn">  <!--  @click= "changeTurn" -->
          <div v-if="currentPlayer === '' ">
            <h5>  {{allPlayersId[0]}} </h5> <h3> {{labels.changeturn}} </h3>
          </div>
          <div v-else>
            <h5>   {{currentPlayer}} </h5> <h3> {{labels.changeturn}}</h3>
          </div>
        </button>
      </div>

      <div class="roundCounter">
        <h3> {{labels.round}}</h3>
        <button class="roundButton"  @click= "changeRound()">
          <div v-if="currentRound < 5">
            <h5> {{currentRound}} </h5> <h3> {{labels.changeround}} {{currentRound}} {{labels.changeround2}}</h3>
          </div>
          <div v-else >
            <h5> {{labels.endgame}} </h5>
          </div>
        </button>
      </div>



      <!-- Ruta för att visa vilka spelare som är i rummet -->
      <div class="showPlayers">
        {{labels.showplayers}}
        <div v-for="(player,key) in players" :key = "key">
          <div>
            {{key}}
          </div>
        </div>
      </div>
     </div>
    </div>

    <button title="Rules!" type="button" id="rulesButton" class="rulesButton" v-on:click="ruleFunction">
      <h2> {{ labels.readRules }}</h2>
    </button>
    <div id="ruleContent">
    </div>
    <div> <img id="myImage" src="/images/backgroundblue.png" height="50" > </div>

     <!-- FRÅN DRAWCARD SOM VI FICK FRÅN BÖRJAN, KOPPLAT TILL PLAYERID
     <div class="itemCard" v-if="players[playerId]">
       <CollectorsCard v-for="(card, index) in players[playerId].items" :card="card" :key="index"/>
     </div> -->

<!--
  Här : {{allPlayersId}}
    {{buyPlacement}} {{chosenPlacementCost}}
-->
<!--
      <CollectorsBuyActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :itemsOnSale="itemsOnSale"
        :marketValues="marketValues"
        :placement="buyPlacement"
        @buyCard="buyCard($event)"
        @placeBottle="placeBottle('buy', $event)"
        />
-->
</main>
  <!--  {{players}}
    {{marketValues}}
    <button v-if="players[playerId]" @click="players[playerId].money += 1">
      fake more money
    </button> -->
    <footer>
      <footer>
        <hr>
      &copy; COLLECTORS 2021<br>
    </footer>



      <!--  <p>
          {{ labels.invite }}
          <input type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
        </p> -->
    </footer>
</div>
</template>

<script>
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/
import CollectorsCard from '@/components/CollectorsCard.vue'
//import CollectorsBuyActions from '@/components/CollectorsBuyActions.vue'
import CollectorsGetSkills from '@/components/CollectorsGetSkills.vue'
import CollectorsStartAuction from '@/components/CollectorsStartAuction.vue'
import CollectorsBuyItem from '@/components/CollectorsBuyItem.vue'
import CollectorsMarket from '@/components/CollectorsMarket.vue'
import CollectorsWork from '@/components/CollectorsWork.vue'
export default {
  name: 'Collectors',
  components: {
    CollectorsCard,
  //  CollectorsBuyActions,
    CollectorsGetSkills,
    CollectorsStartAuction,
    CollectorsBuyItem,
    CollectorsMarket,
    CollectorsWork
  },
  data: function () {
    return {
      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      myCards: [],
      maxSizes: { x: 0,
                  y: 0 },
      labels: {},
      players: {},
      currentPlayer: "",
      currentRound: 1, //lagt till 14/12
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
      quarterPlacement: [],
      chosenPlacementCost: null,
      chosenPlacementId: null,
      marketValues: { fastaval: 0,
                     movie: 0,
                     technology: 0,
                     figures: 0,
                     music: 0 },
      itemsOnSale: [],
      skillsOnSale: [],
    //  workDeck: [],
      auctionCards: [],
      market:[],
      cardUpForAuction: {},
      auctionWinner: "",
      winner: "",
      chosenAction: "",
      highestBid: 0,
      rules: ""
      //randomNumber: ""
    }
  },
  computed: {
    playerId: function() { return this.$store.state.playerId},
    allPlayersId: function() {
      return Object.keys(this.players); //få nyckeln till players - playerId
    }/*,
    numbOfPlayers: function () {
      let counter = (Object.keys(this.players)).length;
      return counter
    }*/
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
        playerId: this.$store.state.playerId } );
    this.$store.state.socket.on('collectorsInitialize',
      function(d) {
        this.labels = d.labels;
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
        this.marketValues = d.marketValues;
        this.skillsOnSale = d.skillsOnSale;
      //  this.workDeck = d.workDeck;
        this.auctionCards = d.auctionCards;
        this.buyPlacement = d.placements.buyPlacement;
        this.skillPlacement = d.placements.skillPlacement;
        this.marketPlacement = d.placements.marketPlacement;
        this.auctionPlacement = d.placements.auctionPlacement;
        this.workPlacement = d.placements.workPlacement;
        this.quarterPlacement = d.placements.quarterPlacement;
      }.bind(this));
    this.$store.state.socket.on('collectorsBottlePlaced',
      function(d) {
        this.buyPlacement = d.buyPlacement;
        this.skillPlacement = d.skillPlacement;
        this.marketPlacement = d.marketPlacement;
        this.auctionPlacement = d.auctionPlacement;
        this.workPlacement = d.workPlacement;
        this.quarterPlacement = d.quarterPlacement;
      }.bind(this));
      this.$store.state.socket.on('collectorsWorkBottlePlaced',
        function(d) {
          this.players= d.players;
          this.workPlacement = d.placements.workPlacement;
          }.bind(this));
          this.$store.state.socket.on('collectorsQuarterBottlePlaced',
            function(d) {
              this.quarterPlacement = d.quarterPlacement;
              this.players= d.players;
              this.currentRound= d.currentRound;
              console.log("collectors placement " + d.quarterPlacement);
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
      this.$store.state.socket.on('collectorsSkillValueCaught',
        function(d) {
          this.players = d.players;
        }.bind(this)
      );
    this.$store.state.socket.on('collectorsSkillCaught',
      function(d) {
        console.log(d.playerId, "Got a skill");
        this.players = d.players;
        this.skillsOnSale = d.skillsOnSale;
      }.bind(this)
    );
    this.$store.state.socket.on('collectorsChangedTurn',
      function(d) {
          this.currentPlayer = d;
      }.bind(this)
    );
    this.$store.state.socket.on('collectorsChangedRound',
      function(d) {
          console.log( "Changed round");
          console.log(d.placements);
          this.currentRound = d.currentRound;
          this.buyPlacement= d.placements.buyPlacement;
          this.skillPlacement= d.placements.skillPlacement;
          this.auctionPlacement= d.placements.auctionPlacement;
          this.marketPlacement= d.placements.marketPlacement;
          this.workPlacement= d.placements.workPlacement;
          this.quarterPlacement= d.placements.quarterPlacement;
      }.bind(this)
    );
    this.$store.state.socket.on('collectorsNewlyRounded',
      function(d) {
          this.itemsOnSale = d.itemsOnSale;
          this.skillsOnSale = d.skillsOnSale;
          this.auctionCards = d.auctionCards;
          this.buyPlacement= d.placements.buyPlacement;
          this.skillPlacement= d.placements.skillPlacement;
          this.auctionPlacement= d.placements.auctionPlacement;
          this.marketPlacement= d.placements.marketPlacement;
          this.workPlacement= d.placements.workPlacement;
          this.quarterPlacement= d.placements.quarterPlacement;
          this.marketValues = d.marketValues;
          this.players = d.players;
          this.currentRound = d.currentRound;
      }.bind(this)
    );
    this.$store.state.socket.on('collectorsBottlesFilled',
    function(d) {
        this.players = d.players
    }.bind(this)
  );
  this.$store.state.socket.on('collectorsGotIncome',
  function(d) {
      this.players = d.players
  }.bind(this)
);
    this.$store.state.socket.on('collectorsEndedGame',
      function(d) {
          this.winner = d.winner;
          this.players = d.players
          console.log("ended game socket collectors.vue" + d.winner)
      }.bind(this)
    );
    this.$store.state.socket.on('collectorsAuctionStarted',
    function(d) {
      console.log(d.playerId, "Started an auction");
      this.players = d.players;
      this.auctionCards = d.auctionCards;
      this.cardUpForAuction = d.cardUpForAuction;
    }.bind(this)
  );
  this.$store.state.socket.on('collectorsAuctionStopped',
  function(d) {
    console.log(d.playerId, "Stopped an auction");
    console.log(d.auctionWinner, "auction winner");
    this.players = d.players;
    this.cardUpForAuction = d.cardUpForAuction;
    this.auctionWinner = d.auctionWinner;
  }.bind(this)
);
  this.$store.state.socket.on('collectorsMarketStarted',
  function(d) {
    console.log(d.playerId, "Started market");
    this.players = d.players;
    this.skillsOnSale = d.skillsOnSale;
    this.market = d.market;
    this.marketValues = d.marketValues;  //lagt till marketValues
  }.bind(this)
);
  this.$store.state.socket.on('collectorsBiddingStarted',
  function(d) {
    this.players = d.players;
    this.highestBid = d.highestBid;
  }.bind(this)
);
this.$store.state.socket.on('collectorsColorChosen',
function(d) {
  this.players = d.players;
  console.log(d.playerId, "choosed a ", d.players[d.playerId].color," color bottle");
}.bind(this)
);
this.$store.state.socket.on('collectorsMoneyStarted',
function(d) {
  this.players = d.players;
}.bind(this)
);
this.$store.state.socket.on('collectorsWinnerCardStarted',
function(d) {
  this.players = d.players;
  this.auctionWinner = d.auctionWinner;
  this.cardUpForAuction = d.cardUpForAuction;
  this.marketValues = d.marketValues;
}.bind(this)
);
},
  methods: {
    selectAll: function (n) {
      n.target.select();
    },
/*    changeUserName: function() {
     var userName = document.getElementById('userName').value;
      //var name = playerId();
      this.$store.state.playerId = userName;
    //  this.players[playerId] = userName;
  },*/
    chooseColor: function(color, playerBottles){
      this.$store.state.socket.emit('collectorsChooseColor',{
      roomId: this.$route.params.id,
      playerId: this.playerId,
      color: color,
      playerBottles: playerBottles
      }
      );
    },
    startMoney: function(){
      this.$store.state.socket.emit('collectorsStartMoney',{
      roomId: this.$route.params.id,
      playerId: this.playerId,
      }
      );
    },
    placeBottle: function (action, p) {
      this.chosenPlacementId = p.placementId;
      this.chosenPlacementCost = p.cost;
      this.chosenAction = action;
      this.$store.state.socket.emit('collectorsPlaceBottle', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          action: action,
          cost: p.cost,
          placementId: p.placementId,
        }
      );
    },
    placeBottleWork: function (p) {
      this.chosenPlacementCost = p.cost;
      this.chosenAction = p.action;
      this.$store.state.socket.emit('collectorsPlaceWorkBottle', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          workActionId: p.workActionId,
          cost: p.cost,
        }
      );
    },
    placeQuarterBottle: function (p) {
      this.chosenPlacementCost = p.cost;
      this.chosenAction = p.action;
      console.log("currentroundid i collectors vue: "+(this.currentRound));
      this.$store.state.socket.emit('collectorsPlaceQuarterBottle', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          currentRound: this.currentRound,
          cost: p.cost,
        }
      );
    },
    whichAction: function (card){
      if (this.chosenAction === "skill") {
        this.getSkill(card)
            }
      if (this.chosenAction === "market") {
        this.startMarket(card)
      }
      if (this.chosenAction === "auction") {
        this.startAuction(card)
      }
    //  if (this.chosenAction === "work" ) {
    //  }
    },
    buyCard: function (card) {
      this.$store.state.socket.emit('collectorsBuyCard', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          card: card,
          cost: this.marketValues[card.market] + this.chosenPlacementCost
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
    getSkillValue: function (card) {
      this.$store.state.socket.emit('collectorsGetSkillValue', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          card:card
        }
      );
    },
    getSkill: function (card) {
      this.$store.state.socket.emit('collectorsGetSkill', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          card: card,
          skill: this.skillsOnSale,
          cost: this.chosenPlacementCost
        }
      );
      this.getSkillValue(card);
    },
    startAuction: function (card) {

      this.$store.state.socket.emit('collectorsStartAuction', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          card: card,
          cost: this.chosenPlacementCost
        }
      );
    },
    startMarket: function (card) {
      console.log("startMarket", card);
      this.$store.state.socket.emit('collectorsStartMarket', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          card: card,
        //  cardUpForMarket: this.cardUpForMarket,
        }
      );
    },
      startBidding: function () {
        console.log("Starting Bidding");
        console.log("this.players.bids" +this.players.bids);
        console.log("this.players[this.playerId]" +this.players[this.playerId]);
        console.log("this.playerId]" +this.playerId);
        console.log("this.players[this.playerId].bids" +this.players[this.playerId].bids);
        this.$store.state.socket.emit('collectorsStartBidding', {
            roomId: this.$route.params.id,
            playerId: this.playerId,
            bids: this.players[this.playerId].bids,
              }
        );
  },
  stopAuction: function () {
    console.log("Starting stop auction", this.cardUpForAuction);
    this.$store.state.socket.emit('collectorsStopAuction', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: this.cardUpForAuction,
          }
    );
},
startWinnerCard: function(action){
  console.log("start winner card collectors!!")
  console.log("start winner card collectors.vue med action "+action)
  this.$store.state.socket.emit('collectorsWinnerCard', {
    roomId: this.$route.params.id,
    playerId: this.playerId,
    card: this.cardUpForAuction,
    action: action,
  });
},
    changeTurn: function () {
      this.$store.state.socket.emit('collectorsChangeTurn', {
          roomId: this.$route.params.id,
          currentPlayer: this.currentPlayer
          }
        );
      },
/*    changeRound: function () {
      this.$store.state.socket.emit('collectorsChangeRound', {
          roomId: this.$route.params.id,
          currentRound: this.currentRound
          }
        );
    },*/
    endGame: function(){
            this.$store.state.socket.emit('collectorsEndGame', {
            roomId: this.$route.params.id,
            marketValues: this.marketValues
            }
          );
<<<<<<< HEAD
      }
    },
=======
        },

/* FIXA PÅ SRVER_SIDAN aneopa genom new round
>>>>>>> 79853bf8685f0b1b802b4e849e592f4277f8b04f
fillBottles: function()
{
  this.$store.state.socket.emit('collectorsFillBottles', {
      roomId: this.$route.params.id,
      players: this.players
});
},
getIncome: function()
{
  this.$store.state.socket.emit('collectorsGetIncome', {
      roomId: this.$route.params.id,
      players: this.players
});
<<<<<<< HEAD
},
    newRound: function(currentRound){
      if (currentRound != 4){
      this.fillBottles();
      this.getIncome();
=======
},*/
    changeRound: function(){
      if (this.currentRound != 4){

>>>>>>> 79853bf8685f0b1b802b4e849e592f4277f8b04f
        this.$store.state.socket.emit('collectorsNewRound', {
            roomId: this.$route.params.id,
              }
          );
      }
      else this.endGame();
    },
    ruleFunction: function() {
      var placement = document.getElementById("ruleContent");
      var rules1=
      ["Collectors is a game for 2-4 players and the winning player is " +
      "the one with the most valuable collection of rare collectables " +
      "in the end. The game board is divided into 5 different areas, " +
      "item pool, skill pool, auction pool, work pool and market pool."];
      var rules2 = ["ITEM POOL. You use Buy Item if you want to buy one card from the item pool " +
        "(the red ish area) or from your own hand. The cost will depend on " +
        "how many cards there are with the same symbol in the Market pool " +
        "(the blue ish area). The cost will also contain the cost for where " +
        "the bottle was placed. "];
      var rules3 = ["SKILL POOL. The Skill area is used if you want to grant skills for the rest " +
      "of the game. You gain skill by taking one of the cards from the skill " +
      "pool or from your hand and place it in the gain skill area " +
      "(the green ish area). There are different skills available in Collectors " +
      "and these are explained on the player board. "];
      var rules4 = ["WORK POOL. In the Work area you perform actions to increase your income, " +
      "recycle bottles, draw cards and become the first player. You use this " +
      "area by placing bottles in the action space, depending on which place "+
      "you choose you get and have to do different things. For example if you "+
      "put your bottle on the second space you get to draw two cards from the " +
      "deck to your hand. "];
      var rules5 = ["AUCTION POOL. The Auction area is used when you want to do an auction, you can" +
      "choose a card from your own hand or from the Auction area. If you take" +
      "a card from your hand then you may place it face down so the other" +
      "players do not know what kind of card it is when they bid on it. " +
      "The first player can bid any number of coins with a minimum of one then " +
      "the second player must place a higher bid or pass. The winner gets the " +
      "card and must pay the bid amount. When paying in an auction you can use " +
      "cards from your hand as coins, then there is the worth as depicted in " +
      "the upper right corner of the card. "];
      var rules6 = ["MARKET POOL. The last area is Raise Value where you must place cards in the market " +
      "area that are equal to the number of seals on your action space. "+
      "You may place cards from your hand, from the card in the lowest position " +
      "in the skill pool or from the lowest card in the auction pool. "];
      var rules7 = ["The cards used in Collectors have multiple functions, " +
      "see the picture below for an explanation:"]
      let pic = ['/images/kort.png'];
      document.getElementById("myImage").src = pic[0];
      document.getElementById("myImage").height = 350;
      var linebreak0 = document.createElement("p"); var linebreak1 = document.createElement("p");
      var linebreak2 = document.createElement("p"); var linebreak3 = document.createElement("p");
      var linebreak4 = document.createElement("p");  var linebreak5 = document.createElement("p");
      var linebreak6 = document.createElement("p");
      var text= document.createElement("div");
      var output1 = document.createTextNode(rules1);
      var output2 = document.createTextNode(rules2);
      var output3 = document.createTextNode(rules3);
      var output4 = document.createTextNode(rules4);
      var output5 = document.createTextNode(rules5);
      var output6 = document.createTextNode(rules6);
      var output7 = document.createTextNode(rules7);
      text.appendChild(output1); text.appendChild(linebreak0);
      text.appendChild(output2); text.appendChild(linebreak1);
      text.appendChild(output3); text.appendChild(linebreak2);
      text.appendChild(output4); text.appendChild(linebreak3);
      text.appendChild(output5); text.appendChild(linebreak4);
      text.appendChild(output6); text.appendChild(linebreak5);
      text.appendChild(output7); text.appendChild(linebreak6);
      placement.appendChild(text);
    }
    /* försöker skapa random nummer för att slumpa vem som börjar
    randomNumber: function(){
      let countPlayers = (allPlayersId()).length;
      return Math.floor(Math.random() * (countPlayers - 1 + 1)) + 1;
    } */
/* den här funktionen tror jag ej används:
        countRounds: function () {
          console.log("TEST RÄKNA RUNDOR");
          this.$store.state.socket.emit('collectorsCountRounds', {
              roomId: this.$route.params.id,
              currentPlayer: this.currentPlayer
              }
            );
          }*/
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
  font-style:italic;
  font-size: 50px;
  text-shadow: 2px 2px 4px blue;
  margin-bottom: 0px;
}
h5 {
  text-align: center;
  font-style:italic;
  font-size: 30px;
  text-shadow: 1px 2px 2px blue;
  margin-bottom: 0px;
  margin-top: 0px;
}
  header {
    user-select: none;
    position: fixed;
    width:100%;
    pointer-events: none;
  }
  main {
    user-select: none;
  }
  .table {
    padding-left: 50px;
    padding-right: 50px;
  }
  .board {
	display: grid;
	grid-template-columns: repeat(15,90px);
	grid-template-rows: repeat(20, 45px);
	grid-gap: 0px;
	margin: 1px ;
	background: $black;
	border: 2px solid $black;
  }
  .playerBottleButton {
    grid-row: 1;
    grid-column: 1 / span 5;
    }
  .playerBottleButton div:hover{
    transform: scale(1.5)translate(0,0);
    z-index: 1;
  }
  .labelLink {
    grid-column: 5 / span 3;
    grid-row: 1;
    place-self:end;
  }
  #linkSquare {
    height: 10px;
    place-self: end left;
    width: 172px;
    grid-column: 8;
    background-color: #76B0B7;
    color: white;
  }
  .blackBottle{
    width:32px;
    height:32px;
    background-image:  url('/images/player-bottle-black.png');
    background-size: cover;
  }
  #black {
    background-color: #474342;
    border-radius: 5px;
    border: 2px solid #E3A688;
  }
  .blueBottle{
    width:32px;
    height:32px;
    background-image:  url('/images/player-bottle-blue.png');
    background-size: cover;
  }
  #blue {
    background-color: #12B3A9 ;
    border-radius: 5px;
    border: 2px solid #E3A688;
  }
  .brownBottle{
    width:32px;
    height:32px;
    background-image:  url('/images/player-bottle-brown.png');
    background-size: cover;
  }
  #brown {
    background-color: #B79048 ;
    border-radius: 5px;
    border: 2px solid #E3A688;
  }
  .purpleBottle{
    width:32px;
    height:32px;
    background-image:  url('/images/player-bottle-purple.png');
    background-size: cover;
  }
  #purple {
    background-color: #6B2977;
    border-radius: 5px;
    border: 2px solid #E3A688;
  }
.playerBottles {
  grid-row: 1;
  grid-column: 4;
}
  .playerBoard {
    grid-column: 11/span 5;
    grid-row: 2/span 6;
    width: auto;
    height: auto;
    background-color: pink ;
    color: black;
    display: grid;
    grid-template-columns: repeat(8, 51px);
    grid-template-rows: repeat(4,67px);
    grid-auto-flow: row;
    grid-column-gap: 5px;
    grid-row-gap: 5px;
    border: 2px solid #4C7B80;
  }
.playerTitle {
  grid-row: 1;
  grid-column: 1 / span 3;
  font-style: italic;
  font-size: 50px;
  text-shadow: 2px 2px 4px #BD5467;
  font-size: 20px;
}
.myMoney {
  grid-row: 1 ;
  grid-column: 5/span 2;
  place-self: top;
}
.skillTitle {
  grid-row: 3;
  place-self: end;
}
  .chosenSkillCard {
    grid-row: 3;
    transform: scale(0.2);
  }
.secretTitle{
  grid-row:1 ;
  grid-column: 7 /span 2;
}
  .chosenSecret {
    grid-row: 1;
    grid-column: 7;
    transform: scale(0.2);
  }
  .incomeCard{
    grid-row:3 ;
    grid-column: 7 /span 2;
  }
<<<<<<< HEAD
    .chosenIncome {
      grid-row: 3 ;
      grid-column: 7;
      transform: scale(0.2);
    }
=======

  .chosenIncome {
    grid-auto-flow: column;
    display: grid;
    grid-template-columns: 12vw 12vw 12vw 12vw;
  }

  .income {
    grid-row: 3 ;
    grid-column: 7;
    transform: scale(0.2);
  }


>>>>>>> 79853bf8685f0b1b802b4e849e592f4277f8b04f
.itemTitle {
  grid-row:2;
  place-self: end;
}
  .chosenItemCard {
    grid-row: 2;
    transform: scale(0.2);
  }
  .playerHand {
    grid-column: 11/span 5;
    grid-row: 8/span 4;
    display: grid;
    grid-template-columns: repeat(1, 450px);
    grid-template-rows: repeat(4,60px);
  }
  .playerHandTitle {
    grid-column: 1;
    grid-row: 1;
  }
  .turnCounter {
    background-color: #60AB4D;
    color:white;
    grid-column: 5/ span 2;
    grid-row: 16/span 2;
    text-align: center;
  }
  .roundCounter {
    background-color: #4C7B80;
    color:white;
    grid-column: 8/ span 2;
    grid-row: 16/span 2;
    text-align: center;
  }
  h6{
    text-align: center;
    font-style:italic;
    font-size: 20px;
    text-shadow: 1px 2px 2px blue;
    margin-bottom: 0px;
    margin-top: 0px;
  }
.endedGame{
  text-shadow: 1px 2px 2px green;
}
#userName {
  background-color: #76B0B7;
}
  #userNameButton {
    grid-column: 1;
    grid-row: 1;
    background-color: #5A99A1;
  }
  .showPlayers {
    background-color: #406c72;
    color: white;
    grid-column: 1/span 2;
    grid-row: 16/span 4;
    text-align: center;
    border: 5px dotted pink ;
  }
  .buttons{
    grid-column: 1;
    grid-row: 10;
  }
  .turnButton {
    background-color: #B1E168;
    cursor: pointer;
    border: 10px dotted #60AB4D ;
    text-align: center;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
  }
  .turnButton:hover {
  background-color: #60AB4D;
  color: white;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
  }
  .roundButton:hover {
  background-color: #4C7B80;
  color: white;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
  }
  .roundButton {
    background-color: lightblue;
    cursor: pointer;
    border: 10px dotted #4C7B80 ;
    text-align: center;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
  }
  #rulesButton {
    margin: 5px 50px 5px 50px;
    padding: 1px 100px 1px;
    cursor:pointer;
    transition-duration: 0.4s;
    background-color: #f08080 ;
    color:white;
  }
  #ruleContent {
    margin: 50px 50px 50px 50px;
    padding: 10px 10px;
    font-size: 20px;
    font-style: oblique;
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
  .otherCoins {
    grid-column: 1;
    grid-row: 4;
  }
  .cardslots {
    grid-column: 1;
    grid-row: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, 130px);
    grid-template-rows: repeat(auto-fill, 1px);
  }
  .cardslots div {
    transform: scale(0.5); /* scale - minska kortens strl*/
    transition:0.2s;
    transition-timing-function: ease-out;
    z-index: 0;
  }
  .cardslots div:hover {
    transform: scale(0.6);
    z-index: 1;
  }
  .itemCard{
    grid-row: 2;
    transform: scale(0.25);
  }
  .itemCard div:hover{
    transform: scale(2)translate(-25%,0);
    z-index: 1;
  }
  /*MOBIL VERISION*/
  @media screen and (max-width: 800px) {
    main {
      width:90vw;
    }
    h1 {
      text-align: left;
      font-style:italic;
      font-size: 40px;
      text-shadow: 2px 2px 4px blue;
      margin-bottom: 0px;
    }
    h3 {
      font-size: 12px;
    }
    h5 {
      text-align: center;
      font-style:italic;
      font-size: 20px;
      text-shadow: 1px 2px 2px blue;
      margin-bottom: 0px;
      margin-top: 0px;
    }
      header {
        user-select: none;
        position: fixed;
        width:100%;
        pointer-events: none;
      }
    .table {
      padding-left: 5px;
      padding-right: 5px;
      grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    }
.board {
  display: grid;
  /*grid-template-columns: repeat(15,90px);*/
  grid-template-rows: repeat(6, 45px);
  grid-gap: 0px;
  margin: 20px ;
  background: $black;
  border: 2px solid $black;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
    .blackBottle{
      width:32px;
      height:32px;
      background-image:  url('/images/player-bottle-black.png');
      background-size: cover;
    }
    #black {
      background-color: #474342;
      border-radius: 5px;
      border: 2px solid #E3A688;
    }
    .blueBottle{
      width:32px;
      height:32px;
      background-image:  url('/images/player-bottle-blue.png');
      background-size: cover;
    }
    #blue {
      background-color: #12B3A9 ;
      border-radius: 5px;
      border: 2px solid #E3A688;
    }
    .brownBottle{
      width:32px;
      height:32px;
      background-image:  url('/images/player-bottle-brown.png');
      background-size: cover;
    }
    #brown {
      background-color: #B79048 ;
      border-radius: 5px;
      border: 2px solid #E3A688;
    }
    .purpleBottle{
      width:32px;
      height:32px;
      background-image:  url('/images/player-bottle-purple.png');
      background-size: cover;
    }
    #purple {
      background-color: #6B2977;
      border-radius: 5px;
      border: 2px solid #E3A688;
    }
  .playerBottles {
    grid-row: 1;
    grid-column: 4;
  }
    .playerBoard {
      grid-column: 1/span 5;
      grid-row: 24/span 6;
      width: auto;
      height: auto;
      background-color: pink ;
      color: black;
      display: grid;
      grid-template-columns: repeat(8, 51px);
      grid-template-rows: repeat(4,67px);
      grid-auto-flow: row;
      grid-column-gap: 5px;
      grid-row-gap: 5px;
      border: 2px solid #4C7B80;
    }
  .playerTitle {
    grid-row: 1;
    grid-column: 1 / span 3;
    font-style: italic;
    font-size: 50px;
    text-shadow: 2px 2px 4px #BD5467;
    font-size: 20px;
  }
  .myMoney {
    grid-row: 1 ;
    grid-column: 5/span 2;
    place-self: top;
  }
  .skillTitle {
    grid-row: 3;
    place-self: end;
  }
    .chosenSkillCard {
      grid-row: 3;
      transform: scale(0.2);
    }
  .secretTitle{
    grid-row:1 ;
    grid-column: 7 /span 2;
  }
    .chosenSecret {
      grid-row: 1;
      grid-column: 7;
      transform: scale(0.2);
    }
  .itemTitle {
    grid-row:2;
    place-self: end;
  }
    .chosenItemCard {
      grid-row: 2;
      transform: scale(0.2);
    }
    .playerHand {
      grid-column: 6/span 5;
      grid-row: 24/span 4;
      display: grid;
      grid-template-columns: repeat(1, 400px);
      grid-template-rows: repeat(4,60px);
    }
    .playerHandTitle {
      grid-column: 1;
      grid-row: 1;
    }
    .turnCounter {
      background-color: #60AB4D;
      color:white;
      grid-column: 3/ span 2;
      grid-row: 2;
      text-align: center;
    }
    .roundCounter {
      background-color: #4C7B80;
      color:white;
      grid-column: 5/ span 2;
      grid-row: 2 span ;
      text-align: center;
    }
    h6{
      text-align: center;
      font-style:italic;
      font-size: 20px;
      text-shadow: 1px 2px 2px blue;
      margin-bottom: 0px;
      margin-top: 0px;
    }
  .endedGame{
    text-shadow: 1px 2px 2px green;
  }
  #userName {
    background-color: #76B0B7;
  }
  .labelLink {
    grid-column: 5 / span 2;
    grid-row: 1;
    place-self:end;
    }
  #linkSquare {
    height: 10px;
    place-self: end left;
    width: 100px;
    grid-column: 6;
    grid-row: 1;
    background-color: #76B0B7;
    color: white;
    font-size: 11px;
  }
    #userNameButton {
      grid-column: 1;
      grid-row: 1;
      background-color: #5A99A1;
    }
    .showPlayers {
      background-color: #406c72;
      color: white;
      grid-column: 1/span 2;
      grid-row: 2/span 3;
      text-align: center;
      border: 5px dotted pink ;
    }
    .buttons{
      grid-column: 1;
      grid-row: 10;
    }
    .turnButton {
      background-color: #B1E168;
      cursor: pointer;
      border: 10px dotted #60AB4D ;
      text-align: center;
      box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    }
    .turnButton:hover {
    background-color: #60AB4D;
    color: white;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    }
    .roundButton:hover {
    background-color: #4C7B80;
    color: white;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    }
    .roundButton {
      background-color: lightblue;
      cursor: pointer;
      border: 10px dotted #4C7B80 ;
      text-align: center;
      box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    }
    #rulesButton {
      margin: 5px 50px 5px 50px;
      padding: 1px 100px 1px;
      cursor:pointer;
      transition-duration: 0.4s;
      background-color: #f08080 ;
      color:white;
    }
    #ruleContent {
      margin: 50px 50px 50px 50px;
      padding: 10px 10px;
      font-size: 20px;
      font-style: oblique;
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
    .otherCoins {
      grid-column: 1;
      grid-row: 4;
    }
    .cardslots {
      grid-column: 1;
      grid-row: 1;
      display: grid;
      grid-template-columns: repeat(auto-fill, 70px);
      grid-template-rows: repeat(auto-fill, 1px);
    }
    .cardslots div {
      transform: scale(0.5); /* scale - minska kortens strl*/
      transition:0.2s;
      transition-timing-function: ease-out;
      z-index: 0;
    }
    .cardslots div:hover {
      transform: scale(0.6);
      z-index: 1;
    }
    .itemCard{
      grid-row: 2;
      transform: scale(0.25);
    }
    .itemCard div:hover{
      transform: scale(2)translate(-25%,0);
      z-index: 1;
    }
  }
</style>

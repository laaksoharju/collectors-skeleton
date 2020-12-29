<template>
  <div>
    <main>
      <div class="table">
          <h1>COLLECTORS</h1>

          <label for="Name">Username</label><br>
          <input type="text" id="userName" placeholder="Username">
          <button id="userNameButton" type='submit' @click="changeUserName()" >
            Change Name
          </button>

            <!-- Låta spelare välja färg på flaska  -->
          <div class="playerBottleButton" v-if="players[playerId] && players[playerId].color === ''">
          Choose your bottle color

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

          {{ labels.invite }}
          <input id="linkSquare" type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">

      <div class="board">
        <CollectorsGetSkills v-if="players[playerId]"
             :labels="labels"
             :player="players[playerId]"
             :skillsOnSale="skillsOnSale"
             :marketValues="marketValues"
             :placement="skillPlacement"
             @getSkill="whichAction($event)"
             @placeBottle="placeBottle('skill', $event)"
        />

        <CollectorsBuyItem v-if="players[playerId]"
          :labels="labels"
          :player="players[playerId]"
          :itemsOnSale="itemsOnSale"
          :marketValues="marketValues"
          :placement="buyPlacement"
          @buyCard="buyCard($event)"
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
          :skillsOnSale="skillsOnSale"
          :marketValues="marketValues"
          @placeBottle="placeBottle('work', $event)"
          />

       <CollectorsStartAuction v-if="players[playerId]"
            :labels="labels"
            :players="players"
            :player="players[playerId]"
            :auctionCards="auctionCards"
            :cardUpForAuction="cardUpForAuction"
            :marketValues="marketValues"
            :placement="auctionPlacement"
            :auctionWinner="auctionWinner"
            @startAuction="whichAction($event)"
            @startBidding="startBidding($event)"
            @stopAuction="stopAuction($event)"
            @placeBottle="placeBottle('auction', $event)"
            @startWinnerCard="startWinnerCard($event)"

            />

       <div v-if="players[playerId]" class="playerBoard">
         <div class="playerTitle"> Player {{playerId}}'s Board </div>
             <div class="chosenSkillCard" v-for="(card, index) in players[playerId].skills" :card="card" :key="index">
                  <CollectorsCard
                  :card="card"
                  />
                  </div>
            <div class="chosenItemCard" v-for="(card, index) in players[playerId].items" :card="card" :key="index">
                  <CollectorsCard
                  :card="card"
                  />
           </div>
             <!-- Visa spelarens färg och iterera fram rätt antal energybottles på playerboard -->
           <div class="playerBottles">
                <div v-if="('black' === players[playerId].color)">
                    <div v-for="index in players[playerId].playerBottles" :key="index">
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
        Hand
        <!-- visa spelarens kort i handen, förstår inte varför korten blir pyttesmå -->
        <div class="cardslots" v-if="players[playerId]">
          <div v-for="(card, index) in players[playerId].hand" :key="index">
          <CollectorsCard  :card="card" :availableAction="card.available" @doAction="buyCard(card)" />
        </div>
      </div>

        <!-- visa hur mycket pengar man har -->
          <ul>
            <li v-for="(value, key) in players" :key = "key">
              <div v-for="(valuevalue,keykey) in value" :key ="keykey">
                <div v-if="keykey == 'money' && key == playerId ">
                  My money: {{valuevalue}}
                </div>
                <div v-if="keykey == 'money' && key != playerId ">
                  Other players money: {{valuevalue}}
                </div>
              </div>
            </li>
          </ul>
      </div>
      <!-- Vems tur? Start på ruta för att visa vems tur -->
      <div class="turnCounter">
        <h3> Who's turn? </h3>
        <button class="turnButton"  @click= "changeTurn">  <!--  @click= "changeTurn" -->
          <div v-if="currentPlayer === '' ">
            <h5>  {{allPlayersId[0]}} </h5> <h3> Press here when you're done.</h3>
          </div>
          <div v-else>
            <h5>   {{currentPlayer}} </h5> <h3> Press here when you're done.</h3>
          </div>
        </button>
      </div>

      <div class="roundCounter">
        <h3> Round:  </h3>
        <button class="roundButton"  @click= "changeRound">
          <div v-if="currentRound < 5">
            <h5> {{currentRound}} </h5> <h3> Press here when round {{currentRound}} is over.</h3>
          </div>
          <div v-else>
            <h5> Game Ended </h5>
          </div>
        </button>
      </div>

      <!-- Ruta för att visa vilka spelare som är i rummet -->
      <div class="showPlayers">
        The players in this room:
        <div v-for="(player,key) in players" :key = "key">
          <div>
            {{key}}
          </div>
        </div>
      </div>
     </div>
    </div>

    <button title="Rules!" type="button" id="rulesButton" class="rulesButton" v-on:click="ruleFunction">
      <h2>Click here to read the rules!</h2>
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

      <CollectorsBuyActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :itemsOnSale="itemsOnSale"
        :marketValues="marketValues"
        :placement="buyPlacement"
        @buyCard="buyCard($event)"
        @placeBottle="placeBottle('buy', $event)"
        />
<!--      <div class="buttons">
        <button @click="drawCard">
          {{ labels.draw }}
        </button>
      </div>
-->

    <!--  <div class="cardslots">
        <CollectorsCard v-for="(card, index) in skillsOnSale" :card="card" :key="index"/>
      </div> -->

      <!--<div class="cardslots">
        <CollectorsCard v-for="(card, index) in auctionCards" :card="card" :key="index"/>
      </div>-->
    <!--  Hand
      <div class="cardslots" v-if="players[playerId]">
        <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="buyCard(card)" :key="index"/>
      </div> -->

      <!-- <div class="cardslots" v-if="players[playerId]">
        <CollectorsCard v-for="(card, index) in players[playerId].items" :card="card" :key="index"/>
      </div> -->
</main>
    {{players}}
    {{marketValues}}
    <button v-if="players[playerId]" @click="players[playerId].money += 1">
      fake more money
    </button>
    <footer>
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
import CollectorsBuyActions from '@/components/CollectorsBuyActions.vue'
import CollectorsGetSkills from '@/components/CollectorsGetSkills.vue'
import CollectorsStartAuction from '@/components/CollectorsStartAuction.vue'
import CollectorsBuyItem from '@/components/CollectorsBuyItem.vue'
import CollectorsMarket from '@/components/CollectorsMarket.vue'
import CollectorsWork from '@/components/CollectorsWork.vue'

export default {
  name: 'Collectors',
  components: {
    CollectorsCard,
    CollectorsBuyActions,
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
      chosenPlacementCost: null,
      marketValues: { fastaval: 0,
                     movie: 0,
                     technology: 0,
                     figures: 0,
                     music: 0 },
      itemsOnSale: [],
      skillsOnSale: [],
      auctionCards: [],
      market:[],
      cardUpForAuction: {},
      auctionWinner: "",
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
        this.auctionCards = d.auctionCards;
        this.buyPlacement = d.placements.buyPlacement;
        this.skillPlacement = d.placements.skillPlacement;
        this.marketPlacement = d.placements.marketPlacement;
        this.auctionPlacement = d.placements.auctionPlacement;
        this.workPlacement = d.placements.workPlacement;
        
      }.bind(this));
    this.$store.state.socket.on('collectorsBottlePlaced',
      function(d) {
        this.buyPlacement = d.buyPlacement;
        this.skillPlacement = d.skillPlacement;
        this.marketPlacement = d.marketPlacement;
        this.auctionPlacement = d.auctionPlacement;
        this.workPlacement = d.workPlacement;
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
          this.currentRound = d;
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
    console.log(d.auctionWinner, "socket ish auction winner")
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
    console.log(d.players, "BIDDING STARTED I COLLECTORS.VUE");
    this.players = d.players;
    this.highestBid = d.highestBid;
    console.log(d.highestBid, "högsta budet");
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
  console.log(d.playerId, "starts with ", d.players[d.playerId].money," coins");
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
    changeUserName: function() {
     var userName = document.getElementById('userName').value;
      console.log(userName);
      //var name = playerId();
      this.$store.state.playerId = userName;
    //  this.players[playerId] = userName;
      console.log(this.$store.state.playerId);

    },
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
      if (this.chosenAction === "work" ) {
        console.log("whichAction = work")
      }
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
          skill: this.skillsOnSale,
        }
      );
    },

    startAuction: function (card) {
      console.log("startAuction", card);
      this.$store.state.socket.emit('collectorsStartAuction', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          card: card,
          auctionCard: this.auctionCards,
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

    changeRound: function () {
      this.$store.state.socket.emit('collectorsChangeRound', {
          roomId: this.$route.params.id,
          currentRound: this.currentRound
          }
        );
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
          } */
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
	margin: 20px ;
	background: $black;
	border: 2px solid $black;
  }
  .playerBottleButton div:hover{
    transform: scale(1.5)translate(0,0);
    z-index: 1;

  }
  .blackBottle{
    width:50px;
    height:50px;
    background-image:  url('/images/player-bottle-black.png');
    background-size: cover;
  }
  #black {
    background-color: #474342;
    border-radius: 5px;
    border: 2px solid #E3A688;
  }
  .blueBottle{
    width:50px;
    height:50px;
    background-image:  url('/images/player-bottle-blue.png');
    background-size: cover;
  }
  #blue {
    background-color: #12B3A9 ;
    border-radius: 5px;
    border: 2px solid #E3A688;
  }
  .brownBottle{
    width:50px;
    height:50px;
    background-image:  url('/images/player-bottle-brown.png');
    background-size: cover;
  }
  #brown {
    background-color: #B79048 ;
    border-radius: 5px;
    border: 2px solid #E3A688;
  }
  .purpleBottle{
    width:50px;
    height:50px;
    background-image:  url('/images/player-bottle-purple.png');
    background-size: cover;
  }
  #purple {
    background-color: #6B2977;
    border-radius: 5px;
    border: 2px solid #E3A688;
  }
  /*.marketPool{
    grid-column: 3/span 5;
    grid-row: 11/span 4;
    width: auto;
    height: auto;
    background-color: #c9d5e1;
    color: black;
    display: grid;
    grid-template-columns: repeat(5, 60px);
    grid-template-rows: repeat(5, 27.5px);
    }*/

/* Har ej vågat radera WORK än, men finns i component
.titleWorkPool {
  font-style: italic;
  font-size: 50px;
  text-shadow: 2px 2px 4px yellow;
  font-size: 20px;
}
  .workPool{
    grid-column: 3/span 5;
    grid-row: 6/span 5;
    width: auto;
    height: auto;
    display:grid;
    grid-template-columns: repeat(2, 224px);
    grid-template-rows: repeat(3,50px);
    background-color: #f5f2cc;
    color: black;

    border-top: 2px solid #4C7B80;
  }
  .quarterImage {
    grid-column: 2;
    grid-row: 3;
  }
  .quarter1 {
    grid-column: 2 ;
    grid-row: 1;
    width: 140px;
    height: 62px;
    background-image: url('/images/quarterTile1.png');
    background-size: cover;
  }
  .quarter2 {
    grid-column: 2 ;
    grid-row: 1;
    width: 140px;
    height: 62px;
    background-image: url('/images/quarterTile2.png');
    background-size: cover;
  }
  .quarter3 {
    grid-column: 2 ;
    grid-row: 1;
    width: 140px;
    height: 62px;
    background-image: url('/images/quarterTile3.png');
    background-size: cover;
  }
  .quarter4 {
    grid-column: 2 ;
    grid-row: 1;
    width: 140px;
    height: 62px;
    background-image: url('/images/quarterTile4.png');
    background-size: cover;
  }

  .Alt1 {
    grid-column: 1 ;
    grid-row: 1;
    width: 130px;
    height: 60px;
    background-image: url('/images/WorkPoolAlt1.jpg');
    background-size: cover;
  }
  .Alt2 {
    grid-column: 1 ;
    grid-row: 2;
    width: 130px;
    height: 60px;
    background-image: url('/images/WorkPoolAlt2.jpg');
    background-size: cover;
  }
  .Alt3 {
    grid-column: 1 / span 2 ;
    grid-row: 3;
    width: 130px;
    height: 60px;
    background-image: url('/images/WorkPoolAlt3.jpg');
    background-size: cover;
  }
  .Alt4 {
    grid-column: 1 ;
    grid-row: 4;
    width: 152px;
    height: 60px;
    background-image: url('/images/WorkPoolAlt4.jpg');
    background-size: cover;
  }
  */

  .playerBoard {
    grid-column: 11/span 5;
    grid-row: 2/span 6;
    width: auto;
    height: auto;
    display: grid;
    grid-template-columns: repeat(10, 60px);
    grid-template-rows: repeat(3,60px);
    background-color: pink ;
    color: black;
    display: grid;
    grid-template-columns: repeat(8, 60px);
    grid-template-rows: repeat(3,60px);
    grid-auto-flow: row;
    grid-column-gap: 25px;
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
  .chosenSkillCard {
    grid-row: 3;
    transform: scale(0.25);
  }
  .chosenItemCard {
    grid-row: 1;
    transform: scale(0.25);
  }
  .playerHand {
    grid-column: 11/span 5;
    grid-row: 8/span 4;
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

#userName {
  background-color: #76B0B7;
}
#linkSquare {
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
  .cardslots {
    display: grid;
    grid-template-columns: repeat(auto-fill, 130px);
    grid-template-rows: repeat(auto-fill, 1px);
  }
  .cardslots div {
    transform: scale(0.3)translate(-50%,-50%); /* scale - minska kortens strl*/
    transition:0.2s;
    transition-timing-function: ease-out;
    z-index: 0;
  }
  .cardslots div:hover {
    transform: scale(1)translate(-25%,0);
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

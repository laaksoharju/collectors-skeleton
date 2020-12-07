<template>
  <div>
    <main>
      <div class="table">
      <div class="board">

       <div class = "skillPool">
         Skill Pool
         <div class = "EnergyBottles">
         </div>
         <div class = "EnergyBottles">
         </div>
         <div class = "EnergyBottles">
         </div>

         <div class = "EnergyBottleCoin">
         </div>
         <div class = "EnergyBottleCoin">
         </div>

           <div class="skillCard" v-for="(card, index) in skillsOnSale" :key="index">
             <CollectorsCard :card="card" />
           </div>
       </div>

       <div class = "itemPool">
        Item Pool
          <div class = "ItemBottleCoinOne">
          </div>
          <div class = "ItemBottleCoinOne">
          </div>
          <div class = "ItemBottleCoinTwo">
          </div>
          <div class = "ItemBottleCoinThree">
          </div>

          <div class="itemCard" v-for="(card, index) in itemsOnSale" :key="index">
            <CollectorsCard :card="card" />
          </div>
          <!--<div class="itemCard" v-if="players[playerId]">
            <CollectorsCard v-for="(card, index) in players[playerId].items" :card="card" :key="index"/>
          </div>-->
       </div>


       <div class = "marketPool">
         Market Pool
         <div class = "iconBird"></div>
         <div class = "iconRobot"></div>
         <div class = "iconMusic"></div>
         <div class = "iconFilm"></div>
         <div class = "iconTech"></div>
       </div>
       <div class = "workPool">
         Work Pool
       </div>


       <div class = "auctionPool">
        <div class= "titleAuctionPool"> Auction Pool</div>
         <div class="cardslots">
           <CollectorsCard v-for="(card, index) in auctionCards" :card="card" :key="index"/>
         </div>
         <div class = "EnergyBottleCoinWhiteTwo"></div> <!-- Olika flaskor med vita coins, 1 2 eller 0 -->
         <div class = "EnergyBottleCoinWhiteOne"></div>
         <div class = "EnergyBottleCoinWhiteNoll"></div>
         <div class = "EnergyBottleCoinWhiteNoll second"></div>
       </div>
       <div class="playerBoard">
          Player {{playerId}}'s Board
      </div>
      <div class="playerHand">
        Hand
        <div class="cardslots" v-if="players[playerId]">
          <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="buyCard(card)" :key="index"/>
        </div>
      </div>
      <div class="turnCounter">
        <h3> Who's turn? </h3>
        <h2> Player {{playerId}} </h2>
      </div>

      <div class="showPlayers">
        The players in this room:
        <div v-for="(player,key) in players" :key = "key">
          <div>
            {{key}}
          </div>
        </div>
      </div>
     </div>
     <!-- Början på att ta ut players, vems tur, här får vi en array
     {{allPlayersId}} -->

  </div>

    {{buyPlacement}} {{chosenPlacementCost}}


      <CollectorsBuyActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :itemsOnSale="itemsOnSale"
        :marketValues="marketValues"
        :placement="buyPlacement"
        @buyCard="buyCard($event)"
        @placeBottle="placeBottle('buy', $event)"/>
      <div class="buttons">
        <button @click="drawCard">
          {{ labels.draw }}
        </button>
      </div>
      <buyItemsActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :itemsOnSale="itemsOnSale"
        :marketValues="marketValues"
        :placement="buyPlacement"
        @buyCard="buyCard($event)"
        @placeBottle="placeBottle('buy', $event)"/>
      <div class="buttons">
        <button @click="drawCard">
          {{ labels.draw }}
        </button>
      </div>
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

export default {
  name: 'Collectors',
  components: {
    CollectorsCard,
    CollectorsBuyActions
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
    playerId: function() { return this.$store.state.playerId},
    allPlayersId: function() {
      return Object.keys(this.players) //få nyckeln till players - playerId
    }
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
  },
  methods: {
    selectAll: function (n) {
      n.target.select();
    },
    placeBottle: function (action, cost) {
      this.chosenPlacementCost = cost;
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
  .table {
    padding-left: 50px;
    padding-right: 50px;
  }
  .board {
	display: grid;
	grid-template-columns: repeat(15,90px);
	grid-template-rows: repeat(20, 45px)  ;
	grid-gap: 0px;
	margin: 20px ;
	width: 994px;
	height: 994px;
	background: $black;
	border: 2px solid $black;
  }

  .skillPool{
    grid-column: 1 / span 2;
    grid-row: 2/span 13 ;
    width: auto;
		height: auto;
    background-color: #dce5cc;
    color: black;
    display: grid;
    grid-template-columns: repeat(3, 50px);
    grid-template-rows: repeat(6,50px);
    grid-auto-flow: column;
    }

  .EnergyBottles{

    width:50px;
    height:50px;
    background-image:  url('/images/Gain-skill-bottle.png');
    background-size: cover;
  }

  .EnergyBottleCoin{

    width:50px;
    height:50px;
    background-image:  url('/images/Gain-skill-bottle-coin.png');
    background-size: cover;
  }



  .itemPool{
    grid-column: 3/span 5 ;
    grid-row: 2/span 4;
    width: auto;
    height: auto;
  /*  grid-template-columns: repeat(100, 12px);
    grid-template-rows: repeat(100,150px);*/
    background-color: #f0d9cc ;
    color: black;
    display: grid;
    grid-template-columns: repeat(5, 50px);
    grid-template-rows: repeat(2,50px);
    grid-auto-flow: row;
  }

  .ItemBottleCoinOne{
    width:50px;
    height:50px;
    background-image:  url('/images/item-bottle-coin-one.png');
    background-size: cover;
  }

  .ItemBottleCoinTwo{
    width:50px;
    height:50px;
    background-image:  url('/images/item-bottle-coin-two.png');
    background-size: cover;
  }

  .ItemBottleCoinThree{
    width:50px;
    height:50px;
    background-image:  url('/images/item-bottle-coin-three.png');
    background-size: cover;
  }


  .marketPool{
    grid-column: 3/span 5;
    grid-row: 11/span 4;
    width: auto;
    height: auto;
  /*  grid-template-columns: repeat(100, 12px);
    grid-template-rows: repeat(100,150px);*/
    background-color: #c9d5e1;
    color: black;
    display: grid;
    grid-template-columns: repeat(5, 60px);
    grid-template-rows: repeat(5, 27.5px);
    }

  .workPool{
    grid-column: 3/span 5;
    grid-row: 6/span 5;
    width: auto;
    height: auto;
    grid-template-columns: repeat(100, 12px);
    grid-template-rows: repeat(100,150px);
    background-color: #f5f2cc;
    color: black;
  }
  .auctionPool{
    grid-column: 8/span 2;
    grid-row: 2/span 13;
    width: auto;
    height: auto;
    background-color: beige;
    color: black;
    display: grid;
    grid-template-columns: repeat(3, 50px);
    grid-template-rows: repeat(6,100px);
    grid-auto-flow: column;
  }

.titleAuctionPool{
  grid-column: 3;
  grid-row: 1;
}
  .EnergyBottleCoinWhiteNoll{
    width:45px;
    height:45px;
    background-image:  url('/images/Coin-white.png');
    background-size: cover;
    grid-column: 1;
    grid-row: 3;
  }
  .second{
    grid-column: 1;
    grid-row: 4;
  }

  .EnergyBottleCoinWhiteTwo{
    width:45px;
    height:45px;
    background-image:  url('/images/Coin-white-2.png');
    background-size: cover;
    grid-column: 1;
    grid-row: 1;
  }

  .EnergyBottleCoinWhiteOne{
    width:45px;
    height:45px;
    background-image:  url('/images/Coin-white-1.png');
    background-size: cover;
    grid-column: 1;
    grid-row: 2;
  }


  .playerBoard {
    grid-column: 11/span 5;
    grid-row: 2/span 4;
    width: auto;
    height: auto;
    display: grid;
    grid-template-columns: repeat(10, 60px);
    grid-template-rows: repeat(3,60px);
    background-color: pink ;
    color: black;
  }
  .playerHand {
    grid-column: 11/span 5;
    grid-row: 6/span 4;
  }

  .turnCounter {
    background-color: green;
    color:white;
    grid-column: 4/ span 2;
    grid-row: 16/span 2;
    text-align: center;
  }
  .showPlayers {
    background-color: #406c72;
    color: white;
    grid-column: 1/ span 2;
    grid-row: 16/span 2;
    text-align: center;
  }

  .buttons{
    grid-column: 1;
    grid-row: 10;
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
  /*  display: grid;
    grid-template-columns: repeat(100, 15px);
    grid-template-rows: repeat(1,150px);*/
  /*  justify-content: center;
    align-items: center; */
  }
  .cardslots div {
    transform: scale(0.3)translate(-50%,-50%); /* scale - minska kortens strl*/
    transition:0.2s;
    transition-timing-function: ease-out;
    z-index: 0;
  }




  .skillCard {
    transform: scale(0.25);
  /*  display: grid;
    grid-template-columns: repeat(1, 15px);
    grid-template-rows: repeat(5,160px);*/
  }
  .skillCard div:hover{
    transform: scale(2)translate(-25%,0);
    z-index: 1;
  }

  .itemCard{
    transform: scale(0.3);
  }

  .itemCard div:hover{
    transform: scale(2)translate(-25%,0);
    z-index: 1;
  }


  .cardslots div:hover {
    transform: scale(1)translate(-25%,0);
    z-index: 1;
  }
  .iconBird {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconBird.PNG');
    background-size: cover;
    grid-column: 1;
    grid-row: 10;

  }
  .iconRobot {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconRobot.PNG');
    background-size: cover;
    grid-column: 2;
    grid-row: 10;

  }
  .iconMusic {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconMusic.PNG');
    background-size: cover;
    grid-column: 3;
    grid-row: 10;
  }
  .iconFilm {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconFilm.PNG');
    background-size: cover;
    grid-column: 4;
    grid-row: 10;
  }
  .iconTech {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconTech.PNG');
    background-size: cover;
    grid-column: 5;
    grid-row: 10;
  }

  @media screen and (max-width: 800px) {
    main {
      width:90vw;
    }
  }
</style>

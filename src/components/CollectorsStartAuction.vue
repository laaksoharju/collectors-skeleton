<template>
<div class = "auctionPool">
  <div class= "titleAuctionPool" > Auction Pool</div>

  <div class = "auctionSquare">
    {{labels.auctionsquare}}
  </div>
  <div class = "cardUpForAuction">  <!-- kortet som läggs i auction square-->
    <CollectorsCard :card="cardUpForAuction"/>
  </div>

  <div class = "bidSquare" >
    <form>
      <label for="bidSquare">{{labels.placebid}}:</label>
      <input type="text" id="bidSquare" name="bidSquare">
    </form>
  </div>

  <button  id = "bidPlacementButton" @click="startBidding()">{{labels.placebid}}!</button>
  <button  id = "stopAuctionButton" @click="stopAuction()">{{labels.stop}} </button>

  <div class="winner">
    {{labels.auctionwinner}}{{auctionWinner}}
    {{labels.bid}}{{highestBid}}
  </div>
  <!--knapparna för flaskor, auction button + index läggs till i v-for för att ta bort duplicate keys error-->
  <div class="buttons" v-for="(p, index) in placement" :key="'Auction Button'+index">
    <button id="buttonNollSecond" v-if="p.playerId===null && p.cost===0 && p.placementId=== 0"
        :disabled="cannotAfford(p.cost)"
        @click="placeBottle(p)">
        <div class = "EnergyBottleCoinWhiteNoll second">
        </div>
   </button>

   <button id="buttonNollFirst" v-if="p.playerId===null && p.cost===0 && p.placementId=== 1 "
        :disabled="cannotAfford(p.cost)"
        @click="placeBottle(p)">
        <div class = "EnergyBottleCoinWhiteNoll second">
        </div>
   </button>

   <button id="buttonOne" v-if="p.playerId===null && p.cost===-1"
        :disabled="cannotAfford(p.cost)"
        @click="placeBottle(p)">
        <div class = "EnergyBottleCoinWhiteOne">
        </div>
   </button>

   <button id="buttonTwo" v-if="p.playerId===null && p.cost===-2"
        :disabled="cannotAfford(p.cost)"
        @click="placeBottle(p)">
        <div class = "EnergyBottleCoinWhiteTwo">
        </div>
   </button>
 </div>
 <!-- här skapas korten som finns i auction pool-->
 <div class = "start-auction">
   <div id = "start-auctionID" v-for="(card, index) in auctionCards" :key="index">
     <CollectorsCard
      :card="card"
      :availableAction="card.available"
      @doAction="startAuction(card)"/>
  </div>
</div>
  <!--knapparna som dyker upp då auction avslutas-->
  <div class="auctionButtons" >
    <button class = "auctionSkill" v-if="auctionWinner !== ''" @click="startWinnerCard('skill')"> PLACE AS SKILL </button>
    <button class = "auctionMarket" v-if="auctionWinner !== ''" @click="startWinnerCard('market')"> PLACE IN MARKET </button>
    <button class = "auctionItem" v-if="auctionWinner !== ''" @click="startWinnerCard('item')"> PLACE AS ITEM </button>
  </div>

</div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'
export default {
  name: 'CollectorsStartAuction',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    players: Object,
    player: Object,
    auctionCards: Array,
    cardUpForAuction: Object,
    auctionWinner: String,
    highestBid: Number,
    //bids: Object,
    marketValues: Object,
    placement: Array,
  },
  methods: {
    startAuction: function (card) {
      if (card.available){
        this.$emit('startAuction', card);
        this.highlightAvailableCards()
        }
      },
  startWinnerCard: function(action){
    this.$emit('startWinnerCard', action);
  },
  startBidding: function (){
     var bid = Number(document.getElementById("bidSquare").value);
     this.player.bids = bid;
     this.$emit('startBidding', this.player.bids);
  },
//Stop auction - här skickas det kort som är upp to auction vidare
  stopAuction: function (){
     this.$emit('stopAuction');
  },
  cannotAfford: function (cost) {
    let minCost = 100;
    for(let key in this.marketValues) {
      if (cost + this.marketValues[key] < minCost)
        minCost = cost + this.marketValues[key]
      }
    return (this.player.money < minCost);
  },
  cardCost: function (card) {
    return this.marketValues[card.market];
  },
  placeBottle: function (p) {
    if(this.player.playerBottles>0){
    this.$emit('placeBottle', p);
    this.highlightAvailableCards(p.cost);
  }
  },
   highlightAvailableCards: function (cost=100){
      for (let i = 0; i < this.auctionCards.length; i += 1) {
          this.$set(this.auctionCards[i], "available", true);
        if (this.marketValues[this.auctionCards[i].item] <= this.player.money - cost) {
            this.$set(this.auctionCards[i], "available", true);
          }
        else {
            this.$set(this.auctionCards[i], "available", false);
          }
          this.chosenPlacementCost = cost;
        }
      }
    }
  }
</script>

<style scoped>
.auctionPool{
  grid-column: 8/span 2;
  grid-row: 2/span 13;
  width: auto;
  height: auto;
  background-color: beige;
  color: black;
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(10,48.5px);
  grid-row-gap: 10px;
  grid-auto-flow: column;
  border: 2px solid #4C7B80;
}
.titleAuctionPool{
grid-column: 1;
grid-row: 1;
font-style: italic;
font-size: 50px;
text-shadow: 2px 2px 4px #75755C;
font-size: 20px;
}
.EnergyBottleCoinWhiteNoll{
  width:45px;
  height:45px;
  background-image:  url('/images/Coin-white.png');
  background-size: cover;
  grid-column: 1;
}
.second{
  grid-column: 1;
  grid-row: 5;
}
.EnergyBottleCoinWhiteTwo{
  width:45px;
  height:45px;
  background-image:  url('/images/Coin-white-2.png');
  background-size: cover;
}
.EnergyBottleCoinWhiteOne{
  width:45px;
  height:45px;
  background-image:  url('/images/Coin-white-1.png');
  background-size: cover;
}

.auctionSquareText {
  grid-column: 1 / span 2;
  grid-row: 7;
  place-self: end left;
  font-style: italic;
  color: #eb6579;
  text-shadow: 2px 2px 4px white;
  font-size: 16px;
}

.auctionSquare{
  grid-column: 1;
  grid-row: 8;
  height: 120px;
  width: 90px;
  border: 5px dotted pink;
  font-style: italic;
  font-size: 50px;
  text-shadow: 2px 2px 4px pink;
  font-size: 14px;
  transform-origin: 0 50px;
  }

  .bidSquare {
    grid-column: 1;
    grid-row: 10;
    margin-top: 20%;
  }
#bidSquare {
  width: 40px;
  height: 20px;
  grid-column: 2;
}
form {
  grid-column: 1;
  grid-row: 8;
  font-size: 13px;
}
#bidPlacementButton {
  height: 30px;
  width: 50px;
  font-size: 12px ;
    grid-column: 2;
    grid-row: 10;
    margin-top: 40%;
    background-color: lightpink;
    border-radius: 12px;
    border: 2px solid #BD5467;
  }

#bidPlacementButton:hover {
  background-color: #BD5467;
  border: 2px solid lightpink;
}
  .cardUpForAuction {
  transform: scale(0.30);
  grid-column: 1;
  grid-row: 8;
  height: 30px;
  width: 35px;
  }

  .cardUpForAuction div:hover{
    transform: scale(1.30)translate(0,0);
    z-index: 1;
  }

  .start-auction{
    transform: scale(0.25);
    grid-column: 2;
  }
  .start-auction div:hover{
    transform: scale(1.25)translate(-15%,0);
    z-index: 1;
  }
  .buttons{
    border-radius: 9px;
  }
  .auctionButtons{
    grid-column: 3;
    grid-row: 7;
    place-self: right;
  }
  .winner{
    grid-row:2;
    grid-column:1;
    place-self: top center;
    font-size: 12px;
  }
  #stopAuctionButton{
    border-radius: 9px;
    background-color: #C86262;
    height: 20px;
    width: 50px;
    grid-row:10;
    grid-column:3;
    place-self: end center;
    border: 2px solid #A22626;
  }
  #stopAuctionButton:hover {
    background-color: #A22626;
    border: 2px solid #C86262;
  }
  #buttonNollSecond {
    background-color: white;
    border-radius: 5px;
    border: 2px solid #D4D4B8;
  }

  #buttonNollFirst {
    background-color: white;
    border-radius: 5px;
    border: 2px solid #D4D4B8;
  }

  #buttonOne {
    background-color: white;
    border-radius: 5px;
    border: 2px solid #D4D4B8;
  }
  #buttonTwo {
    background-color: white;
    border-radius: 5px;
    border: 2px solid #D4D4B8;
  }
  .buttons div:hover {
    transform: scale(1.5)translate(0,0);
    z-index: 1;
  }

@media screen and (max-width: 800px) {
  .auctionPool{
    grid-column: 1/span 7;
    grid-row: 18/span 4;
    width: auto;
    height: auto;
    background-color: beige;
    color: black;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(-90px, 1fr));
    grid-template-rows: repeat(3,60px);
    grid-row-gap: 10px;
    grid-auto-flow: row;
    border: 2px solid #4C7B80;
  }
  .titleAuctionPool{
  grid-column: 1 /span 2;
  grid-row: 1;
  font-style: italic;
  font-size: 50px;
  text-shadow: 2px 2px 4px #75755C;
  font-size: 20px;
  }
  .EnergyBottleCoinWhiteNoll{
    width:45px;
    height:45px;
    background-image:  url('/images/Coin-white.png');
    background-size: cover;
  }
  .second{
    grid-column: 1;
    grid-row: 5;
  }

  .auctionSquare{
    grid-column: 9;
    grid-row: 1;
    height: 150px;
    width: 110px;
    border: 5px dotted pink;
    font-style: italic;
    font-size: 50px;
    text-shadow: 2px 2px 4px pink;
    font-size: 14px;
    }
    .bidSquare {
      grid-column: 7;
      grid-row: 1;
      margin-top: 20%;
    }

  #bidPlacementButton {
    height: 40px;
    width: 50px;
    font-size: 12px ;
      grid-column: 8;
      grid-row: 1;
      margin-top: 40%;
      background-color: lightpink;
      border-radius: 12px;
      border: 2px solid #BD5467;
    }

    .cardUpForAuction {
    transform: scale(0.35);
    grid-column: 9;
    grid-row: 1;

    }
    .start-auction{
      grid-column-start: 1;
      grid-column-end: 7;
      display: grid;
      grid-template-columns: 12vw 12vw 12vw 12vw;
      transform: scale(1);
    }

    #start-auctionID{
      transform: scale(0.25);
      transform-origin: 0 0;
    }

    .start-auction div:hover{
      transform: scale(1.25)translate(-15%,0);
      z-index: 1;
    }

    .auctionButtons{
      grid-column: 10;
      grid-row: 1;
      place-self: right;
    }
    .winner{
      grid-row:3;
      grid-column:7/span 2;
      place-self: top center;
      font-size: 15px;
    }
    #stopAuctionButton{
      border-radius: 9px;
      background-color: #C86262;
      height: 40px;
      width: 50px;
      grid-row:2;
      grid-column:7;
      place-self: start;
      border: 2px solid #A22626;
    }
}

</style>


<template>

<div class = "auctionPool">
 <div class= "titleAuctionPool" > Auction Pool</div>

<div class = "auctionSquare">
  Auction Square
</div>
<div class = "cardUpForAuction">
  <CollectorsCard :card="cardUpForAuction"/>
</div>

<div class = "bidSquare" >
  <form>
  <label for="bidSquare">Place bid:</label>
  <input type="text" id="bidSquare" name="bidSquare">
  </form>
</div>

<button  id = "bidPlacementButton" @click="startBidding()">Place bid!</button>

<button  id = "stopAuctionButton" @click="stopAuction()">Stop! </button>

<div class="winner">
Winner: {{auctionWinner}}
</div>




 <!--<div class="buttons" v-for="(p, index) in placement" :key="index"> -->
<div class="buttons" v-for="(p, index) in placement" :key="'Auction Button'+index">

   <button id="buttonNollSecond" v-if="p.playerId===null & p.cost===0"
   :disabled="cannotAfford(p.cost)"
   @click="placeBottle(p)">
     <div class = "EnergyBottleCoinWhiteNoll second">
     </div>
   </button>

   <button id="buttonOne" v-if="p.playerId===null & p.cost===-1"
   :disabled="cannotAfford(p.cost)"
   @click="placeBottle(p)">
     <div class = "EnergyBottleCoinWhiteOne">
     </div>
   </button>

   <button id="buttonTwo" v-if="p.playerId===null & p.cost===-2"
   :disabled="cannotAfford(p.cost)"
   @click="placeBottle(p)">
     <div class = "EnergyBottleCoinWhiteTwo">
     </div>
   </button>
 </div>




<div class = "start-auction" >
  <div v-for="(card, index) in auctionCards" :key="index">
    <CollectorsCard
      :card="card"
      :availableAction="card.available"
      @doAction="startAuction(card)"/>
  </div>
</div>

<div class="auctionButtons" v-for="(value, key) in players" :key = "key">


  <button class = "auctionSkill" v-if="auctionWinner === key" @click="startWinnerCard('skill')"> PLACE AS SKILL </button>
  <button class = "auctionMarket" v-if="auctionWinner === key" @click="startWinnerCard('market')"> PLACE IN MARKET </button>
  <button class = "auctionItem" v-if="auctionWinner === key" @click="startWinnerCard('item')"> PLACE AS ITEM </button>

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
    console.log('started winner card with action'+action);
    
    this.$emit('startWinnerCard', action);
  },


  startBidding: function (){
     var bid = Number(document.getElementById("bidSquare").value);
     this.player.bids = bid;
     console.log(this.player, "started bidding");
     this.$emit('startBidding', this.player.bids);

  },
//Stop auction - här skickas det kort som är upp to auction vidare
  stopAuction: function (){
    console.log(this.cardUpForAuction, "stopAuction i CollectorsStartAuction");
     this.$emit('stopAuction', this.cardUpForAuction);
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
    this.$emit('placeBottle', p.cost);
    this.highlightAvailableCards(p.cost);
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
  grid-column: 1;
  grid-row: 3;
}

.auctionCard {
    transform: scale(0.25);
    grid-column: 2;
  }

.auctionCard div:hover{
    transform: scale(2)translate(-25%,0);
    z-index: 1;
  }

.auctionSquare{
  grid-column: 1;
  grid-row: 7;
  height: 180px;
  width: 130px;
  border: 5px dotted pink;
  font-style: italic;
  font-size: 50px;
  text-shadow: 2px 2px 4px pink;
  font-size: 14px;
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
  width: 100px;
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
  transform: scale(0.45);
  grid-column: 1;
  grid-row: 7;
  height: 70px;
  width: 50px;
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
    height: 20px;
    width: 50px;
    grid-row:2;
    grid-column:1;
    place-self: end center;
  }

  #buttonNollSecond {
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

</style>
